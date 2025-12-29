import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/logo.jpg" type="image/jpeg" />
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GlobNFTs" />
        <meta property="og:url" content="https://glob-nfts.vercel.app" />
        <meta
          property="og:image"
          content="https://glob-nfts.vercel.app/images/logo.jpg"
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        {/* Additional SEO */}
        <meta name="author" content="GlobNFTs Team" />
        <meta name="theme-color" content="#FEC7A0" />
        <link rel="canonical" href="https://glob-nfts.vercel.app" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
