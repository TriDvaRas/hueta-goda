import '../styles/globals.css'
import '../styles/custom.sass'
import '../styles/fonts.sass'
import '../styles/aspectRatio.sass'
import 'react-placeholder/lib/reactPlaceholder.css';
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout = NextPage<any> & {
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <SessionProvider session={session}>
      {/* <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head> */}
      <div id="app" className={`mh-100 bg-dark-900 `}>
        {getLayout(<Component {...pageProps} />)}
      </div>
    </SessionProvider>
  )
}

