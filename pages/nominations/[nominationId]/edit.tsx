import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Col, Row, Card, Form, Button, Badge, Table, } from 'react-bootstrap';
import GetDefaultLayout from '../../../layouts/DefaultLayout';
import { NominationFull } from '../../../types/extendedApiTypes';
import { NextPageWithLayout } from '../../_app';
import GetThinLayout from '../../../layouts/ThinLayout';
import NominationPreview from '../../../components/previews/NominationPreview';
import NominationPlaceholder from '../../../components/plaseholders/NominationPlaceholder';
import { globalConfig } from '../../../util/globalConfig';
import { AspectRatio, Nomination, Nominee, UserRole } from '@prisma/client';
import arULTRAWIDE from '../../../assets/svg/ar-ULTRAWIDE.svg';
import arSQUARE from '../../../assets/svg/ar-SQUARE.svg';
import arTALL from '../../../assets/svg/ar-TALL.svg';
import arWIDE from '../../../assets/svg/ar-WIDE.svg';
import arULTRATALL from '../../../assets/svg/ar-ULTRATALL.svg';
import ReactPlaceholder from 'react-placeholder/lib/index';
import RectShape from 'react-placeholder/lib/placeholders/RectShape';
import Image from 'next/image';
import { NominationExtra } from '../../../types/hg-api';
import EdiText from 'react-editext';
import { useSession } from 'next-auth/react';
import { useLocalStorage } from 'usehooks-ts';
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

    const [nomination, setNomination] = useState<Nomination | undefined>(undefined)
    const [localNomination, setLocalNomination] = useState<Nomination | undefined>(undefined)
    const [nominationLoading, setNominationLoading] = useState(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    useEffect(() => {
        setLocalNomination(nomination)
    }, [nomination])
    useEffect(() => {
        if (nominationId) {
            setNominationLoading(true)
            axios.get<Nomination>(`/api/nominations/${nominationId}`).then(res => {
                setNomination(res.data)
                setLocalNomination(res.data)
                setNominationLoading(false)
            })
        }
        return () => setNomination(undefined)
    }, [nominationId])

    function saveChanges() {
        setIsSaving(true)
        axios.put(`/api/nominations/${nominationId}`, localNomination)
            .then((res) => {
                setNomination(res.data)
                setLocalNomination(res.data)
                setIsSaving(false)
            })
    }
    function resetChanges() {

    }
    if (sessionStatus == 'unauthenticated')
        router.push('/401')
    if (session && nomination && session.user.id !== nomination.authorUserId && !(session.user.role == UserRole.ADMIN && showAdminTools))
        router.push('/403')


    return <div>
        <Row className=' my-3'>
            <Col lg={1}></Col>
            <Col lg={10}>
                <Card bg='dark' text='light'>
                    <Card.Body>
                        Это редактор номинаций. Тут можно редактировать номинации. Нажатие на текст для редактирования, Дополнительные поля ясно.
                    </Card.Body>
                </Card>
                <Row className='mt-3'>
                    <Col lg={7}>
                        <div className=''>
                            {localNomination ? <NominationPreview nomination={localNomination} onTextEdit={(text) => { setLocalNomination({ ...localNomination, name: text.trim() }) }} /> : <NominationPlaceholder />}
                        </div>
                    </Col>
                    <Col>
                        {
                            localNomination ?
                                <Card bg='dark' text='light' className='mt-2'>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label className='mx-2 '>Описание</Form.Label>
                                            <Form.Control type="input" defaultValue={localNomination.description || ''} onChange={e => setLocalNomination({ ...localNomination, description: e.target.value })} />
                                        </Form.Group>
                                        {/* ratio */}
                                        <Form.Group  >
                                            <Form.Label className='mx-2 '>Соотношение изображения</Form.Label>
                                            <Row>
                                                {ratioImgs.slice(0, 3).map(ar => <Col className='d-flex justify-content-center' key={ar.ratio} onClick={() => { setLocalNomination({ ...localNomination, aspectRatio: ar.ratio }) }}>
                                                    <Image width={60} alt={ar.ratio} src={ar.img} className={ar.ratio === localNomination?.aspectRatio ? `ar-selector-selected` : `ar-selector`} />
                                                </Col>)}
                                            </Row>
                                            <Row >
                                                {ratioImgs.slice(3).map(ar => <Col className='d-flex justify-content-center' key={ar.ratio} onClick={() => { setLocalNomination({ ...localNomination, aspectRatio: ar.ratio }) }}>
                                                    <Image width={60} alt={ar.ratio} src={ar.img} className={`my-auto ${ar.ratio === localNomination?.aspectRatio ? `ar-selector-selected` : `ar-selector`}`} />
                                                </Col>)}
                                            </Row>
                                        </Form.Group>
                                        {/* tags */}
                                        <Form.Group  >
                                            <Form.Label className='mx-2 '>Теги</Form.Label>
                                            <div className='d-flex justify-content-center flex-wrap'>
                                                {globalConfig.nominationTags.map(tag => {
                                                    const tags = localNomination.tags as string[]
                                                    return <div className='mx-1' key={tag} onClick={() => { setLocalNomination({ ...localNomination, tags: tags.includes(tag) ? tags.filter(x => x != tag) : [...tags, tag] }) }}>
                                                        <Badge bg={tags.includes(tag) ? 'primary' : 'danger'}>{tag}</Badge>
                                                    </div>
                                                })}
                                            </div>
                                        </Form.Group>
                                        {/* extras */}
                                        <Form.Group  >
                                            <Form.Label className='mx-2 '>Доп</Form.Label>
                                            <Table variant='dark' >
                                                <tbody>
                                                    <tr>
                                                        <th>type</th>
                                                        <th>required</th>
                                                        <th>question</th>
                                                    </tr>
                                                    {(localNomination.extras as unknown as NominationExtra[]).map((e, i) => <tr key={i}>
                                                        <td><Form.Select defaultValue={e.type} onChange={(evt) =>
                                                            setLocalNomination({
                                                                ...localNomination,
                                                                extras: (localNomination.extras as unknown as NominationExtra[]).map((x, j) => i == j ? { ...x, type: evt.target.value } : x) as any,
                                                            })}
                                                        >
                                                            {globalConfig.nominationExtraTypes.map(x => <option key={x} value={x}>{x}</option>)}
                                                        </Form.Select></td>
                                                        <td><Form.Check className=' mt-2' type={'switch'} defaultChecked={e.required} onChange={(e) => setLocalNomination({
                                                            ...localNomination,
                                                            extras: (localNomination.extras as unknown as NominationExtra[]).map((x, j) => i == j ? { ...x, required: !e.target.checked } : x) as any,
                                                        })}
                                                        /></td>
                                                        <td><EdiText
                                                            onSave={(text) => setLocalNomination({
                                                                ...localNomination,
                                                                extras: (localNomination.extras as unknown as NominationExtra[]).map((x, j) => i == j ? { ...x, question: text } : x) as any,
                                                            })}
                                                            viewProps={{
                                                                className: ' text-center',
                                                            }}
                                                            containerProps={{
                                                                className: 'd-flex justify-content-center'
                                                            }}
                                                            editButtonProps={{ style: { visibility: 'hidden', display: 'none' } }}
                                                            editOnViewClick
                                                            value={e.question || ''}
                                                            validation={(text) => text.length > 1}
                                                        /></td>
                                                    </tr>)}
                                                    <tr onClick={() => setLocalNomination({
                                                        ...localNomination,
                                                        extras: [...(localNomination.extras as unknown as NominationExtra[]), {
                                                            type: 'Raw Link',
                                                            question: 'Ссылка?',
                                                            required: false
                                                        }] as any,
                                                    })}>
                                                        <td className='text-center' colSpan={3} >+</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Form.Group>
                                        <Form.Group className='mt-2'>
                                            <Button variant='primary' disabled={isSaving} onClick={saveChanges}>Save</Button>
                                            <Button variant='danger' onClick={resetChanges}>Reset</Button>
                                        </Form.Group>
                                    </Card.Body>
                                </Card> :
                                <ReactPlaceholder showLoadingAnimation ready={false}
                                    customPlaceholder={<div className='w-100 mw-100' >
                                        <RectShape color='#3f574c' className='my-2' style={{ height: '600px', width: `100%`, borderRadius: 15 }} />
                                    </div>}>
                                </ReactPlaceholder>
                        }
                    </Col>
                </Row>



            </Col>
            <Col lg={1}></Col>
        </Row >
    </div >
}
NominationEdit.getLayout = GetThinLayout
export default NominationEdit
