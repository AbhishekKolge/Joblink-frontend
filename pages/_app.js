import { Provider } from "react-redux";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

import "../styles/globals.css";

import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import store from "../store";

export default function App({ Component, pageProps }) {
  if (Component.getLayout) {
    return Component.getLayout(
      <Provider store={store}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
          />
        </Head>
        <ProtectedRoute {...pageProps}>
          <Component {...pageProps} />
        </ProtectedRoute>
        <Toaster />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <Layout>
        <ProtectedRoute {...pageProps}>
          <Component {...pageProps} />
        </ProtectedRoute>
      </Layout>
      <Toaster />
    </Provider>
  );
}
