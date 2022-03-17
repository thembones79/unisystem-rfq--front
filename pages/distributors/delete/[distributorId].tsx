import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { IDistributor } from "../";
import { Loader } from "../../../components/loader";

interface IDeleteDistributor {
  distributorId: string;
}

const DeleteDistributor: React.FC<IDeleteDistributor> = ({ distributorId }) => {
  const { doRequest, errorsJSX } = useRequest({
    url: `/distributors/${distributorId}`,
    method: "delete",
    onSuccess: () => router.push(`/distributors`),
  });

  useEffect(() => {
    getDistributor();
  }, []);

  const initRequest = useRequest({
    url: `/distributors/${distributorId}`,
    method: "get",
    onSuccess: (data: IDistributor) => setData(data),
  });
  const getDistributor = initRequest.doRequest;
  const [distributor, setDistributor] = useState<IDistributor>();

  const router = useRouter();

  const setData = (data: IDistributor) => {
    setDistributor(data);
  };

  if (!distributor) {
    return <Loader />;
  } else {
    const { name } = distributor;

    const deleteDistributor = () => {
      doRequest();
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
                onClick={() => router.push(`/distributors`)}
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
    props: { distributorId: context.params.distributorId }, // will be passed to the page component as props
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default DeleteDistributor;
