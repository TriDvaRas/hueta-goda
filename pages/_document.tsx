import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Balsamiq+Sans:wght@400;700&family=Days+One&family=Montserrat+Alternates:wght@100;200;300;400;500;600;700;800;900&family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Pacifico&family=Pangolin&family=Pattaya&family=Poiret+One&family=Press+Start+2P&family=Reggae+One&family=Rubik+Beastly&family=Ruslan+Display&family=Russo+One&display=swap"
          rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
