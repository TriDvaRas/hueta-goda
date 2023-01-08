import { AspectRatio, NominationLike } from '@prisma/client';
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
    nomination: NominationFull
    overrideText?: string
}

export default function UserNominationFullDisplay(props: Props) {
    const { nomination, overrideText } = props
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)
    const nomineeTop = _.sortBy(nomination.Nominee || [], ['position', 'asc'])

    return <div className='mt-3 w-100 d-flex align-items-center justify-content-center flex-column' >
        <div className='mt-3 w-100 d-flex align-items-center justify-content-center ' >
            <Card className='py-2 px-3 d-flex align-items-center justify-content-center flex-row pt-3  w-100 h-100' bg='dark-850' text='light' style={{ maxWidth: 250 * nomineeTop.length, borderRadius: 20, overflow: 'visible' }}>
                {
                    nomination && nomineeTop.map(x => <NominationWithNomineeDisplay key={x.id} className={'mx-1'} nominee={x} nomination={nomination} textSource='nominee' imageSize='MEDIUM' />)
                }
            </Card>
        </div>
        <div className='text-center impact fs-1 mb-n3'>{overrideText || nomination.name.toUpperCase()}</div>
        {overrideText ? '' : <div className='text-center  '>{nomination.description}</div>}

    </div >
}
