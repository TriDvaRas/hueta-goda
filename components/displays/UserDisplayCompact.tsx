import { NominationLike } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useRef } from 'react';
import { Badge, Card, Col, Image, Row } from 'react-bootstrap';
import ReactPlaceholder from 'react-placeholder/lib/index';
import { useHover, useLocalStorage } from 'usehooks-ts';
import { UserWithStats } from '../../types/extendedApiTypes';
import { randomSeededColor } from '../../util/colors';
interface Props {
    user: UserWithStats,
}

export default function UserDisplayWideCompact(props: Props) {
    const { user, } = props

    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)
    const hoverRef = useRef(null)
    const isHover = useHover(hoverRef)
    return <div className='mx-2'>
        <Card bg={isHover ? 'dark-850' : 'dark'} text='light' ref={hoverRef} className='text-center w-100' style={{ minHeight: 165 }}>
            <Row lg={11}>
                <Col className='ps-3 flex-grow-1 d-flex align-items-start flex-column ' style={{}} lg={7} >
                    <Card.Body>
                        <Card.Title className='fw-bolder' style={{ fontSize: user.name.length > 15 ? '1.5em' : '2.3em' }}>
                            {user.displayName || user.name}
                        </Card.Title>
                        <Image roundedCircle src={user.image || '/errorAvatar.jpg'} height={'128'} alt={''} onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }} />
                        <Card.Subtitle className='mt-2'>Номинаций заполнено: </Card.Subtitle>
                        <Card.Subtitle className='fs-1'>{user.nominationsFilled} </Card.Subtitle>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    </div >
}
