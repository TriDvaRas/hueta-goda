import Image from 'next/image'
import { Inter } from '@next/font/google'
import { NextPageWithLayout } from './_app'
import GetDefaultLayout from '../layouts/DefaultLayout'
import { useLocalStorage } from 'usehooks-ts'
import { Badge, Button, Card, Form, Nav } from 'react-bootstrap'
import GetThinLayout from '../layouts/ThinLayout';
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import LoadingDots from '../components/LoadingDots'

const inter = Inter({ subsets: ['latin'] })

const Home: NextPageWithLayout = () => {
  const { data: session, status: sessionStatus } = useSession()
  const [showNomineeExamples, setShowNomineeExamples] = useLocalStorage('showNomineeExamples', false)
  const [showSpoilerGlobal, setShowSpoilerGlobal] = useLocalStorage('showSpoilerGlobal', false)
  const [showNSFWGlobal, setShowNSFWGlobal] = useLocalStorage('showNSFWGlobal', false)
  return <div className='m-3'>
    <h1 className='text-center roadrage m-3 my-4' style={{ fontSize: '500%' }}>Хуйня Года 2022</h1>
    <Card bg='dark' className='mx-5'>
      <Card.Body>
        <Card.Text>
          Привет Бандит! Какой самый классный праздник в году? Правильно, Новый Год! А что может быть еще лучше чем Новый Год? Правильно! Шестая ежегодная стадия ежегодного Аутизма Rice Friends под кодовым названием Хуета Года™ или сокращенно Хуета Года™!
          В этом году у нас сплошные инновации. Например Дед Мороз наконец то отменил фотошоп (для любителей <span className='roadrage'>Road Rage</span> и проприетарного программного обеспечения все еще доступны прошлогодние паки <span style={{ color: 'var(--bs-primary)' }}><a href='https://tridvaras.github.io/HG2020/'>тут</a></span>) и альбомы в гугл фото (хотя они мне нравились) и принес нам полноценное веб приложение жрущее пару гигаблейдов оперативной памяти и не имеющее мобильной поддержки, ведь телефоны это прошлый век.
        </Card.Text>
        <Card.Text className='mb-1'>
          По давней традиции номинации описывались максимально непонятно, но теперь они с описанием (все еще непонятным). Названия категорий могут повторяться, так что ориентируйтесь лучше по описанию или тегам. Перед началом рекомендую потыкать глобальные настройки:
        </Card.Text>
        <Form.Check type='switch' label="Показывать чужие ответы при заполнении" checked={showNomineeExamples} onChange={(e) => setShowNomineeExamples(e.target.checked)} />
        <Form.Check type='switch' label="Показывать изображения со спойлерами" checked={showSpoilerGlobal} onChange={(e) => setShowSpoilerGlobal(e.target.checked)} />
        <Form.Check type='switch' label="Показывать NSFW изображения" checked={showNSFWGlobal} onChange={(e) => setShowNSFWGlobal(e.target.checked)} />
        И на последок, если у вас есть идеи для новых номинаций вы знаете кому писать и не забывайте ставить звездочки✨ понравившимся номинациям что бы другие пользователи видели их раньше <s>и не забили на них хер потому что устали заполнять спустя 20 штук</s>. А теперь удачи! Хотя она вам уже не поможет🙃
        {
          sessionStatus == 'loading' ? <LoadingDots compact className='me-3' count={5} size='sm' /> :
            session ?
              <div className='d-flex align-items-center justify-content-evenly'>
                <Link href={`/nominations`}><Button>Заполнять Хуету <i className="bi bi-box-arrow-up-right"></i></Button></Link>
                <Link href={`/gallery/people`}><Button>Смотреть чужую Хуету <i className="bi bi-box-arrow-up-right"></i></Button></Link>
                <Link href={`/gallery/nominations`}><Button>Смотреть Номинации <i className="bi bi-box-arrow-up-right"></i></Button></Link>
              </div> :
              <div className='d-flex align-items-center justify-content-center'>
                И не забудь залогиниться 🙂
                <Nav.Link
                  // href="/auth" 
                  onClick={() => signIn('discord', { redirect: false })}
                  className="mx-3"
                  as={Button}
                  variant='outline-info'
                  style={{ padding: 7 }}
                >
                  <h5 className='mb-0 mx-1'>
                    Sign In <i className="bi bi-discord"></i>
                  </h5>
                </Nav.Link>
              </div>
        }
        <Card.Text >
          Интерфейс создавался интуитивно понятным, если не понятно проблема в тебе. Любые баги будут игнорироватсья до протрезвления с пометкой <Badge bg='dark-700'>Working as Designed</Badge> или <Badge bg='dark-700'>Не предусмотренно бюджетом</Badge>. Кстати насчет бюджета, если вы хотите поддержать разработчика, то это можно сделать <span style={{ color: 'var(--bs-primary)' }}><a href='https://war.ukraine.ua/donate/'>здесь❤️</a></span>
        </Card.Text>
      </Card.Body>
    </Card>
  </div>
}
Home.getLayout = GetThinLayout
export default Home
