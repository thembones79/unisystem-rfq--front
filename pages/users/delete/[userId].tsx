import type { AppContext } from "next/app";
import React, { useEffect } from "react";
import Router from "next/router";
import { IUser } from "..";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { ssrRequest } from "../../../api/ssr-request";

interface DeleteUserProps {
  user: IUser;
  currentUser: IUser;
}

const DeleteUser = ({ user, currentUser }: DeleteUserProps) => {
  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  });

  if (!currentUser) {
    return <div></div>;
  }

  if (!user) {
    return <h1>User not found</h1>;
  } else {
    const { id, username } = user;

    const { doRequest, errorsJSX } = useRequest({
      url: `/users/disable`,
      method: "post",
      body: {
        id,
      },
      onSuccess: () => Router.push(`/users`),
    });

    const deleteUser = async () => {
      await doRequest();
    };

    return (
      <div className="full-page">
        <div className="card max-w-800 m-3 big-shadow">
          <div className="card-content">
            <h1 className="title m-3 mb-5 is-4">
              <i className="fas fa-skull mr-1"></i> Destroy {username}?
            </h1>
            <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
              <div className="m-3">
                <div>
                  You are going to <b>murder</b> this poor soul!
                </div>
                <div> Are you really sure you want to do this?</div>
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton color="danger" onClick={deleteUser}>
                <i className="far fa-trash-alt"></i>
                <span className="m-1"></span> Yes, I'm 100% sure. Fatality!
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton color="cancel" onClick={() => Router.push(`/users`)}>
                No. I was wrong. Let's be friends
              </NiceButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

DeleteUser.getInitialProps = async (ctx: AppContext["ctx"]) => {
  const { userId } = ctx.query;
  const url = `/users/${userId}`;
  const { data } = await ssrRequest(ctx, url);
  return { user: data };
};

export default DeleteUser;
