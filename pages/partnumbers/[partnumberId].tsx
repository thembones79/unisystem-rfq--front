import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import React, { useEffect, useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { Loader } from "../../components/loader";
import { IUser } from "../users";
import { IPartnumber } from ".";
import { spPath } from "../../utils/sp-path";
import { RequirementsTable } from "../../components/requirements/requirements-table";
import { SharePointLogo } from "../../icons/sharepoint-logo";

export interface IPartnumberWithNames extends IPartnumber {
  version: string;
  revision: string;
  note: string;
  pm_fullname: string;
  kam_fullname: string;
  kam_folder: string;
}

interface ShowPartnumberProps {
  currentUser: IUser;
}

const ShowPartnumber: React.FC<ShowPartnumberProps> = ({ currentUser }) => {
  const router = useRouter();
  const { partnumberId } = router.query;
  const [partnumber, setPartnumber] = useState<IPartnumberWithNames>({
    id: 0,
    project_id: 0,
    pn: "",
    project: "",
    department: "",
    client: "",
    industry: "",
    pm: "",
    kam: "",
    kam_folder: "",
    updated: "",
    pm_fullname: "",
    kam_fullname: "",
    version: "",
    revision: "",
    note: "",
  });

  const isNotKam = currentUser?.role_id < 3;

  const { doRequest, errorsJSX } = useRequest({
    url: `/partnumbers/${partnumberId}`,
    method: "get",
    onSuccess: (data: IPartnumberWithNames) => setPartnumber(data),
  });

  if (!partnumber) {
    return <h1>Partnumber not found</h1>;
  } else {
    const {
      id,
      pn,
      project,
      project_id,
      department,
      client,
      industry,
      pm,
      kam,
      kam_folder,
      pm_fullname,
      kam_fullname,
      version,
      revision,
      note,
    } = partnumber;

    const renderLoader = () => (
      <div className="card-content">
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
          <Loader />
        </div>
      </div>
    );

    const renderContent = () => (
      <>
        <div className="card-content">
          <div className="mb-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
            <div className="is-flex is-flex-wrap-wrap">
              <h1 className="title my-3 is-4">{pn}</h1>
              <span className="m-3 "></span>
            </div>

            <div className="my-3 ">
              <span className="m-3 mr-6"></span>
              <NiceButton
                onClick={() => Router.push(`/projects/${project_id}`)}
              >
                <i className="fas fa-chevron-left"></i>
                <span className="m-2"></span>
                <span>
                  go to <b>{project}</b>
                </span>
              </NiceButton>
              <span className="mx-5"></span>
              <span className="m-3 mr-6"></span>
              <span className="m-3">
                <button
                  className="button is-link is-inverted"
                  onClick={() => {
                    const path = spPath({ department, kam_folder });
                    const win = window.open(
                      `${path}/${client}/${project}/${pn}`,
                      "_blank"
                    );
                    if (win) {
                      win.focus();
                    }
                  }}
                >
                  <SharePointLogo />
                </button>
              </span>

              {isNotKam && (
                <>
                  <span className="m-3"></span>
                  <NiceButton
                    onClick={() => Router.push(`/partnumbers/edit/${id}`)}
                  >
                    <i className="fas fa-edit"></i>
                  </NiceButton>
                  <span className="m-3"></span>
                  <NiceButton
                    color="danger"
                    onClick={() => Router.push(`/partnumbers/delete/${id}`)}
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
              <label className="label">Revision</label>
              <div>{revision}</div>
            </div>
          </div>
        </div>

        <div className="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap">
          <div className="field m-5">
            <label className="label">Note</label>
            <div>{note}</div>
          </div>
        </div>
      </>
    );

    useEffect(() => {
      doRequest();
    }, []);

    return (
      <div className="card ">
        {pn === "" ? renderLoader() : renderContent()}
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

export default ShowPartnumber;
