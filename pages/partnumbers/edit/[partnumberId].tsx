import React, { useState, useEffect } from "react";
import { GetStaticPaths } from "next";
import Router, { useRouter } from "next/router";
import { UserPicker } from "../../../components/user-picker";
import { IUser } from "../../users";
import { Loader } from "../../../components/loader";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { IPartnumberWithNames } from "../[partnumberId]";

interface EditPartnumberProps {
  currentUser: IUser;
}

const EditPartnumber = ({ currentUser }: EditPartnumberProps) => {
  const [partnumber, setPartnumber] = useState<IPartnumberWithNames>();
  const router = useRouter();
  const { partnumberId } = router.query;
  const [newNote, setNote] = useState("");
  const [newVersion, setVersion] = useState("");
  const [newRevision, setRevision] = useState("");
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/partnumbers/${partnumberId}`,
    method: "put",
    body: {
      note: newNote,
      version: newVersion,
      revision: newRevision,
    },
    onSuccess: () => router.push(`/partnumbers/${partnumberId}`),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    router.push(`/partnumbers/${partnumberId}`);
  };

  const initRequest = useRequest({
    url: `/partnumbers/${partnumberId}`,
    method: "get",
    onSuccess: (data: IPartnumberWithNames) => setData(data),
  });

  const setData = (data: IPartnumberWithNames) => {
    setPartnumber(data);
    setNote(data.note);
    setVersion(data.version);
    setRevision(data.revision);
  };

  const getPartnumber = initRequest.doRequest;

  useEffect(() => {
    getPartnumber();
  }, []);

  if (!currentUser) {
    return <div></div>;
  }

  if (!partnumber) {
    return <Loader />;
  } else {
    return (
      <div className="full-page">
        <div className="card max-w-900 m-3 big-shadow">
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <h1 className="title m-3 mb-5 is-4">
                <i className="fas fa-edit mr-1"></i> Edit {partnumber.pn}
              </h1>
              <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
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
                  <span className="m-1"></span> Save Partnumber
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

export default EditPartnumber;
