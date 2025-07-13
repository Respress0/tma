import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Telegram Auth App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
