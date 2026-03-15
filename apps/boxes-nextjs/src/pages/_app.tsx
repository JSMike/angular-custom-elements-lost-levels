import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Boxes Next.js SSR Baseline</title>
        <meta
          name="description"
          content="Next.js Pages Router baseline for Lit custom-element SSR"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default CustomApp;
