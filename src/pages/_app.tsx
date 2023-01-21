/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import 'material-icons/iconfont/material-icons.css';
import NextNProgress from 'nextjs-progressbar';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { trpc } from '~/utils';
import { Alert } from '~/components';

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <NextNProgress />
      <Component {...pageProps} />
      <Alert />
    </RecoilRoot>
  );
}

export default trpc.withTRPC(App);
