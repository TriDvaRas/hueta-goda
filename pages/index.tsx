import Image from 'next/image'
import { Inter } from '@next/font/google'
import { NextPageWithLayout } from './_app'
import GetDefaultLayout from '../layouts/DefaultLayout'

const inter = Inter({ subsets: ['latin'] })

const Home: NextPageWithLayout = () => {
  return <div>
    
  </div>
}
Home.getLayout = GetDefaultLayout
export default Home
