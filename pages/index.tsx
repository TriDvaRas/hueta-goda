import Image from 'next/image'
import { Inter } from '@next/font/google'
import { NextPageWithLayout } from './_app'
import GetDefaultLayout from '../layouts/DefaultLayout'
import { useLocalStorage } from 'usehooks-ts'
import { Card, Form } from 'react-bootstrap'
import GetThinLayout from '../layouts/ThinLayout';

const inter = Inter({ subsets: ['latin'] })

const Home: NextPageWithLayout = () => {
  const [showNomineeExamples, setShowNomineeExamples] = useLocalStorage('showNomineeExamples', false)

  return <div className='m-3'>
    <Card bg='dark'>
      <Card.Body>
        <Form.Check type='switch' label="Показывать чужие ответы при заполнении" checked={showNomineeExamples} onChange={(e) => setShowNomineeExamples(e.target.checked)} />
      </Card.Body>
    </Card>
  </div>
}
Home.getLayout = GetThinLayout
export default Home
