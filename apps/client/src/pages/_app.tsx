import React from "react";
import "ui/styles.css";
import type { AppProps } from "next/app";
import { Provider, useSelector } from "react-redux";
import { Toast } from "ui";
import localFont from "next/font/local";
import store from "@/features/store";
import { getAlerts } from "@/features/slices/toastSlice";

const myFont = localFont({ src: "../../public/Inter.ttf" });

// a wrapper around Toast so it can access useSelector
function ToastWrapper() {
  const alerts = useSelector(getAlerts);
  return <Toast alerts={alerts} />;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component className={myFont.className} {...pageProps} />
      <ToastWrapper />
    </Provider>
  );
}
