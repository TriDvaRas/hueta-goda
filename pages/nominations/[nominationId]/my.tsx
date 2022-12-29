import { AspectRatio, Nomination, Nominee } from '@prisma/client';
import axios from 'axios';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, Col, Form, Row, Button, Badge, Image } from 'react-bootstrap';
import ReactPlaceholder from 'react-placeholder/lib/index';
import RectShape from 'react-placeholder/lib/placeholders/RectShape';
import { useLocalStorage } from 'usehooks-ts';
import arSQUARE from '../../../assets/svg/ar-SQUARE.svg';
import arTALL from '../../../assets/svg/ar-TALL.svg';
import arULTRATALL from '../../../assets/svg/ar-ULTRATALL.svg';
import arULTRAWIDE from '../../../assets/svg/ar-ULTRAWIDE.svg';
import arWIDE from '../../../assets/svg/ar-WIDE.svg';
import NominationWithNomineeDisplayEditable from '../../../components/displays/NominationWithNomineeDisplayEditable';
import NomineesTopEditor from '../../../components/editor/NomineesTopEditor';
import ImageUpload from '../../../components/image/ImageUpload';
import NominationPlaceholder from '../../../components/plaseholders/NominationPlaceholder';
import GetDefaultLayout from '../../../layouts/DefaultLayout';
import GetThinLayout from '../../../layouts/ThinLayout';
import { NominationFull } from '../../../types/extendedApiTypes';
import { randomSeededColor } from '../../../util/colors';
import { globalConfig } from '../../../util/globalConfig';
import { NextPageWithLayout } from '../../_app';
const ratioImgs: { img: any, ratio: AspectRatio }[] = [
    { img: arTALL, ratio: 'TALL' },
    { img: arSQUARE, ratio: 'SQUARE' },
    { img: arULTRATALL, ratio: 'ULTRATALL' },
    { img: arWIDE, ratio: 'WIDE' },
    { img: arULTRAWIDE, ratio: 'ULTRAWIDE' },
]

const NominationEdit: NextPageWithLayout = () => {
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)
    const [nominationId, setNominationId] = useState<string>(router.query.nominationId as string)
    useEffect(() => {
        setNominationId(router.query.nominationId as string)
    }, [router.query.nominationId])

    const [nomination, setNomination] = useState<NominationFull | undefined>(undefined)
    const [nominationLoading, setNominationLoading] = useState(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [localNominees, setLocalNominees] = useState<Nominee[]>([])
    const [selectedNominee, setSelectedNominee] = useState<Nominee | undefined>(undefined)
    const [showValidation, setShowValidation] = useState<boolean>(false)
    useEffect(() => {
        if (localNominees && selectedNominee)
            setLocalNominees(localNominees.map(x => x.position == selectedNominee.position ? selectedNominee : x))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNominee])

    const nominationsQueue = (router.query.fillQueue as string)?.split(',') || []
    const currentNominationQueueIndex = nominationsQueue.findIndex(x => x == nominationId)
    const multiMode = router.query.multiMode == 'true'
    useEffect(() => {
        if (nominationId && session) {
            setNominationLoading(true)
            axios.get<NominationFull>(`/api/nominations/${nominationId}?full=true`).then(res => {
                setNomination(res.data)
                if (res.data.Nominee && res.data.Nominee.length > 0) {
                    setLocalNominees(res.data.Nominee)
                    setSelectedNominee(res.data.Nominee[0])
                }
                else {
                    const dummy = {
                        ...globalConfig.dummyNominee,
                        position: 1,
                        authorUserId: session.user.id,
                    }
                    setLocalNominees([dummy])
                    setSelectedNominee(dummy)
                }
                setNominationLoading(false)
            })
        }
        return () => setNomination(undefined)
    }, [nominationId, session])

    function saveChanges() {
        if (nomineesValidation.includes(false)) {
            setShowValidation(true)
        }
        else if (nomination) {
            setIsSaving(true)
            axios.put(`/api/nominations/${nominationId}/mynominees`, localNominees)
                .then((res) => {
                    setLocalNominees(res.data)
                    setNomination({ ...nomination, Nominee: res.data })
                    setIsSaving(false)
                })
        }
    }
    if (sessionStatus == 'unauthenticated')
        router.push('/401')
    const addNominee = () => {
        if (session) {
            const newNom = {
                ...globalConfig.dummyNominee,
                position: Math.max(...localNominees.map(x => x.position)) + 1,
                authorUserId: session.user.id,
            }
            setLocalNominees([...localNominees, newNom])
            setSelectedNominee(newNom)
        }
    }
    const nomineesValidation = localNominees.map(x => {
        if (x.name.trim().length == 0)
            return false
        if (x.name.match(/^\s*$/))
            return false
        if (!x.imageId)
            return false
        return true
    })
    if (!nomineesValidation.includes(false) && showValidation) {
        setShowValidation(false)
    }
    const isSaved = _.isEqual(nomination?.Nominee, localNominees)
    return <div>
        <Row className=' my-3 mx-3'>
            <Col lg={12}>
                <Row className='mt-3'>
                    <Col>
                        {multiMode && <ReactPlaceholder showLoadingAnimation ready={!!nomination}
                            customPlaceholder={<div className='w-100 mw-100' >
                                <RectShape color='#3f574c' className='my-2' style={{ height: '40', width: `100%`, borderRadius: 15 }} />
                            </div>}>
                            <Card bg='dark' text='light' className='mt-2 w-100'>
                                <Card.Body className='d-flex'>
                                    <Button className='me-auto' variant='secondary' disabled={currentNominationQueueIndex == 0}>
                                        <Link href={`/nominations/${nominationsQueue[currentNominationQueueIndex - 1]}/my?multiMode=true&fillQueue=${nominationsQueue.join(`,`)}`}><i className="bi bi-chevron-left"></i>Предыдущая</Link>
                                    </Button>
                                    <h3 className='mb-0'>Номинация {currentNominationQueueIndex + 1}/{nominationsQueue.length}</h3>
                                    <Button className='ms-auto' variant='secondary' disabled={currentNominationQueueIndex == nominationsQueue.length - 1}>
                                        <Link href={`/nominations/${nominationsQueue[currentNominationQueueIndex + 1]}/my?multiMode=true&fillQueue=${nominationsQueue.join(`,`)}`}>Следующая<i className="bi bi-chevron-right"></i></Link>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </ReactPlaceholder>}
                        <ReactPlaceholder showLoadingAnimation ready={!!nomination}
                            customPlaceholder={<div className='w-100 mw-100' >
                                <RectShape color='#3f574c' className='my-2' style={{ height: '250', width: `100%`, borderRadius: 15 }} />
                            </div>}>
                            {nomination && <Card bg='dark' text='light' className='mt-2 w-100'>
                                <Card.Body>
                                    <Card.Title className=' fs-1 fw-bolder' >{nomination.name}</Card.Title>
                                    <Card.Subtitle className='mb-2'>
                                        {(nomination?.tags as string[] || []).map(x => <Link key={x} href={`/nominations?tag=${x}`}><Badge bg={'custom'} className={'me-1'}
                                            style={{
                                                backgroundColor: randomSeededColor(x),
                                            }}>{x}</Badge></Link>)}
                                    </Card.Subtitle>
                                    <Card.Subtitle>{nomination.description}</Card.Subtitle>
                                    <div className='d-flex align-items-center my-1'>
                                        <div className='mx-1'>by {nomination.author.displayName || nomination?.author.name}</div>
                                        <Image roundedCircle src={nomination.author.image || '/errorAvatar.jpg'} height={30} alt={''} onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }} />
                                    </div>
                                </Card.Body>
                            </Card>}
                        </ReactPlaceholder>
                        <ReactPlaceholder showLoadingAnimation ready={!!nomination && !!localNominees}
                            customPlaceholder={<div className='w-100 mw-100' >
                                <RectShape color='#3f574c' className='my-2' style={{ height: '150px', width: `100%`, borderRadius: 15 }} />
                            </div>}>
                            {localNominees && <Card bg='dark' text='light' className='mt-2 w-100'>
                                <NomineesTopEditor nomineesValidation={showValidation ? nomineesValidation : []} ar={nomination?.aspectRatio} nominees={localNominees} onChange={setLocalNominees} onEditClick={setSelectedNominee} />
                                {
                                    showValidation && nomineesValidation.includes(false) && <div>
                                        Для сохранения должны быть заполены все обязательные поля. Заполни <i className="text-warning bi bi-exclamation-triangle-fill"></i> сука.
                                    </div>
                                }
                                <Form.Group className='m-3 ms-auto w-100 d-flex px-3'>
                                    <Button className='me-auto' variant='secondary' disabled={!isSaved}>
                                        <Link href={'/nominations'}><i className="bi bi-chevron-left"></i>Номинации</Link>
                                    </Button>

                                    <Button className='me-auto' variant='secondary' disabled={!nomination || !localNominees || isSaved || isSaving} onClick={() => setLocalNominees(nomination?.Nominee as Nominee[])}>Отменить Изменения</Button>

                                    <Button className='ms-1' variant='primary' disabled={!nomination || !localNominees || isSaving} onClick={addNominee}>Добавить Слот</Button>

                                    <Button className='ms-1' variant={nomineesValidation.includes(false) ? 'warning' : 'primary'} disabled={!nomination || !localNominees || isSaved || isSaving} onClick={saveChanges} >Сохранить</Button>
                                </Form.Group>
                            </Card>}
                        </ReactPlaceholder>
                    </Col>
                    <Col lg={4}>
                        <div className=''>
                            {nomination ? <NominationWithNomineeDisplayEditable

                                onImageZoom={(scale) => selectedNominee && setSelectedNominee({ ...selectedNominee, imageScale: scale })}
                                onImageMove={(position) => selectedNominee && setSelectedNominee({ ...selectedNominee, imagePosition: position })}
                                onImageChange={(img) => selectedNominee && setSelectedNominee({ ...selectedNominee, imageId: img.id, imagePosition: '50% 50%', imageScale: 1 })}
                                nomination={nomination}
                                nominee={selectedNominee}
                            /> : <NominationPlaceholder />}
                        </div>
                    </Col>
                    <Col>
                        <Card bg='dark' text='light'>
                            <Card.Body>
                                <Card.Text>
                                    Это редактор Хуеты. Для каждой номинации можно выбрать топ 3 хуеты. А можно меньше.. Ну можно и больше в принципе🙃 Если сильно хочется поделиться своим важным мнением есть поле для комментариев. У некоторых категорий есть дополнительные поля. Картинку можно двигать. Топ тоже можно перетаскивать. Картинка обязательна.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <ReactPlaceholder showLoadingAnimation ready={!!nomination}
                            customPlaceholder={<div className='w-100 mw-100' >
                                <RectShape color='#3f574c' className='my-2' style={{ height: '400px', width: `100%`, borderRadius: 15 }} />
                            </div>}>
                            {nomination && <Card bg='dark' text='light' className='mt-2'>
                                <Card.Body>
                                    <Form.Group className=' '>
                                        <Form.Label className='mx-2 '>Название*</Form.Label>
                                        <Form.Control type="input" value={selectedNominee?.name || ''}
                                            onChange={e => selectedNominee && setSelectedNominee({ ...selectedNominee, name: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className=' mt-2'>
                                        <Form.Label className='mx-2 '>Комментарий</Form.Label>
                                        <Form.Control type="input" value={selectedNominee?.comment || ''}
                                            onChange={e => selectedNominee && setSelectedNominee({ ...selectedNominee, comment: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className=' mt-3'>
                                        <Form.Check type={'switch'} label='NFSW' checked={selectedNominee?.hasNSFW}
                                            onChange={(e) => selectedNominee && setSelectedNominee({ ...selectedNominee, hasNSFW: e.target.checked })} />
                                    </Form.Group>
                                    <Form.Group className=' mt-1'>
                                        <Form.Check type={'switch'} label='Спойлеры' checked={selectedNominee?.hasSpoilers}
                                            onChange={(e) => selectedNominee && setSelectedNominee({ ...selectedNominee, hasSpoilers: e.target.checked })} />
                                    </Form.Group>

                                </Card.Body>
                            </Card>}
                        </ReactPlaceholder>

                    </Col>
                </Row>
            </Col>
        </Row >
    </div >
}
NominationEdit.getLayout = GetDefaultLayout
export default NominationEdit
