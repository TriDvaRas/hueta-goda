import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import NominationPlaceholder from '../../components/plaseholders/NominationPlaceholder';
import GetThinLayout from '../../layouts/ThinLayout';
import { NominationFull } from '../../types/extendedApiTypes';
import { HGApiPaginationResponse } from '../../types/hg-api';
import { globalConfig } from '../../util/globalConfig';
import { NextPageWithLayout } from '../_app';
import NominationPreview from '../../components/previews/NominationPreview';


const NominationsHome: NextPageWithLayout = () => {
  const router = useRouter()
  const [page, setPage] = useState(router.query.page || 1)
  const [nominationsPage, setNominationsPage] = useState<HGApiPaginationResponse<NominationFull[]> | undefined>(undefined)
  const [nominationsLoading, setNominationsLoading] = useState(true)
  useEffect(() => {
    setNominationsLoading(true)
    axios.get<HGApiPaginationResponse<NominationFull[]>>(`/api/nominations?page=${page}&pageSize=${globalConfig.defaultNominationsPageSize}`).then(res => {
      setNominationsPage(res.data)
      setNominationsLoading(false)
    })
    return () => setNominationsPage(undefined)
  }, [page])

  return <div>
    <Row sm={2} md={3} lg={4} xl={6} className='mb-2'>
      {nominationsLoading ?
        "_".repeat(12).split('').map((x, i) => <Col key={i} className='mt-2'><NominationPlaceholder /></Col>) :
        nominationsPage?.items.map((x, i) => <Col key={i} className='mt-2' onClick={()=>router.push(`/nominations/${x.id}`)}><NominationPreview nomination={x} /></Col>)
      }
    </Row>

  </div>
}
NominationsHome.getLayout = GetThinLayout
export default NominationsHome
