import type { AppContext } from "next/app";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../../users";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { ssrRequest } from "../../../api/ssr-request";
import { IDistributor } from "../";

interface EditDistributorProps {
  distributor: IDistributor;
  currentUser: IUser;
}

const EditDistributor = ({
  distributor,
  currentUser,
}: EditDistributorProps) => {
  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  });

  if (!distributor) {
    return <h1>Distributor not found</h1>;
  } else {
    const { name, id } = distributor;

    const [newName, setName] = useState(name);

    const { doRequest, errorsJSX, inputStyle } = useRequest({
      url: `/distributors/${id}`,
      method: "put",
      body: {
        name: newName,
      },
      onSuccess: () => Router.push(`/distributors`),
    });

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await doRequest();
    };

    const onCancel = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      Router.push(`/distributors`);
    };

    return currentUser ? (
      <div className="full-page">
        <div className="card max-w-800 m-3 big-shadow">
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <h1 className="title m-3 mb-5 is-4">
                <i className="fas fa-edit mr-1"></i> Edit Distributor
              </h1>
              <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                <div className="field m-3">
                  <label className="label">Distributor Name</label>
                  <input
                    className={inputStyle("name")}
                    type="text"
                    value={newName}
                    required
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {errorsJSX()}
              <div className="m-3 mt-6 ">
                <NiceButton>
                  <i className="far fa-save"></i>
                  <span className="m-1"></span> Save Distributor
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

EditDistributor.getInitialProps = async (ctx: AppContext["ctx"]) => {
  const { distributorId } = ctx.query;
  const url = `/distributors/${distributorId}`;
  const { data } = await ssrRequest(ctx, url);
  return { distributor: data };
};

export default EditDistributor;
