import { AspectRatio, Nomination, Nominee } from '@prisma/client';
import axios from 'axios';
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
    useEffect(() => {
        if (localNominees && selectedNominee)
            setLocalNominees(localNominees.map(x => x.position == selectedNominee.position ? selectedNominee : x))
    }, [selectedNominee])

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
        setIsSaving(true)
        axios.put(`/api/nominations/${nominationId}/mynominees`, localNominees)
            .then((res) => {
                setLocalNominees(res.data)
                setIsSaving(false)
            })
    }
    if (sessionStatus == 'unauthenticated')
        router.push('/401')


    return <div>
        <Row className=' my-3 mx-3'>
            <Col lg={12}>
                <Card bg='dark' text='light'>
                    <Card.Body>
                        <Card.Text>
                            Это редактор Хуеты. Для каждой номинации можно выбрать топ 3 хуеты. А можно меньше.. Ну и больше можно в принципе🙃 Если сильно хочется поделиться своим важным мнением есть поле для комментариев. У некоторых категорий есть дополнительные поля для прикрепления ссылок на контент. Картинку можно зумить колесиком и дергать. Топ тоже можно тоскать.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Row className='mt-3'>
                    <Col>
                        <ReactPlaceholder showLoadingAnimation ready={!!nomination}
                            customPlaceholder={<div className='w-100 mw-100' >
                                <RectShape color='#3f574c' className='my-2' style={{ height: '150px', width: `100%`, borderRadius: 15 }} />
                            </div>}>
                            {localNominees && <Card bg='dark' text='light' className='mt-2 w-100'>
                                <Card.Body>
                                    <Card.Title className=' fs-1 fw-bolder' >{nomination?.name}</Card.Title>
                                    <Card.Subtitle className='mb-2'>
                                        {(nomination?.tags as string[] || []).map(x => <Link key={x} href={`/nominations?tags=${x}`}><Badge bg={'custom'} className={'me-1'}
                                            style={{
                                                backgroundColor: randomSeededColor(x),
                                            }}>{x}</Badge></Link>)}
                                    </Card.Subtitle>
                                    <Card.Subtitle>{nomination?.description}</Card.Subtitle>
                                    <div className='d-flex align-items-center my-1'>
                                        <div className='mx-1'>by {nomination?.author.displayName || nomination?.author.name}</div>
                                        <Image roundedCircle src={nomination?.author.image || '/errorAvatar.jpg'} height={30} alt={''} onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }} />
                                    </div>
                                </Card.Body>
                                <NomineesTopEditor ar={nomination?.aspectRatio} nominees={localNominees} onChange={setLocalNominees} onEditClick={setSelectedNominee} />
                                <Form.Group className='m-3 ms-auto'>
                                    <Button variant='primary' disabled={isSaving} onClick={saveChanges}>Сохранить</Button>
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

                        <ReactPlaceholder showLoadingAnimation ready={!!nomination}
                            customPlaceholder={<div className='w-100 mw-100' >
                                <RectShape color='#3f574c' className='my-2' style={{ height: '400px', width: `100%`, borderRadius: 15 }} />
                            </div>}>
                            {nomination && <Card bg='dark' text='light' className='mt-2'>
                                <Card.Body>
                                    <Form.Group>
                                        <Form.Label className='mx-2 '>Комментарий</Form.Label>
                                        <Form.Control type="input" defaultValue={selectedNominee?.comment || ''} onChange={e => selectedNominee && setSelectedNominee({ ...selectedNominee, comment: e.target.value })} />
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
