import { ReactElement } from "react";
import { Container } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useElementSize } from 'usehooks-ts';
import Head from "next/head";

export default function GetThinLayout(page: ReactElement) {
    return (
        <div className="h-100 bg-dark-900">
            <Head>
                <title>RFBW</title>
            </Head>
            <Navbar />
            <Container className="h-100 bg-dark-900">
                {page}
            </Container>
        </div>
    )
}