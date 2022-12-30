import { NominationLike } from '@prisma/client';
import axios from 'axios';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useRef } from 'react';
import { Badge, Card, Col, Image, Row } from 'react-bootstrap';
import ReactPlaceholder from 'react-placeholder/lib/index';
import { useHover, useLocalStorage } from 'usehooks-ts';
import { NominationFull } from '../../types/extendedApiTypes';
import { randomSeededColor } from '../../util/colors';
import NominationPlaceholder from '../plaseholders/NominationPlaceholder';
import NominationWithNomineeDisplay from './NominationWithNomineeDisplay';
interface Props {
    children?: ReactNode
    nomination: NominationFull
    updateNominationLikes: (likes: NominationLike[]) => void
}

export default function NominationFullDisplayWide(props: Props) {
    const { nomination, children, updateNominationLikes } = props
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)
    const nomineeTop = _.sortBy(nomination.Nominee || [], ['position', 'asc'])
    const likeHoverRef = useRef(null)
    const isLikeHover = useHover(likeHoverRef)
    const handleLike = () => {
        if (session?.user.id &&nomination.NominationLike) {
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
    }
    return <div>
        <Card className='mt-3 mx-2' bg='dark' text='light' style={{ borderRadius: 20 }}>
            <Card.Body>
                <Row>
                    <Col className='ps-3 flex-grow-1 d-flex align-items-start flex-column ' lg={4} >
                        <ReactPlaceholder color={'#3f574c' as any} ready={!!nomination} >
                            <div className='d-flex align-items-center'>
                                <Card.Title className=' fs-1 fw-bolder' >
                                    {nomination.name}

                                </Card.Title>
                                <i ref={likeHoverRef} onClick={handleLike} style={{ zIndex: '3' }} className={`ms-3 fs-3 bi bi-star${session?.user.id && isLikeHover || nomination.NominationLike?.find(x => x.userId == session?.user.id) ? '-fill' : ""} `}></i>
                                <div className='ms-1 fs-5'>{nomination.NominationLike.length}</div>
                            </div>
                            <Card.Subtitle className='mb-2'>
                                {(nomination.tags as string[] || []).map(x => <Link key={x} href={`/gallery/nominations?tag=${x}`}><Badge bg={'custom'} className={'me-1'}
                                    style={{
                                        backgroundColor: randomSeededColor(x),
                                    }}>{x}</Badge></Link>)}
                            </Card.Subtitle>
                            <Card.Subtitle>{nomination.description}</Card.Subtitle>
                            <div className='d-flex align-items-center my-auto'>
                                <div className='mx-1'>by {nomination?.author.displayName || nomination?.author.name}</div>
                                <Image roundedCircle src={nomination?.author.image || '/errorAvatar.jpg'} height={30} alt={''} onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }} />
                            </div>
                            {children}
                        </ReactPlaceholder>
                    </Col>
                    <Col>
                    </Col>
                    <Col lg={7} className='px-2 d-flex align-items-center flex-row bg-dark-850 m-n3 py-2' style={{ borderRadius: 20 }}>
                        {
                            nomination ?
                                <NominationWithNomineeDisplay nominee={nomineeTop[0]} nomination={nomination} textSource='none' imageSize='MEDIUM' /> :
                                <NominationPlaceholder noText />
                        }
                        {
                            nomination ?
                                <NominationWithNomineeDisplay className='mx-1' nominee={nomineeTop[1]} nomination={nomination} textSource='none' imageSize='MEDIUM' /> :
                                <NominationPlaceholder noText />
                        }
                        {
                            nomination ?
                                <NominationWithNomineeDisplay nominee={nomineeTop[2]} nomination={nomination} textSource='none' imageSize='MEDIUM' /> :
                                <NominationPlaceholder noText />
                        }
                    </Col>

                </Row>
            </Card.Body>
        </Card>
    </div >
}
