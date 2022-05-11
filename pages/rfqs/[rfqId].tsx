import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import React, { useEffect, useState, memo, useCallback } from "react";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { Loader } from "../../components/loader";
import { IUser } from "../users";
import { MiniTable } from "../../components/mini-table";
import { IRfq } from ".";
import { RequirementsTable } from "../../components/requirements/requirements-table";
import { SharePointLogo } from "../../icons/sharepoint-logo";

interface IRfqWithNames extends IRfq {
  pm_fullname: string;
  kam_fullname: string;
  clickup_id: string;
  status: string;
  final_solutions: string;
  project_id: number;
  project_code: string;
  samples_expected: string;
  mp_expected: string;
  department: string;
}

const ShowRfq: React.FC = () => {
  const router = useRouter();
  const { rfqId } = router.query;
  const [rfq, setRfq] = useState<IRfqWithNames>({
    id: 0,
    rfq_code: "LOADING",
    extra_note: "",
    eau: 0,
    customer: "",
    pm: "",
    kam: "",
    updated: "",
    pm_fullname: "",
    kam_fullname: "",
    clickup_id: "",
    project_id: 0,
    project_code: "",
    status: "",
    final_solutions: "",
    samples_expected: "",
    mp_expected: "",
    department: "",
    for_valuation: false,
    name: "",
    req_disp_tech: "",
    req_disp_size: "",
    req_disp_res: "",
    req_disp_brigt: "",
    req_disp_angle: "",
    req_disp_od: "",
    req_disp_aa: "",
    req_disp_inter: "",
    req_disp_ot: "",
    req_disp_st: "",
    req_disp_spec: "",
    req_tp_size: "",
    req_tp_aa: "",
    req_tp_tech: "",
    req_tp_od: "",
    req_tp_inter: "",
    req_tp_glass: "",
    req_tp_spec: "",
    req_others: "",
  });

  const id = rfqId;

  const { doRequest, errorsJSX } = useRequest({
    url: `/rfqs/${id}`,
    method: "get",
    onSuccess: (data: IRfqWithNames) => onSuccess(data),
  });

  const onSuccess = useCallback(
    (data: IRfqWithNames) => {
      setRfq(data);
    },
    [rfq]
  );

  if (!rfq) {
    return <h1>RFQ not found</h1>;
  } else {
    const {
      rfq_code,
      name,
      eau,
      customer,
      clickup_id,
      status,
      pm,
      kam,
      id,
      kam_fullname,
      project_id,
      project_code,
      pm_fullname,
      final_solutions,
      samples_expected,
      mp_expected,
      department,
      req_disp_tech,
      req_disp_size,
      req_disp_res,
      req_disp_brigt,
      req_disp_angle,
      req_disp_od,
      req_disp_aa,
      req_disp_inter,
      req_disp_ot,
      req_disp_st,
      req_disp_spec,
      req_tp_size,
      req_tp_aa,
      req_tp_tech,
      req_tp_od,
      req_tp_inter,
      req_tp_glass,
      req_tp_spec,
      req_others,
    } = rfq;

    const formatStatus = () => {
      if (status === "awaiting customer feedback") {
        return "is-warning";
      } else if (status === "complete") {
        return "is-success";
      } else {
        return "is-link";
      }
    };

    const renderStatus = () => {
      return (
        status !== "privates" && (
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
        )
      );
    };

    const displaySpecs = {
      Technology: req_disp_tech,
      "Size (inches)": req_disp_size,
      Resolution: req_disp_res,
      "Brightness (cd/m2)": req_disp_brigt,
      Angle: req_disp_angle,
      Interface: req_disp_inter,
      "Active Area (mm)": req_disp_aa,
      "Outline Dimensions (mm)": req_disp_od,
      "Oper. Temp. (℃)": req_disp_ot,
      "Stor. Temp. (℃)": req_disp_st,
      "Special requirements": req_disp_spec,
    };
    const touchSpecs = {
      Technology: req_tp_tech,
      "Size (inches)": req_tp_size,
      Interface: req_tp_inter,
      "Cover glass thickness": req_tp_glass,
      "Active Area (mm)": req_tp_aa,
      "Outline Dimensions (mm)": req_tp_od,
      "Special requirements": req_tp_spec,
    };

    const renderOtherReqs = () => {
      return req_others ? (
        <table className="table is-narrow is-size-7 mx-6 mb-6 is-striped mt-2">
          <thead>
            <tr>
              <th>OTHERS ...or just commentary for an engineer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{req_others}</td>
            </tr>
          </tbody>
        </table>
      ) : null;
    };

    const renderLoader = () => (
      <div className="card-content">
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
          <Loader />
        </div>
      </div>
    );

    const renderProjectLinkOrButton = () => {
      if (project_id) {
        return (
          <button
            className={`button is-success is-light m-4`}
            onClick={() => Router.push(`/projects/${project_id}`)}
          >
            <span className="m-2 ">go to project: </span> <b>{project_code}</b>
          </button>
        );
      } else {
        return (
          <NiceButton onClick={() => Router.push(`/projects/new/${id}`)}>
            <i className="fas fa-plus"></i>
            <span className="m-2 "></span>
            <span>create project from this RFQ</span>
          </NiceButton>
        );
      }
    };

    const renderContent = () => (
      <>
        <div className="card-content">
          <div className="mb-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
            <div className="is-flex is-flex-wrap-wrap">
              <h1 className="title my-3 is-4">
                {rfq_code} {name}
              </h1>
              <span className="m-3 "></span>
              {renderStatus()}
            </div>
            {renderProjectLinkOrButton()}

            <div className="my-3 ">
              <button
                className="button is-link is-inverted"
                onClick={() => {
                  const win = window.open(
                    `https://riverdi.sharepoint.com/sites/ProjectsManagementGroup/Shared Documents/RIVERDI PROJECTS/${kam}_!PROSPECTS/${rfq_code}`,
                    "_blank"
                  );
                  if (win) {
                    win.focus();
                  }
                }}
              >
                <SharePointLogo />
              </button>

              <span className="m-3 mr-6"></span>
              <NiceButton onClick={() => Router.push(`/rfqs/edit/${id}`)}>
                <i className="fas fa-edit"></i>
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton
                color="danger"
                onClick={() => Router.push(`/rfqs/delete/${id}`)}
              >
                <i className="fas fa-trash-alt"></i>
              </NiceButton>
            </div>
          </div>

          <div className="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap">
            <div className="field m-3">
              <label className="label">EAU</label>
              <div>{eau}</div>
            </div>

            <div className="field m-3">
              <label className="label">Customer</label>
              <div>{customer}</div>
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
              <label className="label">Samples Expected</label>
              <div>{samples_expected}</div>
            </div>

            <div className="field m-3">
              <label className="label">MP Expected</label>
              <div>{mp_expected}</div>
            </div>
          </div>
        </div>

        <div className="columns">
          <MiniTable label="DISPLAY" dataObject={displaySpecs} />
          <MiniTable label="TOUCH" dataObject={touchSpecs} />
          <>{renderOtherReqs()}</>
        </div>

        <RequirementsTable rfq_id={id} />
        <div className="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap">
          <div className="field m-5">
            <label className="label">Final Solutions</label>
            <div>{final_solutions}</div>
          </div>
        </div>
      </>
    );

    useEffect(() => {
      doRequest();
    }, []);

    return (
      <div className="card ">
        {rfq_code === "LOADING" ? renderLoader() : renderContent()}
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

export default memo(ShowRfq);
