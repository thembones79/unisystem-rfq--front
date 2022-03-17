import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import { IUser } from "..";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { Loader } from "../../../components/loader";

interface DeleteUserProps {
  currentUser: IUser;
}

const DeleteUser = ({ currentUser }: DeleteUserProps) => {
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

  const { doRequest, errorsJSX } = useRequest({
    url: `/users/disable`,
    method: "post",
    body: {
      id: userId,
    },
    onSuccess: () => router.push(`/users`),
  });

  const deleteUser = async () => {
    await doRequest();
  };
  if (!currentUser) {
    return <div></div>;
  }

  if (!user) {
    return <Loader />;
  } else {
    const { username } = user;

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
              <NiceButton color="cancel" onClick={() => router.push(`/users`)}>
                No. I was wrong. Let's be friends
              </NiceButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export async function getStaticProps(context: any) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default DeleteUser;
