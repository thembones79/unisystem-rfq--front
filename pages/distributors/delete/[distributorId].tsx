import type { AppContext } from "next/app";
import React, { useEffect } from "react";
import Router from "next/router";
import { IUser } from "../../users";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { ssrRequest } from "../../../api/ssr-request";
import { IDistributor } from "../";

interface DeleteDistributorProps {
  distributor: IDistributor;
  currentUser: IUser;
}

const DeleteDistributor = ({
  distributor,
  currentUser,
}: DeleteDistributorProps) => {
  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  });

  if (!currentUser) {
    return <div></div>;
  }

  if (!distributor) {
    return <h1>Distributor not found</h1>;
  } else {
    const { id, name } = distributor;

    const { doRequest, errorsJSX } = useRequest({
      url: `/distributors/${id}`,
      method: "delete",
      onSuccess: () => Router.push(`/distributors`),
    });

    const deleteDistributor = async () => {
      await doRequest();
    };

    return (
      <div className="full-page">
        <div className="card max-w-800 m-3 big-shadow">
          <div className="card-content">
            <h1 className="title m-3 mb-6 is-4">
              <i className="fas fa-trash-alt mr-1"></i> Delete {name}?
            </h1>
            <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
              <div className="m-3">
                <div>
                  You are going to <b>delete</b> this distributor!
                </div>
                <div> Are you really sure you want to do this?</div>
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton color="danger" onClick={deleteDistributor}>
                <i className="far fa-trash-alt"></i>
                <span className="m-1"></span> Yes, I'm 100% sure. Delete this
                guy
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton
                color="cancel"
                onClick={() => Router.push(`/distributors`)}
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

DeleteDistributor.getInitialProps = async (ctx: AppContext["ctx"]) => {
  const { distributorId } = ctx.query;
  const url = `/distributors/${distributorId}`;
  const { data } = await ssrRequest(ctx, url);
  return { distributor: data };
};

export default DeleteDistributor;
