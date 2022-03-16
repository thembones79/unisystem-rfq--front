import { useEffect, useState, useCallback } from "react";
import { useRequest } from "../hooks/useRequest";
import type { AppProps, AppContext } from "next/app";
import { ssrRequest } from "../api/ssr-request";
import { Header } from "../components/header";
import { IUser } from "./users";
import "../styles/bulma.scss";
import "../styles/globals.scss";
import "../styles/fontawesome.css";

function AppComponent({ Component, pageProps }: AppProps) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const { doRequest, errorsJSX } = useRequest({
    url: "/users/currentuser",
    method: "get",
    onSuccess: ({ currentUser }: any) => setCurrentUser(currentUser),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

// AppComponent.getInitialProps = async (appContext: AppContext) => {
//   const { Component, ctx } = appContext;

//   console.log(ctx?.req?.headers);

//   // const url = "/users/currentuser";
//   // const { data } = await ssrRequest(ctx, url, qq);
//   // console.log({ data });
//   let pageProps = {};
//   // const ctxWithUser = { ...ctx, ...data };

//   if (Component.getInitialProps) {
//     pageProps = await Component.getInitialProps(ctx);
//   }
//   return { pageProps };
// };

export default AppComponent;
