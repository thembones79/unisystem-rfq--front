import React, { useState } from "react";
import Router from "next/router";
import { NiceButton } from "../../components/nice-button";
import { useRequest } from "../../hooks/useRequest";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: "/users/login",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className="full-page">
      <div className="card max-w-800 m-3 big-shadow">
        <div className="card-content">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
