import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";

import { IUser } from "../";

interface EditUserProps {
  currentUser: IUser;
}

const EditUser = ({ currentUser }: EditUserProps) => {
  const [user, setUser] = useState<IUser>();
  const router = useRouter();
  const { userId } = router.query;
  const initRequest = useRequest({
    url: `/users/${userId}`,
    method: "get",
    onSuccess: (data: IUser) => setUser(data),
  });

  const getUser = initRequest.doRequest;

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
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
      onSuccess: () => router.push(`/users`),
    });

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await doRequest();
    };

    const onCancel = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      router.push("/users");
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

export default EditUser;
