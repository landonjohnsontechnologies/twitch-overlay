import type { AppProps } from "next/app";
import React from "react";
import Layout from "../components/layout/Layout";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
