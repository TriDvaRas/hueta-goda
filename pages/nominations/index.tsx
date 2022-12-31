import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import NominationPlaceholder from '../../components/plaseholders/NominationPlaceholder';
import GetThinLayout from '../../layouts/ThinLayout';
import { NominationFull } from '../../types/extendedApiTypes';
import { HGApiPaginationResponse } from '../../types/hg-api';
import { globalConfig } from '../../util/globalConfig';
import { NextPageWithLayout } from '../_app';
import NominationPreview from '../../components/previews/NominationPreview';
import Link from 'next/link';
import { randomSeededColor } from '../../util/colors';
import { useLocalStorage } from 'usehooks-ts';
import NominationFullDisplayWide from '../../components/displays/NominationFullDisplayWide';
import NominationFullDisplayWideCompact from '../../components/displays/NominationFullDisplayCompact';
import NominationFullWidePlaceholder from '../../components/plaseholders/NominationFullWidePlaceholder';
import _ from 'lodash';


const NominationsHome: NextPageWithLayout = () => {
  const router = useRouter()
  const [page, setPage] = useState(router.query.page || 1)
  const [nominationsPage, setNominationsPage] = useState<HGApiPaginationResponse<NominationFull[]> | undefined>(undefined)
  const [nominationsLoading, setNominationsLoading] = useState(true)
  const [fillingPathIds, setFillingPathIds] = useLocalStorage('fillingPathIds', [])

  useEffect(() => {
    setNominationsLoading(true)
    axios.get<HGApiPaginationResponse<NominationFull[]>>(`/api/nominations?page=${page}&pageSize=${globalConfig.defaultNominationsPageSize}`).then(res => {
      setNominationsPage(res.data)
      setNominationsLoading(false)
    })
    return () => setNominationsPage(undefined)
  }, [page])

  const [filteredItems, setFilteredItems] = useState<NominationFull[] | undefined>(undefined)
  useEffect(() => {
    if (nominationsPage) {
      setFilteredItems(_.orderBy(nominationsPage.items.filter(x =>
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
      ), ['NominationLike.length', 'Nominee.length', (a) => { return a.name.replace(/(Лучш|Худш).+ /, '').trim() }], ['desc', 'desc', 'asc']))
    }


  }, [nominationsPage, router.query.filled, router.query.tag])

  const handleFillAll = () => {

  }

  return <div>
    <Card bg='dark' className='my-3 p-2 d-flex align-items-center justify-content-between flex-row'>
      <Card.Title className=' ms-3 my-0 me-auto' style={{ fontSize: '200%', fontWeight: '600' }}>Моя Хуета Года<sup>™</sup></Card.Title>

      <FloatingLabel className=' me-1 ' controlId="floatingSelect" label="Вид">
        <Form.Select value={router.query.viewMode || 'compact'} onChange={e => {
          router.replace({
            query: { ...router.query, viewMode: (e.target as any).value },
          });
        }}>
          <option value='all'>Подробный</option>
          <option value='compact'>Компактный</option>
          <option value='classic'>Classic</option>
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel className=' me-1 ' controlId="floatingSelect" label="Заполненность">
        <Form.Select value={router.query.filled || ''} onChange={e => {
          router.replace({
            query: { ...router.query, filled: (e.target as any).value },
          });
        }}>
          <option value=''>Любая</option>
          <option value='none'>Не заполнено</option>
          <option value='1'>Топ 1-2</option>
          <option value='3'>Топ 3+</option>
        </Form.Select>
      </FloatingLabel>
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
      <Button className='my-0 ms-2 mh-100 h-100 text-light' style={{}} disabled={(filteredItems?.length || 0) < 1}>
        <Link href={filteredItems && filteredItems.length > 0 ? `/nominations/${filteredItems[0].id}/my?multiMode=true&fillQueue=${filteredItems.map(x => x.id).join(',')}` : '#'}>
          Заполнить все <i className="bi bi-box-arrow-up-right"></i>
        </Link>
      </Button>
    </Card>
    {
      router.query.viewMode == 'classic' ?
        <Row sm={2} md={3} lg={4} xl={6} className='mb-2 mx-2'>
          {nominationsLoading || !filteredItems ?
            "_".repeat(12).split('').map((x, i) => <Col key={i} className='mt-2'><NominationPlaceholder /></Col>) :
            filteredItems.map((x, i) => <Col key={i} className='mt-2' ><Link href={`/gallery/nominations/${x.id}`}><NominationPreview nomination={x} nominee={x.Nominee ? x.Nominee[0] : undefined} /></Link></Col>)
          }
        </Row> :
        router.query.viewMode == 'all' ?
          <Row lg={1} className='mb-2 mx-2'>
            {nominationsLoading || !filteredItems ?
              "_".repeat(4).split('').map((x, i) => <Col key={i} className='mt-2'><NominationFullWidePlaceholder /></Col>) :
              filteredItems.map((nomination, i) => <NominationFullDisplayWide
                updateNominationLikes={(newLikes) => nominationsPage && setNominationsPage({
                  ...nominationsPage,
                  items: nominationsPage.items.map(x => x.id == nomination.id ? {
                    ...x,
                    NominationLike: newLikes
                  } : x)
                })}
                key={i} nomination={nomination}>
                <div className='mt-auto d-flex align-items-start'>
                  <Link href={`/nominations/${nomination.id}/my`}>
                    <Button className='me-2 text-light' variant={(nomination?.Nominee?.length || 0) > 0 ? 'secondary' : 'primary'}>
                      Заполнить <i className="bi bi-box-arrow-up-right"></i>
                    </Button>
                  </Link>
                  <Link href={`/gallery/nominations/${nomination.id}`}>
                    <Button className='me-2 text-light' variant={(nomination?.Nominee?.length || 0) > 0 ? 'primary' : 'secondary'}>
                      Галерея <i className="bi bi-box-arrow-up-right"></i>
                    </Button>
                  </Link>
                </div>
              </NominationFullDisplayWide>)
            }
          </Row> :
          <Row lg={2} className='mb-2 mx-2'>
            {nominationsLoading || !filteredItems ?
              "_".repeat(8).split('').map((x, i) => <Col key={i} className='mt-2'><NominationFullWidePlaceholder /></Col>) :
              filteredItems.map((nomination, i) => <NominationFullDisplayWideCompact
                updateNominationLikes={(newLikes) => nominationsPage && setNominationsPage({
                  ...nominationsPage,
                  items: nominationsPage.items.map(x => x.id == nomination.id ? {
                    ...x,
                    NominationLike: newLikes
                  } : x)
                })}
                key={i} nomination={nomination}>
                <div className='mt-auto pt-3 d-flex align-items-start'>
                  <Link href={`/nominations/${nomination.id}/my`}>
                    <Button className='me-2 text-light' variant={(nomination?.Nominee?.length || 0) > 0 ? 'secondary' : 'primary'}>
                      Заполнить <i className="bi bi-box-arrow-up-right"></i>
                    </Button>
                  </Link>
                  <Link href={`/gallery/nominations/${nomination.id}`}>
                    <Button className='me-2 text-light' variant={(nomination?.Nominee?.length || 0) > 0 ? 'primary' : 'secondary'}>
                      Галерея <i className="bi bi-box-arrow-up-right"></i>
                    </Button>
                  </Link>
                </div>
              </NominationFullDisplayWideCompact>)
            }
          </Row>
    }
  </div >
}
NominationsHome.getLayout = GetThinLayout
export default NominationsHome
