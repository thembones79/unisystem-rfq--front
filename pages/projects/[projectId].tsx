import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import React, { useEffect, useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { Loader } from "../../components/loader";
import { IProject } from ".";
import { Partnumbers } from "../../components/partnumbers";
import { IUser } from "../users";
import { spPath } from "../../utils/sp-path";
import { Rndtasks } from "../../components/rndtasks";
import { SharePointLogo } from "../../icons/sharepoint-logo";

interface ShowProjectProps {
  currentUser: IUser;
}

interface IProjectWithNames extends IProject {
  pm_fullname: string;
  kam_fullname: string;
  kam_folder: string;
  rfq_id: number;
  rfq: string;
  clickup_id: string;
  version: string;
  status: string;
  revision: string;
  note: string;
}

const ShowProject: React.FC<ShowProjectProps> = ({ currentUser }) => {
  const router = useRouter();
  const { projectId } = router.query;
  const [project, setProject] = useState<IProjectWithNames>({
    id: 0,
    project_code: "",
    department: "",
    client: "",
    industry: "",
    pm: "",
    kam: "",
    pm_fullname: "",
    kam_fullname: "",
    kam_folder: "",
    rfq_id: 0,
    rfq: "",
    clickup_id: "",
    version: "",
    status: "",
    revision: "",
    note: "",
    updated: "",
  });

  const isNotKam = currentUser?.role_id < 3;

  const { doRequest, errorsJSX } = useRequest({
    url: `/projects/${projectId}`,
    method: "get",
    onSuccess: (data: IProjectWithNames) => setProject(data),
  });

  useEffect(() => {
    doRequest();
  }, []);

  if (!project) {
    return <h1>Project not found</h1>;
  } else {
    const {
      id,
      project_code,
      department,
      client,
      industry,
      pm,
      kam,
      pm_fullname,
      kam_fullname,
      kam_folder,
      rfq_id,
      rfq,
      clickup_id,
      version,
      status,
      revision,
      note,
    } = project;

    const formatStatus = () => {
      if (status === "open") {
        return "is-warning";
      } else if (status === "in progress") {
        return "is-success";
      } else {
        return "is-link";
      }
    };

    const renderLoader = () => (
      <div className="card-content">
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
          <Loader />
        </div>
      </div>
    );

    const renderRfqLink = () => {
      if (rfq_id > 1) {
        return (
          <button
            className={`button is-success is-light m-4`}
            onClick={() => Router.push(`/rfqs/${rfq_id}`)}
          >
            <span className="m-2 ">go to RFQ: </span> <b>{rfq}</b>
          </button>
        );
      }
    };

    const renderContent = () => (
      <>
        <div className="card-content">
          <div className="mb-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
            <div className="is-flex is-flex-wrap-wrap">
              <h1 className="title my-3 is-4">{project_code}</h1>
              <span className="m-3 "></span>
              <button
                className={`button ${formatStatus()} is-light m-4`}
                onClick={() => {
                  const win = window.open(
                    `https://app.clickup.com/t/${clickup_id}`,
                    "_blank"
                  );
                  if (win) {
                    win.focus();
                  }
                }}
              >
                <span className="m-2 ">status: </span>
                <b>{status}</b>
              </button>
            </div>
            {renderRfqLink()}

            <div className="my-3 ">
              <button
                className="button is-link is-inverted"
                onClick={() => {
                  const path = spPath({ department, kam_folder });
                  const win = window.open(
                    `${path}/${client}/${project_code}`,
                    "_blank"
                  );
                  if (win) {
                    win.focus();
                  }
                }}
              >
                <SharePointLogo />
              </button>

              {isNotKam && (
                <>
                  <span className="m-3 mr-6"></span>
                  <NiceButton
                    onClick={() => Router.push(`/projects/edit/${id}`)}
                  >
                    <i className="fas fa-edit"></i>
                  </NiceButton>
                  <span className="m-3"></span>
                  <NiceButton
                    color="danger"
                    onClick={() => Router.push(`/projects/delete/${id}`)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </NiceButton>
                </>
              )}
            </div>
          </div>

          <div className="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap">
            <div className="field m-3">
              <label className="label">Industry</label>
              <div>{industry}</div>
            </div>

            <div className="field m-3">
              <label className="label">Client</label>
              <div>{client}</div>
            </div>

            <div className="field m-3">
              <label className="label">Department</label>
              <div>{department}</div>
            </div>
            <div className="field m-3">
              <label className="label">Project Manager</label>
              <div>
                {pm_fullname} ({pm})
              </div>
            </div>
            <div className="field m-3">
              <label className="label">Key Account Manager</label>
              <div>
                {kam_fullname} ({kam})
              </div>
            </div>

            <div className="field m-3">
              <label className="label">Version</label>
              <div>{version}</div>
            </div>

            <div className="field m-3">
              <label className="label">Revision</label>
              <div>{revision}</div>
            </div>
          </div>
        </div>
        {isNotKam && (
          <div className="m-5">
            <NiceButton onClick={() => router.push(`/partnumbers/new/${id}`)}>
              <i className="far fa-check-circle"></i>
              <span className="m-1"></span> Add Partnumber
            </NiceButton>
          </div>
        )}

        <Partnumbers projectId={project.id} />
        <hr />
        {isNotKam && (
          <>
            <div className="m-5">
              <NiceButton onClick={() => router.push(`/rndtasks/new/${id}`)}>
                <i className="far fa-check-circle"></i>
                <span className="m-1"></span> Add Task for R&D
              </NiceButton>
            </div>
            <Rndtasks projectId={project.id} />
            <hr />
          </>
        )}

        <div className="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap">
          <div className="field m-5">
            <label className="label">Note</label>
            <div>
              {note?.split("\n")?.map((x) => (
                <div key={x}>{x}</div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
    return (
      <div className="card ">
        {project_code === "" ? renderLoader() : renderContent()}
        {errorsJSX()}
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

export default ShowProject;
