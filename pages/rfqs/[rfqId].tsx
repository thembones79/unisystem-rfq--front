import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { Loader } from "../../components/loader";
import { IUser } from "../users";
import { IRfq } from ".";
import { RequirementsTable } from "../../components/requirements/requirements-table";
import { SharePointLogo } from "../../icons/sharepoint-logo";

interface IRfqWithNames extends IRfq {
  pm_fullname: string;
  kam_fullname: string;
  clickup_id: string;
  status: string;
  final_solutions: string;
  conclusions: string;
  samples_expected: string;
  mp_expected: string;
  eau_max: number;
}

interface ShowRfqProps {
  rfq: IRfqWithNames;
  currentUser: IUser;
}

const ShowRfq: React.FC = () => {
  const router = useRouter();
  const rfqId = router.query.rfqId;
  const [rfq, setRfq] = useState<IRfqWithNames>({
    id: 1,
    rfq_code: "LOADING",
    extra_note: "ppp",
    eau: 5,
    customer: "pupa",
    distributor: "pupa",
    pm: "pupa",
    kam: "pupa",
    updated: "pupa",
    pm_fullname: "string",
    kam_fullname: "pupa",
    clickup_id: "pupa",
    status: "pupa",
    final_solutions: "pupa",
    conclusions: "pupa",
    samples_expected: "pupa",
    mp_expected: "pupa",
    eau_max: 6,
  });

  const { doRequest, errorsJSX } = useRequest({
    url: `/rfqs/${rfqId}`,
    method: "get",
    onSuccess: (data: IRfqWithNames) => setRfq(data),
  });

  if (!rfq) {
    return <h1>RFQ not found</h1>;
  } else {
    const {
      rfq_code,
      extra_note,
      eau,
      customer,
      clickup_id,
      status,
      distributor,
      pm,
      kam,
      id,
      kam_fullname,
      pm_fullname,
      final_solutions,
      conclusions,
      samples_expected,
      mp_expected,
      eau_max,
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
              <h1 className="title my-3 is-4">
                {rfq_code} {extra_note}
              </h1>{" "}
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
                {status}
              </button>
            </div>

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
              <label className="label">EAU min</label>
              <div>{eau}</div>
            </div>

            <div className="field m-3">
              <label className="label">EAU max</label>
              <div>{eau_max}</div>
            </div>

            <div className="field m-3">
              <label className="label">Customer</label>
              <div>{customer}</div>
            </div>
            <div className="field m-3">
              <label className="label">Distributor</label>
              <div>{distributor}</div>
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

        <RequirementsTable rfq_id={id} />
        <div className="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap">
          <div className="field m-5">
            <label className="label">Final Solutions</label>
            <div>{final_solutions}</div>
          </div>

          <div className="field m-5">
            <label className="label">Conclusions</label>
            <div>{conclusions}</div>
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

export default ShowRfq;
