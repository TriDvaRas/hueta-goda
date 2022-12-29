import { AspectRatio } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocalStorage } from 'usehooks-ts';
import NominationFullDisplayWide from '../../../components/displays/NominationFullDisplayWide';
import GetThinLayout from '../../../layouts/ThinLayout';
import { NominationFull } from '../../../types/extendedApiTypes';
import { NextPageWithLayout } from '../../_app';

const NominationEdit: NextPageWithLayout = () => {
    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [showAdminTools, setShowAdminTools] = useLocalStorage('showAdminTools', false)
    const [nominationId, setNominationId] = useState<string>(router.query.nominationId as string)
    useEffect(() => {
        setNominationId(router.query.nominationId as string)
    }, [router.query.nominationId])
    const [nomination, setNomination] = useState<NominationFull | undefined>(undefined)
    const [nominationLoading, setNominationLoading] = useState(true)
    useEffect(() => {
        if (nominationId) {
            setNominationLoading(true)
            axios.get<NominationFull>(`/api/nominations/${nominationId}?full=true`).then(res => {
                setNomination(res.data)
                setNominationLoading(false)
            })
        }
        return () => setNomination(undefined)
    }, [nominationId])


    return <div>
        {nomination &&
            <NominationFullDisplayWide nomination={nomination}>
                <div className='mt-auto d-flex align-items-start'>
                    <Link href={`/nominations/${nomination.id}/my`}><Button className='me-2' variant={(nomination?.Nominee?.length || 0) > 0 ? 'secondary' : 'primary'}>
                        Заполнить <i className="bi bi-box-arrow-up-right"></i>
                    </Button></Link>
                    <Link href={'/nominations'}><Button className='me-2' variant={'secondary'}>Назад</Button></Link>
                </div>
            </NominationFullDisplayWide>}
    </div >
}
NominationEdit.getLayout = GetThinLayout
export default NominationEdit
