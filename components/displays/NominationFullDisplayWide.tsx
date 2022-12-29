import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Badge, Card, Col, Image, Row } from 'react-bootstrap';
import ReactPlaceholder from 'react-placeholder/lib/index';
import { useLocalStorage } from 'usehooks-ts';
import { NominationFull } from '../../types/extendedApiTypes';
import { randomSeededColor } from '../../util/colors';
import NominationPlaceholder from '../plaseholders/NominationPlaceholder';
import NominationWithNomineeDisplay from './NominationWithNomineeDisplay';
interface Props {
    children?: ReactNode
    nomination: NominationFull
}

export default function NominationFullDisplayWide(props: Props) {
    const { nomination, children } = props
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)
    const nomineeTop = _.sortBy(nomination.Nominee || [], ['position', 'asc'])
    return <div>
        <Card className='mt-3 mx-5' bg='dark' text='light' style={{ borderRadius: 20 }}>
            <Card.Body>
                <Row>
                    <Col className='ps-3 flex-grow-1 d-flex align-items-start flex-column ' lg={4} >
                        <ReactPlaceholder color={'#3f574c' as any} ready={!!nomination} >
                            <Card.Title className=' fs-1 fw-bolder' >{nomination.name}</Card.Title>
                            <Card.Subtitle className='mb-2'>
                                {(nomination.tags as string[] || []).map(x => <Link key={x} href={`/nominations?tags=${x}`}><Badge bg={'custom'} className={'me-1'}
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
                                <NominationWithNomineeDisplay nominee={nomineeTop[0]} nomination={nomination} textSource='none' /> :
                                <NominationPlaceholder noText />
                        }
                        {
                            nomination ?
                                <NominationWithNomineeDisplay className='mx-1' nominee={nomineeTop[1]} nomination={nomination} textSource='none' /> :
                                <NominationPlaceholder noText />
                        }
                        {
                            nomination ?
                                <NominationWithNomineeDisplay nominee={nomineeTop[2]} nomination={nomination} textSource='none' /> :
                                <NominationPlaceholder noText />
                        }
                    </Col>

                </Row>
            </Card.Body>
        </Card>
    </div >
}
