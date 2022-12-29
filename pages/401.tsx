import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { NextPageWithLayout } from './_app';
import GetDefaultLayout from '../layouts/DefaultLayout';
import Error from 'next/error';
import Head from 'next/head';

const Error404: NextPageWithLayout = () => {
  return (
    <div className='error-container'>
      <Error statusCode={401} title='Ты кто? Для доступа к этой странице нужно войти' />
      <Head>
        <title>401</title>
      </Head>
    </div>
  )
}
Error404.getLayout = GetDefaultLayout
export default Error404
