import { useEffect, useState, useCallback } from "react";
import { useRequest } from "../hooks/useRequest";
import type { AppProps, AppContext } from "next/app";
import { Header } from "../components/header";
import { IUser } from "./users";
import "../styles/bulma.scss";
import "../styles/globals.scss";
import "../styles/fontawesome.css";

export interface ICurrentUser {
  currentUser: IUser;
}

function AppComponent({ Component, pageProps }: AppProps) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const { doRequest, errorsJSX } = useRequest({
    url: "/users/currentuser",
    method: "get",
    onSuccess: (data: ICurrentUser) => onSuccess(data.currentUser),
  });

  const onSuccess = (curr: IUser) => {
    setCurrentUser(curr);
  };

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

export default AppComponent;
