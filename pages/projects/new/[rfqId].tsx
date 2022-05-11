import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import { useRequest } from "../../../hooks/useRequest";
import { UserPicker } from "../../../components/user-picker";
import { GetStaticPaths } from "next";
import { NiceButton } from "../../../components/nice-button";
import { Loader } from "../../../components/loader";
import { IUser } from "../../users";
import { IProject } from "..";

interface NewProjectProps {
  currentUser: IUser;
}

const NewProject = ({ currentUser }: NewProjectProps) => {
  const router = useRouter();
  const rfqId = router.query.rfqId || 1;

  const [projectClientId, setProjectClientId] = useState(0);
  const [pmId, setPmId] = useState(0);
  const [industryId, seIndustryId] = useState(0);
  const [note, setNote] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: "/projects",
    method: "post",
    body: {
      project_client_id: projectClientId,
      industry_id: industryId,
      pm_id: pmId,
      note,
      rfq_id: rfqId,
    },
    onSuccess: (project: IProject) => onSuccess(project),
  });

  const onSuccess = (project: IProject) => {
    Router.push(`/projects/${project.id}`);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    Router.push("/projects");
  };

  if (!currentUser) {
    return <div></div>;
  }
  const renderContent = () => (
    <form onSubmit={onSubmit}>
      <h1 className="title m-3 mb-5">🍻 New Project</h1>
      <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
        <UserPicker
          handleChange={setProjectClientId}
          label="Client"
          fieldname="projectClientId"
          fetch="/clients"
        />

        <UserPicker
          handleChange={seIndustryId}
          label="Industry"
          fieldname="industryId"
          fetch="/industries"
        />

        <UserPicker
          handleChange={setPmId}
          label="PM"
          fieldname="pmId"
          fetch="/users"
        />

        <div className="field m-3">
          <label className="label">Note</label>
          <textarea
            className="textarea is-400"
            name="conclusions"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <div className="m-3 mt-6 ">
        <NiceButton>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> Add Project
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
      <Loader />
    </div>
  );

  return (
    <div className="full-page ">
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

export default NewProject;
