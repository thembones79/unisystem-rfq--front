import type { AppContext } from "next/app";
import React, { useEffect } from "react";
import Router from "next/router";
import { IUser } from "../../users";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { ssrRequest } from "../../../api/ssr-request";
import { IRfq } from "../";

interface IRfqWithIds extends IRfq {
  customer_id: number;
  distributor_id: number;
  pm_id: number;
  kam_id: number;
}

interface DeleteRfqProps {
  rfq: IRfqWithIds;
  currentUser: IUser;
}

const DeleteRfq = ({ rfq, currentUser }: DeleteRfqProps) => {
  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  });

  if (!currentUser) {
    return <div></div>;
  }

  if (!rfq) {
    return <h1>RFQ not found</h1>;
  } else {
    const { rfq_code, id } = rfq;

    const { doRequest, errorsJSX } = useRequest({
      url: `/rfqs/${id}`,
      method: "delete",
      onSuccess: () => Router.push(`/rfqs`),
    });

    const deleteRfq = async () => {
      await doRequest();
    };

    return (
      <div className="full-page">
        <div className="card max-w-800 m-3 big-shadow">
          <div className="card-content">
            <h1 className="title m-3 is-4 mb-6">
              <i className="fas fa-trash-alt mr-1"></i> Delete {rfq_code}?
            </h1>
            <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
              <div className="m-3">
                <div>
                  You are going to <b>delete</b> this RFQ!
                </div>
                <div> Are you really sure you want to do this?</div>
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton color="danger" onClick={deleteRfq}>
                <i className="far fa-trash-alt"></i>
                <span className="m-1"></span> Yes, I'm 100% sure. Delete this
                RFQ
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton
                color="cancel"
                onClick={() => Router.push(`/rfqs/${id}`)}
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

DeleteRfq.getInitialProps = async (ctx: AppContext["ctx"]) => {
  const { rfqId } = ctx.query;
  const url = `/rfqs/${rfqId}`;
  const { data } = await ssrRequest(ctx, url);
  return { rfq: data };
};

export default DeleteRfq;
