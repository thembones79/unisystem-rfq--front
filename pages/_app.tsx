import type { AppProps, AppContext } from "next/app";
import { ssrRequest } from "../api/ssr-request";
import { Header } from "../components/header";
import { IUser } from "./users";
import "../styles/bulma.scss";
import "../styles/globals.scss";
import "../styles/fontawesome.css";

interface AppWithUser extends AppProps {
  currentUser: IUser;
}

function AppComponent({ Component, pageProps, currentUser }: AppWithUser) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

AppComponent.getInitialProps = async (appContext: AppContext) => {
  const { Component, ctx } = appContext;
  const url = "/users/currentuser";
  const { data } = await ssrRequest(ctx, url);
  let pageProps = {};
  const ctxWithUser = { ...ctx, ...data };

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctxWithUser);
  }
  return { pageProps, ...data };
};

export default AppComponent;
