import React, { Ref } from 'react';
import {
    Col,
    Form,
    Image, Nav, Navbar, NavDropdown, Row
} from 'react-bootstrap';
import LoadingDots from './LoadingDots';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from 'react-bootstrap';
import { UserRole } from '@prisma/client';
import { useLocalStorage } from 'usehooks-ts';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
interface Props {
}
const Bar = ({ }: Props) => {
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)

    return (
        <div id='navbar'>
            <Navbar
                expand='md'
                bg="dark-700"
                variant="dark"
                style={{
                    // backgroundColor: '#4c3b62'
                }}
            >
                <div onClick={() => router.push(`/`)}>
                    <h3 className='mb-0 mx-3'>HG<span className='egg-text'></span></h3>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        style={{ fontSize: '1.25rem' }}
                        className=""
                        activeKey={router.asPath}
                        onSelect={(selectedKey) => router.push(selectedKey as string)}
                    >
                        <NavDropdown title={'Галерея'} menuVariant='dark'>
                            {/* <NavDropdown.Item className='active-bg-override' eventKey='/wheels'>
                                Номинации
                            </NavDropdown.Item> */}
                            <NavDropdown.Item className='active-bg-override' as={Link} href='/people'>
                                Люди
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} href='/nominations'>
                            Моя Хуйня<sup>™</sup>
                        </Nav.Link>
                        {session?.user.role === UserRole.ADMIN && <Form.Check className=' mt-2' type={'switch'} defaultChecked={showAdminTools} onChange={(e) => setShowAdminTools(e.target.checked)} />}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <Nav
                        activeKey={router.asPath}
                        onSelect={(selectedKey) => router.push(selectedKey as string)}>
                        {
                            sessionStatus == 'loading' ? <LoadingDots compact className='me-3' count={1} size='sm' /> :
                                session ?
                                    <Row>
                                        <Col className='mh-100 px-0 mx-0'>
                                            <Nav.Link eventKey='/me/nominations' className="fix-font-weight px-0">
                                                <h5 className='mb-0'>{session.user.displayName || session.user.name}</h5>
                                            </Nav.Link>
                                        </Col>
                                        <Col className='me-3'>
                                            <Image
                                                alt='avatar'
                                                key={2}
                                                src={session.user.image || "/errorAvatar.jpg"}
                                                roundedCircle
                                                width="40"
                                                height="40"
                                                className="ml-1"
                                                onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                                            />
                                        </Col>
                                    </Row> :
                                    <Nav.Link
                                        // href="/auth" 
                                        onClick={() => signIn('discord', { redirect: false })}
                                        className="mx-3"
                                        as={Button}
                                        variant='outline-info'
                                        style={{ padding: 7 }}
                                    >
                                        <h5 className='mb-0 mx-1'>
                                            Sign In <i className="bi bi-discord"></i>
                                        </h5>
                                    </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div >
    );
};
export default Bar;