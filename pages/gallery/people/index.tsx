import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';

import _ from 'lodash';
import NominationDisplayWideCompact from '../../../components/displays/NominationDisplayCompact';
import NominationFullWidePlaceholder from '../../../components/plaseholders/NominationFullWidePlaceholder';
import GetThinLayout from '../../../layouts/ThinLayout';
import { NominationFull, NominationWithAuthor, UserWithStats } from '../../../types/extendedApiTypes';
import { HGApiPaginationResponse } from '../../../types/hg-api';
import { globalConfig } from '../../../util/globalConfig';
import { NextPageWithLayout } from '../../_app';
import UserDisplayWideCompact from '../../../components/displays/UserDisplayCompact';
import { DotLoader } from 'react-spinners';
import Link from 'next/link';



const NominationsHome: NextPageWithLayout = () => {
  const router = useRouter()
  const [users, setUsers] = useState<UserWithStats[] | undefined>(undefined)
  const [usersLoading, setUsersLoading] = useState(true)

  useEffect(() => {
    setUsersLoading(true)
    axios.get<UserWithStats[]>(`/api/gallery/users`).then(res => {
      setUsers(res.data)
      setUsersLoading(false)
    })
    return () => setUsers(undefined)
  }, [])


  return <div>
    <Card bg={'dark'} className='my-3 p-2 d-flex align-items-center justify-content-between flex-row'>
      <Card.Title className=' ms-3 my-0 me-auto' style={{ fontSize: '200%', fontWeight: '600' }}>Вот они! Люди...</Card.Title>
      <FloatingLabel className=' me-1 ' style={{ opacity: 0 }} controlId="floatingSelect" label="Тег">
        <Form.Select value={router.query.tag || ''} onChange={e => {
          router.replace({
            query: { ...router.query, tag: (e.target as any).value },
          });
        }}>
          <option value=''>Все</option>
        </Form.Select>
      </FloatingLabel>
    </Card>
    <div className='d-flex justify-content-center flex-wrap px-4'>
      {usersLoading && users ? <DotLoader /> :
        _.orderBy(users, 'nominationsFilled', 'desc').map(x => <Link className='mb-3' key={x.id} href={`/gallery/people/${x.id}`}><UserDisplayWideCompact user={x} /></Link>)
      }
    </div>
  </div >
}
NominationsHome.getLayout = GetThinLayout
export default NominationsHome
