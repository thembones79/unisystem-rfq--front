import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { IIndustry } from "..";
import { Loader } from "../../../components/loader";

const DeleteIndustry: React.FC = () => {
  const router = useRouter();
  const { industryId } = router.query;
  const { doRequest, errorsJSX } = useRequest({
    url: `/industries/${industryId}`,
    method: "delete",
    onSuccess: () => router.push(`/industries`),
  });

  useEffect(() => {
    getIndustry();
  }, []);

  const initRequest = useRequest({
    url: `/industries/${industryId}`,
    method: "get",
    onSuccess: (data: IIndustry) => setData(data),
  });
  const getIndustry = initRequest.doRequest;
  const [industry, setIndustry] = useState<IIndustry>();

  const setData = (data: IIndustry) => {
    setIndustry(data);
  };

  if (!industry) {
    return <Loader />;
  } else {
    const { name } = industry;

    const deleteIndustry = () => {
      doRequest();
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
                  You are going to <b>delete</b> this Industry!
                </div>
                <div> Are you really sure you want to do this?</div>
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton color="danger" onClick={deleteIndustry}>
                <i className="far fa-trash-alt"></i>
                <span className="m-1"></span> Yes, I'm 100% sure. Delete this
                industry
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton
                color="cancel"
                onClick={() => router.push(`/industries`)}
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

export default DeleteIndustry;
