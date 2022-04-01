import React, { useState, useEffect } from "react";
import { GetStaticPaths } from "next";
import Router, { useRouter } from "next/router";
import { UserPicker } from "../../../components/user-picker";
import { IUser } from "../../users";
import { Loader } from "../../../components/loader";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { IProject } from "..";

interface IProjectWithIds extends IProject {
  pm_id: number;
  note: string;
  version: string;
  revision: string;
}

interface EditProjectProps {
  currentUser: IUser;
}

const EditProject = ({ currentUser }: EditProjectProps) => {
  const [project, setProject] = useState<IProjectWithIds>();
  const router = useRouter();
  const { projectId } = router.query;
  const [newNote, setNote] = useState("");
  const [newVersion, setVersion] = useState("");
  const [newRevision, setRevision] = useState("");
  const [newPmId, setPmId] = useState(0);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/projects/${projectId}`,
    method: "put",
    body: {
      id: projectId,
      pm_id: newPmId,
      note: newNote,
      version: newVersion,
      revision: newRevision,
    },
    onSuccess: () => router.push(`/projects/${projectId}`),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    router.push(`/projects/${projectId}`);
  };

  const initRequest = useRequest({
    url: `/projects/${projectId}`,
    method: "get",
    onSuccess: (data: IProjectWithIds) => setData(data),
  });

  const setData = (data: IProjectWithIds) => {
    setProject(data);
    setPmId(data.pm_id);
    setNote(data.note);
    setVersion(data.version);
    setRevision(data.revision);
  };

  const getProject = initRequest.doRequest;

  useEffect(() => {
    getProject();
  }, []);

  if (!currentUser) {
    return <div></div>;
  }

  if (!project) {
    return <Loader />;
  } else {
    return (
      <div className="full-page">
        <div className="card max-w-900 m-3 big-shadow">
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <h1 className="title m-3 mb-5 is-4">
                <i className="fas fa-edit mr-1"></i> Edit {project.project_code}
              </h1>
              <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                <UserPicker
                  handleChange={setPmId}
                  label="PM"
                  fieldname="newPmId"
                  fetch="/users"
                  initialValue={newPmId}
                />

                <div className="field m-3">
                  <label className="label">Version</label>
                  <input
                    className={inputStyle("version")}
                    type="text"
                    value={newVersion}
                    onChange={(e) => setVersion(e.target.value)}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">Revision</label>
                  <input
                    className={inputStyle("revision")}
                    type="text"
                    value={newRevision}
                    onChange={(e) => setRevision(e.target.value)}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">Note</label>
                  <textarea
                    className="textarea is-400"
                    name="note"
                    value={newNote}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              {errorsJSX()}
              <div className="m-3 mt-6 ">
                <NiceButton>
                  <i className="far fa-save"></i>
                  <span className="m-1"></span> Save Project
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

export default EditProject;
