import { AspectRatio, Nomination, NominationLike, Nominee } from '@prisma/client';
import axios from 'axios';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Row, Button, Badge, Image, OverlayTrigger, Popover, Container } from 'react-bootstrap';
import ReactPlaceholder from 'react-placeholder/lib/index';
import RectShape from 'react-placeholder/lib/placeholders/RectShape';
import { useHover, useLocalStorage } from 'usehooks-ts';
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
import { NominationFull, NomineeWithAuthor } from '../../../types/extendedApiTypes';
import { randomSeededColor } from '../../../util/colors';
import { globalConfig } from '../../../util/globalConfig';
import { NextPageWithLayout } from '../../_app';
import NominationFullPreview from '../../../components/previews/NominationFullPreview';
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
    const [showNomineeExamples, setShowNomineeExamples] = useLocalStorage('showNomineeExamples', false)
    const [showLocalNomineeExamples, setLocalShowNomineeExamples] = useState(false)
    const [nominationId, setNominationId] = useState<string>(router.query.nominationId as string)

    useEffect(() => {
        setNominationId(router.query.nominationId as string)
        setShowValidation(false)
        setLocalShowNomineeExamples(false)
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

    useEffect(() => {
        if (!localNominees.find(x => x.id == selectedNominee?.id)) {
            setSelectedNominee(localNominees[0])
        }
    }, [localNominees])


    const [nomineeExamples, setNomineeExamples] = useState<NomineeWithAuthor[]>([])
    useEffect(() => {
        if (showNomineeExamples || showLocalNomineeExamples) {
            axios.get<NomineeWithAuthor[]>(`/api/nominations/${nominationId}/nomineeExamples`)
                .then(res => {
                    setNomineeExamples(res.data)
                })
        }
        return () => {
            setNomineeExamples([])
        }
    }, [showLocalNomineeExamples, showNomineeExamples, nominationId])



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

    const likeHoverRef = useRef(null)
    const isLikeHover = useHover(likeHoverRef)
    const updateNominationLikes = (newlikes:NominationLike[]) => {
        if (nomination)
            setNomination({ ...nomination, NominationLike: newlikes })
    }
    const handleLike = () => {
        try {
            if (session?.user.id && nomination && nomination.NominationLike) {
                const oldList = [...nomination.NominationLike]
                const oldValue = !!nomination.NominationLike?.find(x => x.userId === session?.user.id)
                if (oldValue) {
                    updateNominationLikes(nomination.NominationLike.filter(x => x.userId !== session?.user.id))
                }
                else {
                    updateNominationLikes([...nomination.NominationLike, {
                        id: 'tbd',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        nominationId: nomination.id,
                        userId: session?.user.id
                    }])

                }
                axios.post<NominationLike[]>(`/api/nominations/${nomination.id}/like?value=${!oldValue}`)
                    .then((res) => {
                        updateNominationLikes(res.data)
                    })
                    .catch((err) => {
                        console.log(err);
                        updateNominationLikes(oldList)
                    })
            }
        } catch (error) {
            console.log(nomination);
            throw error;

        }

    }

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
                id: `_${Math.max(...localNominees.map(x => x.position)) + 1}`,
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
    return <div className='py-3'>
        <Row className='  mx-3'>
            <Col lg={12}>
                <Row className=''>
                    <Col>
                        {multiMode && <ReactPlaceholder showLoadingAnimation ready={!!nomination}
                            customPlaceholder={<div className='w-100 mw-100' >
                                <RectShape color='#3f574c' className='' style={{ height: '40', width: `100%`, borderRadius: 15 }} />
                            </div>}>
                            <Card bg='dark' text='light' className='mb-2 w-100'>
                                <Card.Body className='d-flex'>
                                    <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={<Popover className='bg-dark' id="popover-basic">
                                        <Popover.Body>
                                            <div className='mx-2 mb-2 text-light'>?????????????? ?????????? ?????? ?????????????????????</div>
                                            <div className='w-100 d-flex'>
                                                <Button className='me-auto' variant='danger' disabled={currentNominationQueueIndex == 0}>
                                                    <Link href={`/nominations/${nominationsQueue[currentNominationQueueIndex - 1]}/my?multiMode=true&fillQueue=${nominationsQueue.join(`,`)}`}><i className="bi bi-chevron-left"></i>??????????????</Link>
                                                </Button>
                                            </div>

                                        </Popover.Body>
                                    </Popover>}>
                                        {isSaved ?
                                            <Button className='me-auto' variant='secondary' disabled={currentNominationQueueIndex == 0}>
                                                <Link href={`/nominations/${nominationsQueue[currentNominationQueueIndex - 1]}/my?multiMode=true&fillQueue=${nominationsQueue.join(`,`)}`}><i className="bi bi-chevron-left"></i>????????????????????</Link>
                                            </Button> :
                                            <Button className='me-auto' variant='secondary' disabled={currentNominationQueueIndex == 0}>
                                                <i className="bi bi-chevron-left"></i>????????????????????
                                            </Button>}
                                    </OverlayTrigger>
                                    <h3 className='mb-0'>?????????????????? {currentNominationQueueIndex + 1}/{nominationsQueue.length}</h3>
                                    <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={<Popover className='bg-dark' id="popover-basic">
                                        <Popover.Body>
                                            <div className='mx-2 mb-2 text-light'>?????????????? ???????????? ?????? ?????????????????????</div>
                                            <div className='w-100 d-flex'>
                                                <Button className='ms-auto' variant='danger' disabled={currentNominationQueueIndex == nominationsQueue.length - 1}>
                                                    <Link href={`/nominations/${nominationsQueue[currentNominationQueueIndex + 1]}/my?multiMode=true&fillQueue=${nominationsQueue.join(`,`)}`}>??????????????<i className="bi bi-chevron-right"></i></Link>
                                                </Button>
                                            </div>
                                        </Popover.Body>
                                    </Popover>}>
                                        {isSaved ?
                                            <Button className='ms-auto' variant='secondary' disabled={currentNominationQueueIndex == nominationsQueue.length - 1}>
                                                <Link href={`/nominations/${nominationsQueue[currentNominationQueueIndex + 1]}/my?multiMode=true&fillQueue=${nominationsQueue.join(`,`)}`}>??????????????????<i className="bi bi-chevron-right"></i></Link>
                                            </Button> :
                                            <Button className='ms-auto' variant='secondary' disabled={currentNominationQueueIndex == nominationsQueue.length - 1}>
                                                ??????????????????<i className="bi bi-chevron-right"></i>
                                            </Button>}
                                    </OverlayTrigger>
                                </Card.Body>
                            </Card>
                        </ReactPlaceholder>}


                        <ReactPlaceholder showLoadingAnimation ready={!!nomination}
                            customPlaceholder={<div className='w-100 mw-100' >
                                <RectShape color='#3f574c' className='my-2' style={{ height: '250', width: `100%`, borderRadius: 15 }} />
                            </div>}>
                            {nomination && <Card bg='dark' text='light' className=' w-100'>
                                <Card.Body>
                                    <div className='d-flex  h-100 align-items-center'>
                                        <Card.Title className='fw-bolder' style={{ fontSize: nomination.name.length > 13 ? '1.5em' : '2.3em' }} >
                                            {nomination.name}

                                        </Card.Title>
                                        <i ref={likeHoverRef} onClick={handleLike} style={{ zIndex: '3' }} className={`ms-3 fs-3 bi bi-star${session?.user.id && isLikeHover || nomination.NominationLike?.find(x => x.userId == session?.user.id) ? '-fill' : ""} `}></i>
                                        <div className='ms-1 fs-5'>{nomination.NominationLike.length}</div>
                                    </div>
                                    <Card.Subtitle className='mb-2'>
                                        {(nomination?.tags as string[] || []).map(x => <Badge key={x} bg={'custom'} className={'me-1'}
                                            style={{
                                                backgroundColor: randomSeededColor(x),
                                            }}>{x}</Badge>)}
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
                                <NomineesTopEditor
                                    activeNomineeId={selectedNominee?.id}
                                    nomineesValidation={showValidation ? nomineesValidation : []}
                                    ar={nomination?.aspectRatio}
                                    nominees={localNominees}
                                    onChange={setLocalNominees}
                                    onEditClick={setSelectedNominee} />
                                {
                                    showValidation && nomineesValidation.includes(false) && <div className='mx-2 mt-2'>
                                        ?????? ???????????????????? ???????????? ???????? ???????????????? ?????? ???????????????????????? ????????. ?????????????? <i className="text-warning bi bi-exclamation-triangle-fill"></i> ????????.
                                    </div>
                                }
                                <Form.Group className='m-3 ms-auto w-100 d-flex px-3'>
                                    <Button className='me-auto' variant='secondary' disabled={!isSaved}>
                                        <Link href={'/nominations'}><i className="bi bi-chevron-left"></i>??????????????????</Link>
                                    </Button>

                                    <Button className='me-auto' variant='secondary' disabled={!nomination || !localNominees || isSaved || isSaving} onClick={() => setLocalNominees(nomination?.Nominee as Nominee[])}>???????????????? ??????????????????</Button>

                                    <Button className='ms-1' variant='primary' disabled={!nomination || !localNominees || isSaving} onClick={addNominee}>???????????????? ????????</Button>

                                    <Button className='ms-1' variant={nomineesValidation.includes(false) ? 'warning' : 'primary'} disabled={!nomination || !localNominees || isSaved || isSaving} onClick={saveChanges} >??????????????????</Button>
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
                                    ?????? ???????????????? ??????????. ?????? ???????????? ?????????????????? ?????????? ?????????????? ?????? 3 ??????????. ?? ?????????? ????????????.. ???? ?????????? ?? ???????????? ?? ???????????????????? ???????? ???????????? ?????????????? ???????????????????? ?????????? ???????????? ?????????????? ???????? ???????? ?????? ????????????????????????. ?? ?????????????????? ?????????????????? ???????? ???????????????????????????? ????????. ???????????????? ?????????? ??????????????. ?????? ???????? ?????????? ??????????????????????????. ???????????????? ??????????????????????. ?????????? ???????????????? ?????????? ???????????????? ?????????? ???????????? (???? ??????????????????????????, ??????????????, ???? ?????? ????????????????)
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
                                        <Form.Label className='mx-2 '>????????????????*</Form.Label>
                                        <Form.Control type="input" value={selectedNominee?.name || ''}
                                            onChange={e => selectedNominee && setSelectedNominee({ ...selectedNominee, name: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className=' mt-2'>
                                        <Form.Label className='mx-2 '>??????????????????????</Form.Label>
                                        <Form.Control type="input" value={selectedNominee?.comment || ''}
                                            onChange={e => selectedNominee && setSelectedNominee({ ...selectedNominee, comment: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className=' mt-3'>
                                        <Form.Check type={'switch'} label='NFSW' checked={selectedNominee?.hasNSFW}
                                            onChange={(e) => selectedNominee && setSelectedNominee({ ...selectedNominee, hasNSFW: e.target.checked })} />
                                    </Form.Group>
                                    <Form.Group className=' mt-1'>
                                        <Form.Check type={'switch'} label='????????????????' checked={selectedNominee?.hasSpoilers}
                                            onChange={(e) => selectedNominee && setSelectedNominee({ ...selectedNominee, hasSpoilers: e.target.checked })} />
                                    </Form.Group>

                                </Card.Body>
                            </Card>}
                        </ReactPlaceholder>

                    </Col>
                </Row>
            </Col>

        </Row >
        <div className='px-3 w-100 dflex '>

            {showNomineeExamples || showLocalNomineeExamples ? <div>
                <Card bg='dark text-center mx-auto my-3' style={{ width: 300 }}>
                    <Card.Body>
                        <Card.Title style={{ fontSize: '130%' }}>???????????? ???????????? ??????????????????</Card.Title>
                        <Card.Text style={{ fontSize: '60%' }}>???????? ???????????? ????????????</Card.Text>
                    </Card.Body>
                </Card>
                <Container>
                    <Row lg={4}>
                        {nomination &&
                            nomineeExamples.length > 0 ? nomineeExamples.map(nominee => <Col key={nominee.id}>
                                <Card bg='dark' className='d-flex p-2 align-items-center'>
                                    <div className='d-flex align-items-center my-auto'>
                                        <div className='mx-1'>by {nominee.author.displayName || nominee.author.name}</div>
                                        <Image roundedCircle src={nominee.author.image || '/errorAvatar.jpg'} height={30} alt={''} onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }} />
                                    </div>
                                    <NominationFullPreview nomination={{ ...nomination, Nominee: [nominee] }} name='nominee' />
                                    <Button onClick={() => setLocalNominees([...localNominees, {
                                        ...nominee,
                                        authorUserId: session?.user.id || 'fuck',
                                        id: `${Math.random()}`,
                                        position: localNominees.length + Math.min(...localNominees.map(x => x.position)),
                                    }])}>???????????????? ?? ????????</Button>
                                </Card>
                            </Col>) : <Card bg='dark text-center mx-auto my-3' style={{ width: 270 }}>
                            <Card.Body>
                                <Card.Title style={{ fontSize: '130%' }}>?????? ???????????? ??????(</Card.Title>
                                <Card.Text style={{ fontSize: '70%' }}>?????????? ???????????? ?????? ???????????????? ?????? ??????????</Card.Text>
                            </Card.Body>
                        </Card>}
                    </Row>
                </Container>
            </div> :
                <Card bg='dark text-center mx-auto mt-2 mb-3' style={{ width: 500 }}>
                    <Card.Body className=''>
                        <Card.Title style={{ fontSize: '100%' }}>???????????????? ?????????? ?????????????? ???????????????? ?? ???????????????????? ????????????????????</Card.Title>
                        <Button variant='outline-secondary' className='me-2 text-light' onClick={() => setShowNomineeExamples(true)}>???????????????? ??????????????????</Button>
                        <Button variant='outline-secondary' className=' text-light' onClick={() => setLocalShowNomineeExamples(true)}>???????????????? ?????? ???????? ??????????????????</Button>
                    </Card.Body>
                </Card>}
        </div>
    </div >
}
NominationEdit.getLayout = GetDefaultLayout
export default NominationEdit
