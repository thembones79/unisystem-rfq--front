import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { IClient } from "..";
import { Loader } from "../../../components/loader";

interface IDeleteClient {
  clientId: string;
}

const DeleteClient: React.FC<IDeleteClient> = ({ clientId }) => {
  const { doRequest, errorsJSX } = useRequest({
    url: `/clients/${clientId}`,
    method: "delete",
    onSuccess: () => router.push(`/clients`),
  });

  useEffect(() => {
    getClient();
  }, []);

  const initRequest = useRequest({
    url: `/clients/${clientId}`,
    method: "get",
    onSuccess: (data: IClient) => setData(data),
  });
  const getClient = initRequest.doRequest;
  const [client, setClient] = useState<IClient>();

  const router = useRouter();

  const setData = (data: IClient) => {
    setClient(data);
  };

  if (!client) {
    return <Loader />;
  } else {
    const { name } = client;

    const deleteClient = () => {
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
                  You are going to <b>delete</b> this client!
                </div>
                <div> Are you really sure you want to do this?</div>
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton color="danger" onClick={deleteClient}>
                <i className="far fa-trash-alt"></i>
                <span className="m-1"></span> Yes, I'm 100% sure. Delete this
                guy
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton
                color="cancel"
                onClick={() => router.push(`/clients`)}
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
    props: { clientId: context.params.clientId }, // will be passed to the page component as props
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default DeleteClient;
