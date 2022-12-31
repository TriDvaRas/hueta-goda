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

export default function UserNominationFullDisplayCompact(props: Props) {
    const { nomination, overrideText } = props
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)
    const nomineeTop = _.sortBy(nomination.Nominee || [], ['position', 'asc'])

    return <div className='mt-3'>
        <Card className='py-2 px-2 d-flex align-items-center flex-row pt-3  w-100 h-100' bg='dark-850' text='light' style={{ borderRadius: 20, overflow: 'visible' }}>
            {
                nomination ?
                    <NominationWithNomineeDisplay nominee={nomineeTop[0]} nomination={nomination} textSource='nominee' imageSize='MEDIUM' /> :
                    <NominationPlaceholder noText />
            }
            {
                nomination ?
                    <NominationWithNomineeDisplay className='mx-2' nominee={nomineeTop[1]} nomination={nomination} textSource='nominee' imageSize='MEDIUM' /> :
                    <NominationPlaceholder noText />
            }
            {
                nomination ?
                    <NominationWithNomineeDisplay nominee={nomineeTop[2]} nomination={nomination} textSource='nominee' imageSize='MEDIUM' /> :
                    <NominationPlaceholder noText />
            }
        </Card>
        <div className='text-center impact fs-1'>{overrideText || nomination.name.toUpperCase()}</div>
    </div >
}
