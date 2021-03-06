import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import { IUser } from "../../../users";
import { Loader } from "../../../../components/loader";
import { NiceButton } from "../../../../components/nice-button";
import { useRequest } from "../../../../hooks/useRequest";

interface DeleteTaskProps {
  currentUser: IUser;
}

const DeleteTask = ({ currentUser }: DeleteTaskProps) => {
  const router = useRouter();
  const { projectId, serial } = router.query;

  const { doRequest, errorsJSX } = useRequest({
    url: `/projects/${projectId}/tasks/${serial}`,
    method: "delete",
    onSuccess: () => router.push(`/projects/${projectId}`),
  });

  const deleteTask = async () => {
    await doRequest();
  };

  if (!currentUser) {
    return <div></div>;
  }

  if (!serial) {
    return <Loader />;
  } else {
    return (
      <div className="full-page">
        <div className="card max-w-800 m-3 big-shadow">
          <div className="card-content">
            <h1 className="title m-3 is-4 mb-6">
              <i className="fas fa-trash-alt mr-1"></i> Delete task?
            </h1>
            <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
              <div className="m-3">
                <div>
                  You are going to <b>delete</b> this task!
                </div>
                <div> Are you really sure you want to do this?</div>
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton color="danger" onClick={deleteTask}>
                <i className="far fa-trash-alt"></i>
                <span className="m-1"></span> Yes, I'm 100% sure. Delete this
                task
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton
                color="cancel"
                onClick={() => router.push(`/projects/${projectId}`)}
              >
                No. I was wrong. Take me back, please
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

export default DeleteTask;
