import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";

interface NewIndustryProps {
  currentUser: IUser;
}

const NewIndustry: React.FC<NewIndustryProps> = ({ currentUser }) => {
  const [name, setName] = useState("");
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: "/industries",
    method: "post",
    body: {
      name,
    },
    onSuccess: () => Router.push("/industries"),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    Router.push("/industries");
  };

  return currentUser ? (
    <div className="full-page full-page--centered">
      <div className="card max-w-800 m-3  big-shadow">
        <div className="card-content">
          <form onSubmit={onSubmit}>
            <h1 className="title m-3 mb-5 is-4">🏭 New Industry</h1>
            <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
              <div className="field m-3">
                <label className="label">Industry Name</label>
                <input
                  className={inputStyle("name")}
                  type="text"
                  value={name}
                  required
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton>
                <i className="far fa-check-circle"></i>
                <span className="m-1"></span> Add Industry
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton color="cancel" onClick={(event) => onCancel(event)}>
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
};

export default NewIndustry;
