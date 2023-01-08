import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';

import Link from 'next/link';
import { useLocalStorage } from 'usehooks-ts';
import NominationFullDisplayWideCompact from '../../../../components/displays/NominationFullDisplayCompact';
import NominationFullDisplayWide from '../../../../components/displays/NominationFullDisplayWide';
import NominationFullWidePlaceholder from '../../../../components/plaseholders/NominationFullWidePlaceholder';
import NominationPlaceholder from '../../../../components/plaseholders/NominationPlaceholder';
import NominationPreview from '../../../../components/previews/NominationPreview';
import GetThinLayout from '../../../../layouts/ThinLayout';
import { NominationFull, NominationWithAuthor, UserWithNominationsFull, NomineeWithAuthor } from '../../../../types/extendedApiTypes';
import { HGApiPaginationResponse } from '../../../../types/hg-api';
import { globalConfig } from '../../../../util/globalConfig';
import { NextPageWithLayout } from '../../../_app';
import NominationDisplayWideCompact from '../../../../components/displays/NominationDisplayCompact';
import _ from 'lodash';
import UserNominationFullDisplayCompact from '../../../../components/displays/UserNominationFullDisplayCompact';
import GetDefaultLayout from '../../../../layouts/DefaultLayout';
import UserNominationFullDisplay from '../../../../components/displays/UserNominationFullDisplay';
import { Nomination, Nominee } from '@prisma/client';



const NominationsHome: NextPageWithLayout = () => {
  const router = useRouter()
  const [nomination, setNomination] = useState<NominationFull | undefined>(undefined)
  const [nominees, setNominees] = useState<NomineeWithAuthor[] | undefined>(undefined)
  const [nominationsLoading, setNominationsLoading] = useState(true)
  const [nomineesLoading, setNomineesLoading] = useState(true)

  useEffect(() => {
    if (router.query.nominationId) {
      setNominationsLoading(true)
      setNominationsLoading(true)
      axios.get<NomineeWithAuthor[]>(`/api/gallery/nominations/${router.query.nominationId}`).then(res => {
        setNominees(res.data)
        setNomineesLoading(false)
      })
      axios.get<NominationFull>(`/api/nominations/${router.query.nominationId}?full=true`).then(res => {
        setNomination(res.data)
        setNominationsLoading(false)
      })
    }
    return () => setNomination(undefined)
  }, [router.query.nominationId])
  const users = _.uniqBy(nominees?.map(x => x.author) || [], 'id').map(x => ({ ...x, nominees: nominees ? _.orderBy(nominees.filter(n => n.authorUserId == x.id), 'position', 'asc') : undefined }))
  return <div>
    <Container>
      <Card bg='dark' className='my-3 p-2 d-flex align-items-center justify-content-between flex-row'>
        <div>
          <Card.Title className=' ms-3 my-0 me-auto' style={{ fontSize: '200%', fontWeight: '600' }}>{nomination?.name || ''}</Card.Title>
          <Card.Subtitle className=' ms-3 mt-0 mb-1 me-auto' style={{ fontSize: '100%', fontWeight: '600' }}>{nomination?.description || ''}</Card.Subtitle>
        </div>
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
    </Container>
    {
      router.query.viewMode == 'classic' ?
        <Row sm={3} md={2} lg={3} xl={4} className='mb-2 mx-2'>
          {nominationsLoading || !nomination ?
            "_".repeat(8).split('').map((x, i) => <Col key={i} className='mt-2'><NominationPlaceholder /></Col>) :
            users.map((x, i) => <Col key={i} className='mt-2' ><NominationPreview overrideText={x.displayName || x.name} nomination={nomination} nominee={x.nominees ? x.nominees[0] : undefined} /></Col>)
          }
        </Row> :
        router.query.viewMode == 'all' ?
          <Row lg={1} className='mb-2 mx-2'>
            {nominationsLoading || !nomination ?
              "_".repeat(9).split('').map((x, i) => <Col key={i} className='mt-2'>
                <NominationFullWidePlaceholder />
              </Col>) :
              users.map((x, i) => <Col key={i} className='mt-2' >
                <UserNominationFullDisplay overrideText={x.displayName || x.name} nomination={{ ...nomination, Nominee: x.nominees }} />
              </Col>)
            }
          </Row> :
          <Row lg={3} className='mb-2 mx-2'>
            {nominationsLoading || !nomination ?
              "_".repeat(9).split('').map((x, i) => <Col key={i} className='mt-2'>
                <NominationFullWidePlaceholder />
              </Col>) :
              users.map((x, i) => <Col key={i} className='mt-2' >
                <UserNominationFullDisplayCompact overrideText={x.displayName || x.name} nomination={{ ...nomination, Nominee: x.nominees }} />
              </Col>)
            }
          </Row>
    }
  </div >
}
NominationsHome.getLayout = GetDefaultLayout
export default NominationsHome
