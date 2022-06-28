import React, { useState, useEffect } from "react";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { IUser } from "../../users";
import { Loader } from "../../../components/loader";
import { NiceButton } from "../../../components/nice-button";
import { Toggle } from "../../../components/toggle";
import { DataList } from "../../../components/data-list";
import { useRequest } from "../../../hooks/useRequest";
import {
  sizeOptions,
  dispTechOptions,
  resolutionOptions,
  anglesOptions,
  dispInterfaceOptions,
  tpInterfaceOptions,
  tpTechOptions,
  tpSizeOptions,
} from "../../../utils/datalists-options";
import { IRfq } from "../";

interface IRfqWithIds extends IRfq {
  customer_id: number;
  distributor_id: number;
  pm_id: number;
  kam_id: number;
  final_solutions: string;
  conclusions: string;
  samples_expected: string;
  mp_expected: string;
  eau_max: number;
}

interface EditRfqProps {
  currentUser: IUser;
}

const EditRfq = ({ currentUser }: EditRfqProps) => {
  const [rfq, setRfq] = useState<IRfqWithIds>();
  const router = useRouter();
  const { rfqId } = router.query;

  const [newEau, setEau] = useState(0);
  const [newForValuation, setForValuation] = useState(false);
  const [newSamplesExpected, setSamplesExpected] = useState("");
  const [newMpExpected, setMpExpected] = useState("");
  const [newName, setName] = useState("");
  const [newReqDispTech, setReqDispTech] = useState("");
  const [newReqDispSize, setReqDispSize] = useState("");
  const [newReqDispRes, setReqDispRes] = useState("");
  const [newReqDispBrigt, setReqDispBrigt] = useState("");
  const [newReqDispAngle, setReqDispAngle] = useState("");
  const [newReqDispOd, setReqDispOd] = useState("");
  const [newReqDispAa, setReqDispAa] = useState("");
  const [newReqDispInter, setReqDispInter] = useState("");
  const [newReqDispOt, setReqDispOt] = useState("");
  const [newReqDispSt, setReqDispSt] = useState("");
  const [newReqDispSpec, setReqDispSpec] = useState("");
  const [newReqTpSize, setReqTpSize] = useState("");
  const [newReqTpAa, setReqTpAa] = useState("");
  const [newReqTpTech, setReqTpTech] = useState("");
  const [newReqTpOd, setReqTpOd] = useState("");
  const [newReqTpInter, setReqTpInter] = useState("");
  const [newReqTpGlass, setReqTpGlass] = useState("");
  const [newReqTpSpec, setReqTpSpec] = useState("");
  const [newReqOthers, setReqOthers] = useState("");
  const [newPmId, setPmId] = useState(0);
  const [newFinalSolutions, setFinalSolutions] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/rfqs/${rfqId}`,
    method: "put",
    body: {
      eau: newEau,
      for_valuation: newForValuation,
      pm_id: newPmId,
      final_solutions: newFinalSolutions,
      samples_expected: newSamplesExpected,
      mp_expected: newMpExpected,
      name: newName,
      req_disp_tech: newReqDispTech,
      req_disp_size: newReqDispSize,
      req_disp_res: newReqDispRes,
      req_disp_brigt: newReqDispBrigt,
      req_disp_angle: newReqDispAngle,
      req_disp_od: newReqDispOd,
      req_disp_aa: newReqDispAa,
      req_disp_inter: newReqDispInter,
      req_disp_ot: newReqDispOt,
      req_disp_st: newReqDispSt,
      req_disp_spec: newReqDispSpec,
      req_tp_size: newReqTpSize,
      req_tp_aa: newReqTpAa,
      req_tp_tech: newReqTpTech,
      req_tp_od: newReqTpOd,
      req_tp_inter: newReqTpInter,
      req_tp_glass: newReqTpGlass,
      req_tp_spec: newReqTpSpec,
      req_others: newReqOthers,
    },
    onSuccess: () => router.push(`/rfqs/${rfqId}`),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    router.push(`/rfqs/${rfqId}`);
  };

  const initRequest = useRequest({
    url: `/rfqs/${rfqId}`,
    method: "get",
    onSuccess: (data: IRfqWithIds) => setData(data),
  });

  const setData = (data: IRfqWithIds) => {
    setRfq(data);
    setEau(data.eau);
    setForValuation(data.for_valuation || false);
    setPmId(data.pm_id);
    setFinalSolutions(data.final_solutions || "");
    setSamplesExpected(data.samples_expected || "");
    setMpExpected(data.mp_expected || "");
    setName(data.name || "");
    setReqDispTech(data.req_disp_tech || "");
    setReqDispSize(data.req_disp_size || "");
    setReqDispRes(data.req_disp_res || "");
    setReqDispBrigt(data.req_disp_brigt || "");
    setReqDispAngle(data.req_disp_angle || "");
    setReqDispOd(data.req_disp_od || "");
    setReqDispAa(data.req_disp_aa || "");
    setReqDispInter(data.req_disp_inter || "");
    setReqDispOt(data.req_disp_ot || "");
    setReqDispSt(data.req_disp_st || "");
    setReqDispSpec(data.req_disp_spec || "");
    setReqTpSize(data.req_tp_size || "");
    setReqTpAa(data.req_tp_aa || "");
    setReqTpTech(data.req_tp_tech || "");
    setReqTpOd(data.req_tp_od || "");
    setReqTpInter(data.req_tp_inter || "");
    setReqTpGlass(data.req_tp_glass || "");
    setReqTpSpec(data.req_tp_spec || "");
    setReqOthers(data.req_others || "");
  };

  const getRfq = initRequest.doRequest;

  useEffect(() => {
    getRfq();
  }, []);

  if (!currentUser) {
    return <div></div>;
  }

  const renderContent = () => (
    <form onSubmit={onSubmit}>
      <h1 className="title m-3 mb-5 is-4">
        <i className="fas fa-edit mr-1"></i> Edit {rfq?.rfq_code} {newName}
      </h1>

      <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
        <div className="field m-3">
          <label className="label">Name</label>
          <input
            className={inputStyle("extra_note")}
            type="text"
            value={newName}
            required
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field m-3">
          <label className="label">EAU</label>
          <input
            className={inputStyle("eau")}
            name="eau"
            type="number"
            required
            value={newEau}
            onChange={(e) => setEau(parseInt(e.target.value))}
          />
        </div>

        <div className="field m-3">
          <label className="label">Number of Samples</label>
          <input
            className={inputStyle("samples_expected")}
            type="text"
            value={newSamplesExpected}
            onChange={(e) => setSamplesExpected(e.target.value)}
          />
        </div>

        <div className="field m-3">
          <label className="label">MP Expected</label>
          <input
            className={inputStyle("mp_expected")}
            type="text"
            value={newMpExpected}
            onChange={(e) => setMpExpected(e.target.value)}
          />
        </div>

        <Toggle
          handleChange={setForValuation}
          label="For Valuation"
          fieldname="for_valuation"
          initialValue={newForValuation}
        />
      </div>

      <article className=" m-3">
        <div className="panel-block">Display</div>

        <div className="panel-block is-flex-wrap-wrap">
          <DataList
            options={dispTechOptions}
            value={newReqDispTech}
            className={inputStyle("req_disp_tech")}
            onChange={setReqDispTech}
            label="Technology"
            fieldname="setReqDispTech"
          />
          <DataList
            options={sizeOptions}
            value={newReqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size (inches)"
            fieldname="reqDispSize"
          />
          <DataList
            options={resolutionOptions}
            value={newReqDispRes}
            className={inputStyle("req_disp_res")}
            onChange={setReqDispRes}
            label="Resolution"
            fieldname="reqDispRes"
          />
          <DataList
            options={[]}
            value={newReqDispBrigt}
            className={inputStyle("req_disp_brigt")}
            onChange={setReqDispBrigt}
            label="Brightness (cd/m2)"
            fieldname="setReqDispBrigt"
          />
          <DataList
            options={anglesOptions}
            value={newReqDispAngle}
            className={inputStyle("req_disp_angle")}
            onChange={setReqDispAngle}
            label="Angle"
            fieldname="reqDispAngle"
          />
          <DataList
            options={dispInterfaceOptions}
            value={newReqDispInter}
            className={inputStyle("req_disp_inter")}
            onChange={setReqDispInter}
            label="Interface"
            fieldname="reqDispInter"
          />
          <DataList
            options={[]}
            value={newReqDispAa}
            className={inputStyle("req_disp_aa")}
            onChange={setReqDispAa}
            label="Active Area (mm)"
            fieldname="reqDispAa"
          />
          <DataList
            options={[]}
            value={newReqDispOd}
            className={inputStyle("req_disp_od")}
            onChange={setReqDispOd}
            label="Outline Dimensions (mm)"
            fieldname="reqDispOd"
          />
          <DataList
            options={[]}
            value={newReqDispOt}
            className={inputStyle("req_disp_ot")}
            onChange={setReqDispOt}
            label="Oper. Temp. (℃)"
            fieldname="reqDispOt"
          />
          <DataList
            options={[]}
            value={newReqDispSt}
            className={inputStyle("req_disp_st")}
            onChange={setReqDispSt}
            label="Stor. Temp. (℃)"
            fieldname="reqDispSt"
          />
          <div className="field m-3">
            <label className="label is-small">
              Special requirements (if any)
            </label>
            <textarea
              className="input is-400"
              name="req_disp_spec"
              value={newReqDispSpec}
              onChange={(e) => setReqDispSpec(e.target.value)}
            />
          </div>
        </div>
      </article>

      <article className=" m-3">
        <div className="panel-block">Touch</div>

        <div className="panel-block is-flex-wrap-wrap">
          <DataList
            options={tpTechOptions}
            value={newReqTpTech}
            className={inputStyle("req_tp_tech")}
            onChange={setReqTpTech}
            label="Technology"
            fieldname="reqTpTech"
          />
          <DataList
            options={tpSizeOptions}
            value={newReqTpSize}
            className={inputStyle("req_tp_size")}
            onChange={setReqTpSize}
            label="Size (inches)"
            fieldname="reqTpSize"
          />
          <DataList
            options={tpInterfaceOptions}
            value={newReqTpInter}
            className={inputStyle("req_to_inter")}
            onChange={setReqTpInter}
            label="Interface"
            fieldname="reqTpInter"
          />
          <DataList
            options={[]}
            value={newReqTpGlass}
            className={inputStyle("req_tp_glass")}
            onChange={setReqTpGlass}
            label="Cover glass thickness"
            fieldname="reqTpGlass"
          />
          <DataList
            options={[]}
            value={newReqTpAa}
            className={inputStyle("req_tp_aa")}
            onChange={setReqTpAa}
            label="Active Area (mm)"
            fieldname="reqTpAa"
          />
          <DataList
            options={[]}
            value={newReqTpOd}
            className={inputStyle("req_tp_od")}
            onChange={setReqTpOd}
            label="Outline Dimensions (mm)"
            fieldname="reqTpOd"
          />

          <div className="field m-3">
            <label className="label is-small">
              Special requirements (if any)
            </label>
            <textarea
              className="input is-400"
              name="req_tp_spec"
              value={newReqTpSpec}
              onChange={(e) => setReqTpSpec(e.target.value)}
            />
          </div>
        </div>
      </article>

      <article className=" m-3">
        <div className="panel-block">Others</div>
        <div className="field m-3">
          <label className="label is-small">
            Other devices (eg.: Industrial Computers, etc.) OR just commentary
            for an engineer...
          </label>
          <textarea
            className="input h-70"
            name="conclusions"
            value={newReqOthers}
            onChange={(e) => setReqOthers(e.target.value)}
          />
        </div>
      </article>
      <article className=" m-3">
        <div className="panel-block mt-5"></div>
        <div className="field m-3 mt-6">
          <label className="label"> 💪 Final Solutions</label>
          <textarea
            className="input h-70"
            name="conclusions"
            value={newFinalSolutions}
            onChange={(e) => setFinalSolutions(e.target.value)}
          />
        </div>
      </article>

      <div className="m-3 mt-6 ">
        <NiceButton>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> Save RFQ
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
      <p className="title is-4 mb-6 mt-3 mx-6">Please Wait...</p>

      <Loader />
    </div>
  );

  if (!rfq) {
    return <Loader />;
  } else {
    return (
      <div className="full-page full-page--top">
        <div className="card  m-3 big-shadow">
          <div className="card-content">
            {isLoading ? renderLoader() : renderContent()}

            {errorsJSX()}
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

export default EditRfq;
