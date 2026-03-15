import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Aura Home"
        defaultTitle="Aura Home - Quality Furniture in Sri Lanka"
        description="Discover quality furniture at Aura Home. From modern sofas to dining tables, we offer the best furniture in Sri Lanka with island-wide delivery."
        canonical="https://aurahomelk.com"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://aurahomelk.com',
          siteName: 'Aura Home',
          images: [
            {
              url: 'https://aurahomelk.com/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Aura Home',
            },
          ],
        }}
        twitter={{
          handle: '@aurahomelk',
          site: '@aurahomelk',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          { property: 'keywords', content: 'furniture, Sri Lanka, home decor, sofas, dining tables, bedroom, living room' },
          { name: 'author', content: 'Aura Home' },
        ]}
      />
      <Component {...pageProps} />
    </>
  )
}
