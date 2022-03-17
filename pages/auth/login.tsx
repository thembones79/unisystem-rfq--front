import React, { useState } from "react";
import { NiceButton } from "../../components/nice-button";
import { useRequest } from "../../hooks/useRequest";
import { Loader } from "../../components/loader";

export interface IToken {
  token: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { doRequest, errorsJSX, inputStyle, errors } = useRequest({
    url: "/users/login",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: ({ token }: IToken) => onData(token),
  });

  const onData = (token: string) => {
    if (token) {
      localStorage.setItem("token", token);
      window.location.replace(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
      );
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
  };

  const renderLoader = () => (
    <form onSubmit={onSubmit}>
      <h1 className="title m-3 mb-5">🔐 Log In </h1>

      <div className="field m-3">
        <label className="label">Email Address</label>
        <input
          className={inputStyle("email")}
          name="email"
          type="text"
          value={email}
          required
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field m-3">
        <label className="label">Password</label>
        <input
          className={inputStyle("password")}
          type="password"
          name="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorsJSX()}
      <div className="mx-3 mt-6 mb-4">
        <NiceButton>
          <i className="fas fa-sign-in-alt"></i>
          <span className="m-1"></span> Log In
        </NiceButton>
      </div>
    </form>
  );

  const renderContent = () => (
    <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <Loader />
    </div>
  );

  return (
    <div className="full-page">
      <div className="card max-w-800 m-3 big-shadow">
        <div className="card-content">
          {isLoading && !errors.length ? renderContent() : renderLoader()}
        </div>
      </div>
    </div>
  );
};

export default Login;
