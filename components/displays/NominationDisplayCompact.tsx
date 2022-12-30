import { AspectRatio, Nomination } from '@prisma/client';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Badge, Card, Col, Image, Row } from 'react-bootstrap';
import ReactPlaceholder from 'react-placeholder/lib/index';
import { useLocalStorage } from 'usehooks-ts';
import { NominationFull, NominationWithAuthor } from '../../types/extendedApiTypes';
import { randomSeededColor } from '../../util/colors';
import NominationPlaceholder from '../plaseholders/NominationPlaceholder';
import NominationWithNomineeDisplay from './NominationWithNomineeDisplay';
interface Props {
    children?: ReactNode
    nomination: NominationWithAuthor
}

export default function NominationDisplayWideCompact(props: Props) {
    const { nomination, children } = props
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)
    return <div>
        <Card bg='dark' text='light' className=' w-100'>
            <Row lg={11}>
                <Link href={`/gallery/nominations/${nomination.id}`}><Col lg={4} className={`d-flex align-items-center flex-row padding-right-on-hover  bg-dark-gradient-hover`}
                    style={{
                        position: 'absolute', overflow: 'hidden', borderRadius: 5,
                        right: 0, height: '100%',zIndex:1
                    }}>
                    <i className="  ms-auto me-2 bi bi-chevron-right"></i>
                </Col></Link>
                <Col className='ps-3 flex-grow-1 d-flex align-items-start flex-column ' style={{}} lg={7} >
                    <ReactPlaceholder color={'#3f574c' as any} ready={!!nomination} >
                        <Card.Body>
                            <Card.Title className=' fs-1 fw-bolder' >{nomination.name}</Card.Title>
                            <Card.Subtitle className='mb-2'>
                                {(nomination?.tags as string[] || []).map(x => <Link key={x} href={`/gallery/nominations?tag=${x}`}><Badge bg={'custom'} className={'me-1'}
                                    style={{
                                        backgroundColor: randomSeededColor(x),
                                    }}>{x}</Badge></Link>)}
                            </Card.Subtitle>
                            <Card.Subtitle>{nomination.description}</Card.Subtitle>
                            <div className='d-flex align-items-center my-1'>
                                <div className='mx-1'>by {nomination.author.displayName || nomination.author.name}</div>
                                <Image roundedCircle src={nomination.author.image || '/errorAvatar.jpg'} height={30} alt={''} onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }} />
                            </div>
                            {children}
                        </Card.Body>
                    </ReactPlaceholder>
                </Col>


            </Row>

        </Card>
    </div >
}
