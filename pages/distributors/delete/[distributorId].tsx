import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { IUser } from "../../users";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { IDistributor } from "../";

interface DeleteDistributorProps {
  currentUser: IUser;
}

const DeleteDistributor = ({ currentUser }: DeleteDistributorProps) => {
  const router = useRouter();
  const { distributorId } = router.query;
  const [distributor, setDistributor] = useState<IDistributor>();

  const initRequest = useRequest({
    url: `/distributors/${distributorId}`,
    method: "get",
    onSuccess: (data: IDistributor) => setDistributor(data),
  });

  const getDistributor = initRequest.doRequest;

  useEffect(() => {
    getDistributor();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
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
      onSuccess: () => router.push(`/distributors`),
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

export default DeleteDistributor;
