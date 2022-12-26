import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { NextPageWithLayout } from './_app';
import getDefaultLayout from '../layouts/DefaultLayout';
import Error from 'next/error';
import Head from 'next/head';

const Error500: NextPageWithLayout = ({ errorCode }: any) => {
  return (
    <div className='error-container'>
      <Error statusCode={errorCode} title='Ты все сломал. Молодец' />
      <Head>
        <title>Блять?</title>
      </Head>
    </div>
  )
}
Error500.getLayout = getDefaultLayout
export default Error500
