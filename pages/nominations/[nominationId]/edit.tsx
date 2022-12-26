import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Col, Row, Card, Form, Button, Badge, } from 'react-bootstrap';
import GetDefaultLayout from '../../../layouts/DefaultLayout';
import { NominationFull } from '../../../types/extendedApiTypes';
import { NextPageWithLayout } from '../../_app';
import GetThinLayout from '../../../layouts/ThinLayout';
import NominationPreview from '../../../components/previews/NominationPreview';
import NominationPlaceholder from '../../../components/plaseholders/NominationPlaceholder';
import { globalConfig } from '../../../util/globalConfig';
import { AspectRatio, Nomination, Nominee } from '@prisma/client';
import arULTRAWIDE from '../../../assets/svg/ar-ULTRAWIDE.svg';
import arSQUARE from '../../../assets/svg/ar-SQUARE.svg';
import arTALL from '../../../assets/svg/ar-TALL.svg';
import arWIDE from '../../../assets/svg/ar-WIDE.svg';
import arULTRATALL from '../../../assets/svg/ar-ULTRATALL.svg';
import ReactPlaceholder from 'react-placeholder/lib/index';
import RectShape from 'react-placeholder/lib/placeholders/RectShape';
import Image from 'next/image';
const ratioImgs: { img: any, ratio: AspectRatio }[] = [
    { img: arTALL, ratio: 'TALL' },
    { img: arSQUARE, ratio: 'SQUARE' },
    { img: arULTRATALL, ratio: 'ULTRATALL' },
    { img: arWIDE, ratio: 'WIDE' },
    { img: arULTRAWIDE, ratio: 'ULTRAWIDE' },
]

const NominationEdit: NextPageWithLayout = () => {
    const router = useRouter()
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


    return <div>
        <Row className=' my-3'>
            <Col lg={8}>
                <Card bg='dark' text='light'>
                    <Card.Body>
                        Это редактор номинаций. Тут можно редактировать номинации. Нажатие на текст для редактирования, Дополнительные поля ясно.
                    </Card.Body>
                </Card>
                <Row className='mt-3'>
                    <Col lg={8}>
                        <div className='mx-5'>
                            {localNomination ? <NominationPreview nomination={localNomination} onTextEdit={(text) => { setLocalNomination({ ...localNomination, name: text.trim() }) }} /> : <NominationPlaceholder />}
                        </div>
                    </Col>
                    <Col>
                        {
                            localNomination ?
                                <Card bg='dark' text='light' className='mt-2'>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label className='mx-2 mt-2'>Описание</Form.Label>
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
                                        <Form.Group className='mt-2'>
                                            <Button variant='primary' disabled={isSaving} onClick={saveChanges}>Save</Button>
                                            <Button variant='danger' onClick={resetChanges}>Reset</Button>
                                        </Form.Group>
                                    </Card.Body>
                                </Card> :
                                <ReactPlaceholder showLoadingAnimation ready={false}
                                    customPlaceholder={<div className='w-100 mw-100' >
                                        <RectShape color='#3f574c' className='my-2' style={{ height: '100%', width: `100%`, borderRadius: 15 }} />
                                    </div>}>
                                </ReactPlaceholder>
                        }
                    </Col>
                </Row>



            </Col>
            <Col lg={5}>
                {/* <Card bg='dark' text='light'>
                    <Card.Header className='text-center'>
                        <h1>Превью</h1>
                    </Card.Header>
                </Card>
                <div className='mx-5'>
                    {localNomination ? <NominationPreview nomination={localNomination} /> : <NominationPlaceholder />}
                </div>
                <Row>
                    <Col sm='7'>{localNomination ? <NominationPreview nomination={localNomination} /> : <NominationPlaceholder />}</Col>
                    <Col sm='5'>{localNomination ? <NominationPreview nomination={localNomination} /> : <NominationPlaceholder />}</Col>
                </Row>
                <Row>

                </Row> */}


            </Col>
        </Row >
    </div >
}
NominationEdit.getLayout = GetThinLayout
export default NominationEdit
