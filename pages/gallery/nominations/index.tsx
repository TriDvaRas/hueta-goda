import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';

import Link from 'next/link';
import { useLocalStorage } from 'usehooks-ts';
import NominationFullDisplayWideCompact from '../../../components/displays/NominationFullDisplayCompact';
import NominationFullDisplayWide from '../../../components/displays/NominationFullDisplayWide';
import NominationFullWidePlaceholder from '../../../components/plaseholders/NominationFullWidePlaceholder';
import NominationPlaceholder from '../../../components/plaseholders/NominationPlaceholder';
import NominationPreview from '../../../components/previews/NominationPreview';
import GetThinLayout from '../../../layouts/ThinLayout';
import { NominationFull, NominationWithAuthor } from '../../../types/extendedApiTypes';
import { HGApiPaginationResponse } from '../../../types/hg-api';
import { globalConfig } from '../../../util/globalConfig';
import { NextPageWithLayout } from '../../_app';
import NominationDisplayWideCompact from '../../../components/displays/NominationDisplayCompact';



const NominationsHome: NextPageWithLayout = () => {
  const router = useRouter()
  const [page, setPage] = useState(router.query.page || 1)
  const [nominationsPage, setNominationsPage] = useState<HGApiPaginationResponse<NominationWithAuthor[]> | undefined>(undefined)
  const [nominationsLoading, setNominationsLoading] = useState(true)
  const [fillingPathIds, setFillingPathIds] = useLocalStorage('fillingPathIds', [])

  useEffect(() => {
    setNominationsLoading(true)
    axios.get<HGApiPaginationResponse<NominationWithAuthor[]>>(`/api/nominations?onlyAuthor=true&page=${page}&pageSize=${globalConfig.defaultNominationsPageSize}`).then(res => {
      setNominationsPage(res.data)
      setNominationsLoading(false)
    })
    return () => setNominationsPage(undefined)
  }, [page])

  const [filteredItems, setFilteredItems] = useState<NominationFull[] | undefined>(undefined)
  useEffect(() => {
    if (nominationsPage) {
      setFilteredItems(nominationsPage.items.filter(x =>
        (
          !router.query.tag || typeof router.query.tag == 'string' && (x.tags as string[]).includes(router.query.tag) || typeof router.query.tag == 'object' && (x.tags as string[]).find(t => router.query.tag?.includes(t))
        )
        && (
          !router.query.filled || (
            router.query.filled === 'none' && (!x.Nominee || x.Nominee.length == 0)
            || router.query.filled === '1' && (x.Nominee?.length === 1 || x.Nominee?.length === 2)
            || router.query.filled === '3' && ((x.Nominee?.length || 0) > 2)
          )
        )
      ))
    }
  }, [nominationsPage, router.query.filled, router.query.tag])

  return <div>
    <Card bg='dark' className='my-3 p-2 d-flex align-items-center justify-content-between flex-row'>
      <Card.Title className=' ms-3 my-0 me-auto' style={{ fontSize: '200%', fontWeight: '600' }}>Номинации Хуеты<sup>™</sup></Card.Title>
      <FloatingLabel className=' me-1 ' controlId="floatingSelect" label="Тег">
        <Form.Select value={router.query.tag || ''} onChange={e => {
          router.replace({
            query: { ...router.query, tag: (e.target as any).value },
          });
        }}>
          <option value=''>Все</option>
          {globalConfig.nominationTags.map(t => <option key={t} value={t} className={'me-1'}
            style={{
              // backgroundColor: randomSeededColor(t),
            }}>{t}</option>)}
        </Form.Select>
      </FloatingLabel>
    </Card>
    <Row lg={2} className='mb-2 mx-2'>
      {nominationsLoading || !filteredItems ?
        "_".repeat(8).split('').map((x, i) => <Col key={i} className='mt-2'><NominationFullWidePlaceholder /></Col>) :
        filteredItems.map((nomination, i) => <Col key={i} className='mt-3'><NominationDisplayWideCompact  nomination={nomination}>
        </NominationDisplayWideCompact></Col>)
      }
    </Row>
  </div >
}
NominationsHome.getLayout = GetThinLayout
export default NominationsHome
