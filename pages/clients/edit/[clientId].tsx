import React, { useState, useEffect } from "react";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { NiceButton } from "../../../components/nice-button";
import { Loader } from "../../../components/loader";
import { useRequest } from "../../../hooks/useRequest";
import { IClient } from "..";
import { UserPicker } from "../../../components/user-picker";

const EditClient: React.FC = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState<IClient>();

  const [newName, setName] = useState("");
  const [newKamId, setKamId] = useState(0);

  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/clients/${clientId}`,
    method: "put",
    body: {
      name: newName,
      kam_id: newKamId,
    },
    onSuccess: () => router.push(`/clients`),
  });
  const initRequest = useRequest({
    url: `/clients/${clientId}`,
    method: "get",
    onSuccess: (data: IClient) => setData(data),
  });

  const setData = (data: IClient) => {
    console.log({ data });
    setClient(data);
    setName(data.name);
    setKamId(data.kam_id);
  };

  const getClient = initRequest.doRequest;

  useEffect(() => {
    getClient();
  }, []);

  if (!client) {
    return <Loader />;
  } else {
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await doRequest();
    };

    const onCancel = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      router.push(`/clients`);
    };

    return (
      <div className="full-page">
        <div className="card max-w-800 m-3 big-shadow">
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <h1 className="title m-3 mb-5 is-4">
                <i className="fas fa-edit mr-1"></i> Edit Client
              </h1>
              <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                <div className="field m-3">
                  <label className="label">Client Name</label>
                  <input
                    className={inputStyle("name")}
                    type="text"
                    value={newName}
                    required
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <UserPicker
                  handleChange={setKamId}
                  label="KAM"
                  fieldname="newKamId"
                  fetch="/users"
                  initialValue={newKamId}
                />
              </div>

              {errorsJSX()}
              <div className="m-3 mt-6 ">
                <NiceButton>
                  <i className="far fa-save"></i>
                  <span className="m-1"></span> Save Client
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

export default EditClient;
