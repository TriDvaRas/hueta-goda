import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Col, Row, Card, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import NominationPlaceholder from '../../../components/plaseholders/NominationPlaceholder';
import NominationPreview from '../../../components/previews/NominationPreview';
import GetThinLayout from '../../../layouts/ThinLayout';
import { NominationFull } from '../../../types/extendedApiTypes';
import { HGApiPaginationResponse } from '../../../types/hg-api';
import { globalConfig } from '../../../util/globalConfig';
import { NextPageWithLayout } from '../../_app';
import { UserRole } from '@prisma/client';


const NominationsHome: NextPageWithLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [page, setPage] = useState(router.query.page || 1)
  const [nominationsPage, setNominationsPage] = useState<HGApiPaginationResponse<NominationFull[]> | undefined>(undefined)
  const [nominationsLoading, setNominationsLoading] = useState(true)
  useEffect(() => {
    if (session?.user.id) {
      setNominationsLoading(true)
      axios.get<HGApiPaginationResponse<NominationFull[]>>(`/api/nominations?ownerId=${session?.user.id}&page=${page}&pageSize=${globalConfig.defaultNominationsPageSize}`).then(res => {
        setNominationsPage(res.data)
        setNominationsLoading(false)
      })
    }
    return () => setNominationsPage(undefined)
  }, [page, session?.user.id])
  const handleNew = () => {
    axios.post<NominationFull>(`/api/nominations/`, globalConfig.dummyNomination)
      .then((res) => {
        if (nominationsPage?.items) {
          setNominationsPage({ ...nominationsPage, items: [res.data, ...nominationsPage.items], totalItems: nominationsPage.totalItems + 1 })
        }
      })
  }
  if (session && !(session.user.role == UserRole.ADMIN))
    router.push('/403')
  return <div>
    <Card bg='dark' text='light' className='mt-3'>
      <Card.Body>
        <Card.Title>Мои Номинации</Card.Title>
        <div className='d-flex w-100'>
          <Card.Text>Тут можно создавать и редактировать номинации. Правда. Но не всем.</Card.Text>
          <Button className='ms-auto' onClick={handleNew}>New</Button>
        </div>
      </Card.Body>
    </Card>
    <Row sm={2} md={3} lg={4} xl={6} className='mb-2'>
      {nominationsLoading ?
        "_".repeat(12).split('').map((x, i) => <Col key={i} className='mt-2'><NominationPlaceholder /></Col>) :
        nominationsPage?.items.map((x, i) => <Col key={i} className='mt-2' onClick={() => router.push(`/nominations/${x.id}/edit`)}><NominationPreview nomination={x} /></Col>)
      }
      {nominationsPage?.items.length == 0 && <Col xl={12} className='mt-5 text-center'>Тут ничего нет...</Col>}
    </Row>

  </div>
}
NominationsHome.getLayout = GetThinLayout
export default NominationsHome
