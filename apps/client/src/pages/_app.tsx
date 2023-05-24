import "ui/styles.css";
import type { AppProps } from "next/app";
import { Provider, useSelector } from "react-redux";
import store from "@/features/store";
import { Toast } from "ui";
import { getAlerts } from "@/features/slices/toastSlice";
import localFont from "next/font/local";

const myFont = localFont({ src: "../../public/Inter.ttf" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component className={myFont.className} {...pageProps} />
      <ToastWrapper />
    </Provider>
  );
}

const ToastWrapper = () => {
  const alerts = useSelector(getAlerts);
  return <Toast alerts={alerts} />;
};
