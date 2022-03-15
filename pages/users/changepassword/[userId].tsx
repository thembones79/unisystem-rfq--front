import type { AppContext } from "next/app";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { ssrRequest } from "../../../api/ssr-request";
import { IUser } from "../";

interface EditUserProps {
  user: IUser;
  currentUser: IUser;
}

const EditUser = ({ user, currentUser }: EditUserProps) => {
  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  });

  if (!user) {
    return <h1>User not found</h1>;
  } else {
    const { username, id } = user;

    const [newPassword, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const { doRequest, errorsJSX, inputStyle } = useRequest({
      url: `/users/${id}/changepassword`,
      method: "put",
      body: {
        password: newPassword,
        passwordConfirm,
      },
      onSuccess: () => Router.push(`/users`),
    });

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await doRequest();
    };

    const onCancel = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      Router.push("/users");
    };

    return currentUser ? (
      <div className="full-page">
        <div className="card max-w-800 m-3 big-shadow">
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <h1 className="title m-3 mb-6 is-4">
                <i className="fas fa-key mr-1"></i> Change Password for{" "}
                {username}
              </h1>

              <div className="field m-3">
                <label className="label">New Password</label>
                <input
                  className={inputStyle("password")}
                  type="password"
                  value={newPassword}
                  autoFocus
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="field m-3">
                <label className="label">Password Confirm</label>
                <input
                  className={inputStyle("passwordConfirm")}
                  type="password"
                  value={passwordConfirm}
                  required
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>

              {errorsJSX()}
              <div className="m-3 mt-6 ">
                <NiceButton>
                  <i className="far fa-save"></i>
                  <span className="m-1"></span> Save New Password
                </NiceButton>
                <span className="m-3"></span>
                <NiceButton color="cancel" onClick={onCancel}>
                  Cancel
                </NiceButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    );
  }
};

EditUser.getInitialProps = async (ctx: AppContext["ctx"]) => {
  const { userId } = ctx.query;
  const url = `/users/${userId}`;
  const { data } = await ssrRequest(ctx, url);
  return { user: data };
};

export default EditUser;
