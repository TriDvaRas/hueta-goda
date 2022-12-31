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
import { NominationFull, NominationWithAuthor, UserWithNominationsFull } from '../../../types/extendedApiTypes';
import { HGApiPaginationResponse } from '../../../types/hg-api';
import { globalConfig } from '../../../util/globalConfig';
import { NextPageWithLayout } from '../../_app';
import NominationDisplayWideCompact from '../../../components/displays/NominationDisplayCompact';
import _ from 'lodash';



const NominationsHome: NextPageWithLayout = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserWithNominationsFull | undefined>(undefined)
  const [nominationsLoading, setNominationsLoading] = useState(true)

  useEffect(() => {
    if (router.query.userId) {
      setNominationsLoading(true)
      axios.get<UserWithNominationsFull>(`/api/gallery/users/${router.query.userId}`).then(res => {
        setUser(res.data)
        setNominationsLoading(false)
      })
    }
    return () => setUser(undefined)
  }, [router.query.userId])

  return <div>
    <Card bg='dark' className='my-3 p-2 d-flex align-items-center justify-content-between flex-row'>
      <Card.Title className=' ms-3 my-0 me-auto' style={{ fontSize: '200%', fontWeight: '600' }}>Номинации Хуеты Года<sup>™</sup> 2022</Card.Title>
      <FloatingLabel className=' me-1 ' controlId="floatingSelect" label="Вид">
        <Form.Select value={router.query.viewMode || 'compact'} onChange={e => {
          router.replace({
            query: { ...router.query, viewMode: (e.target as any).value },
          });
        }}>
          <option value='all'>Все</option>
          <option value='compact'>Топ 3</option>
          <option value='classic'>Classic</option>
        </Form.Select>
      </FloatingLabel>
    </Card>
    {
      router.query.viewMode == 'classic' ?
        <Row sm={2} md={2} lg={3} xl={4} className='mb-2 mx-2'>
          {nominationsLoading || !user ?
            "_".repeat(8).split('').map((x, i) => <Col key={i} className='mt-2'><NominationPlaceholder /></Col>) :
            user?.nominations.map((x, i) => <Col key={i} className='mt-2' ><Link href={`/gallery/nominations/${x.id}`}><NominationPreview nomination={x} nominee={x.Nominee ? x.Nominee[0] : undefined} /></Link></Col>)
          }
        </Row> :
        router.query.viewMode == 'all' ?
          <Row lg={1} className='mb-2 mx-2'>

          </Row> :
          <Row lg={2} className='mb-2 mx-2'>

          </Row>
    }
  </div >
}
NominationsHome.getLayout = GetThinLayout
export default NominationsHome
