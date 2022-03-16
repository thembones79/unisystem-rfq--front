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
    const { shortname, email, role_id, username, id } = user;

    const [newEmail, setEmail] = useState(email);
    const [newUsername, setUsername] = useState(username);
    const [newShortname, setShortname] = useState(shortname);
    const [newRoleId, setRoleId] = useState(role_id);

    const { doRequest, errorsJSX, inputStyle } = useRequest({
      url: `/users/${id}`,
      method: "put",
      body: {
        email: newEmail,
        username: newUsername,
        shortname: newShortname,
        role_id: newRoleId,
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
              <h1 className="title m-3 mb-5 is-4">
                <i className="fas fa-edit mr-1"></i> Edit User
              </h1>

              <div className="field m-3">
                <label className="label">User Name</label>
                <input
                  className={inputStyle("username")}
                  type="text"
                  value={newUsername}
                  autoFocus
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="field m-3">
                <label className="label">Shortname</label>
                <input
                  className={inputStyle("shortname")}
                  type="text"
                  value={newShortname}
                  required
                  onChange={(e) => setShortname(e.target.value)}
                />
              </div>

              <div className="field m-3">
                <label className="label">Email Address</label>
                <input
                  className={inputStyle("email")}
                  type="text"
                  value={newEmail}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field m-3">
                <label className="label">Role</label>
                <div className={`select `}>
                  <select
                    name="role_id"
                    id="role_id"
                    value={newRoleId}
                    required
                    onChange={(e) => {
                      setRoleId(parseInt(e.target.value));
                    }}
                  >
                    <option></option>
                    <option value={1}>admin</option>
                    <option value={2}>PM</option>
                    <option value={3}>KAM</option>
                  </select>
                </div>
              </div>

              {errorsJSX()}
              <div className="m-3 mt-6 ">
                <NiceButton>
                  <i className="far fa-save"></i>
                  <span className="m-1"></span> Save User
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
