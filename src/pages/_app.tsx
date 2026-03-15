import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Aura Home - Quality Furniture in Sri Lanka</title>
        <meta name="description" content="Discover quality furniture at Aura Home. From modern sofas to dining tables, we offer the best furniture in Sri Lanka with island-wide delivery." />
        <meta name="keywords" content="furniture, Sri Lanka, home decor, sofas, dining tables, bedroom, living room" />
        <meta property="og:title" content="Aura Home - Quality Furniture in Sri Lanka" />
        <meta property="og:description" content="Discover quality furniture at Aura Home" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
