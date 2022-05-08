import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import { useRequest } from "../../../hooks/useRequest";
import { NiceButton } from "../../../components/nice-button";
import { Loader } from "../../../components/loader";
import { IUser } from "../../users";

interface NewRndTaskProps {
  currentUser: IUser;
}

const NewRndTask = ({ currentUser }: NewRndTaskProps) => {
  const router = useRouter();
  const { projectId } = router.query;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duedate, setDuedate] = useState("");
  const [priority, setPriority] = useState("4");
  const [isLoading, setIsLoading] = useState(false);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/projects/${projectId}/tasks`,
    method: "post",
    body: {
      name,
      description,
      priority,
      duedate: duedate !== "" ? new Date(duedate).getTime() : 0,
    },
    onSuccess: () => onSuccess(),
  });

  const onSuccess = () => {
    Router.push(`/projects/${projectId}`);
    setIsLoading(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    Router.push(`/projects/${projectId}`);
  };

  if (!currentUser) {
    return <div></div>;
  }
  const renderContent = () => (
    <form onSubmit={onSubmit}>
      <h1 className="title m-3 mb-5">🚀 New Task for R&D</h1>

      <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
        <div className="field m-3">
          <label className="label">Name</label>
          <input
            className={inputStyle("name")}
            type="text"
            value={name}
            required
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field m-3">
          <label className="label">Due Date</label>
          <input
            className={inputStyle("duedate")}
            type="date"
            value={duedate}
            onChange={(e) => setDuedate(e.target.value)}
          />
        </div>

        <div className="field m-3">
          <label className="label">Priority</label>
          <div className={`select `}>
            <select
              name="priority"
              id="priority"
              value={priority}
              required
              onChange={(e) => {
                setPriority(e.target.value);
              }}
            >
              <option value="1">🟥 urgent</option>
              <option value="2">🟨 high</option>
              <option value="3">🟦 normal</option>
              <option value="4">⬜️ low</option>
            </select>
          </div>
        </div>

        <div className="field m-3">
          <label className="label">Description</label>
          <textarea
            className="textarea is-400"
            name="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="m-3 mt-6 ">
        <NiceButton>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> Add Task for R&D
        </NiceButton>
        <span className="m-3"></span>
        <NiceButton color="cancel" onClick={(event) => onCancel(event)}>
          Cancel
        </NiceButton>
      </div>
    </form>
  );

  const renderLoader = () => (
    <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <p className="title is-4 mb-6 mt-3">Please Wait...</p>
      <p className="subtitle">Signing into ClickUp...</p>
      <p className="subtitle">Signing into Sharepoint...</p>
      <Loader />
    </div>
  );

  return (
    <div className="full-page full-page--centered">
      <div className="card max-w-900 m-3 big-shadow">
        <div className="card-content">
          {isLoading ? renderLoader() : renderContent()}

          {errorsJSX()}
        </div>
      </div>
    </div>
  );
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

export default NewRndTask;
