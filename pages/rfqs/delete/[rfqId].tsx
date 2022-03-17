import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import { IUser } from "../../users";
import { Loader } from "../../../components/loader";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { IRfq } from "../";

interface DeleteRfqProps {
  currentUser: IUser;
}

const DeleteRfq = ({ currentUser }: DeleteRfqProps) => {
  const [rfq, setRfq] = useState<IRfq>();
  const router = useRouter();
  const { rfqId } = router.query;
  const initRequest = useRequest({
    url: `/rfqs/${rfqId}`,
    method: "get",
    onSuccess: (data: IRfq) => setRfq(data),
  });

  const { doRequest, errorsJSX } = useRequest({
    url: `/rfqs/${rfqId}`,
    method: "delete",
    onSuccess: () => router.push(`/rfqs`),
  });

  const deleteRfq = async () => {
    await doRequest();
  };

  const getRfq = initRequest.doRequest;

  useEffect(() => {
    getRfq();
  }, []);

  if (!currentUser) {
    return <div></div>;
  }

  if (!rfq) {
    return <Loader />;
  } else {
    const { rfq_code, id } = rfq;

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
                onClick={() => router.push(`/rfqs/${id}`)}
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

export default DeleteRfq;
