import React, { useState, useEffect } from "react";
import { GetStaticPaths } from "next";
import Router, { useRouter } from "next/router";
import { UserPicker } from "../../../components/user-picker";
import { IUser } from "../../users";
import { Loader } from "../../../components/loader";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
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

  const [newExtraNote, setExtraNote] = useState("");
  const [newEau, setEau] = useState(0);
  const [newCustomerId, setCustomerId] = useState(0);
  const [newDistributorId, setDistributorId] = useState(0);
  const [newPmId, setPmId] = useState(0);
  const [newKamId, setKamId] = useState(0);
  const [newFinalSolutions, setFinalSolutions] = useState("");
  const [newConclusions, setConclusions] = useState("");
  const [newSamplesExpected, setSamplesExpected] = useState("");
  const [newMpExpected, setMpExpected] = useState("");
  const [newEauMax, setEauMax] = useState(0);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/rfqs/${rfqId}`,
    method: "put",
    body: {
      extra_note: newExtraNote,
      eau: newEau,
      customer_id: newCustomerId,
      distributor_id: newDistributorId,
      pm_id: newPmId,
      kam_id: newKamId,
      final_solutions: newFinalSolutions,
      conclusions: newConclusions,
      samples_expected: newSamplesExpected,
      mp_expected: newMpExpected,
      eau_max: newEauMax,
    },
    onSuccess: () => router.push(`/rfqs/${rfqId}`),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    setExtraNote(data.extra_note || "");
    setEau(data.eau);
    setCustomerId(data.customer_id);
    setDistributorId(data.distributor_id);
    setPmId(data.pm_id);
    setKamId(data.kam_id);
    setFinalSolutions(data.final_solutions || "");
    setConclusions(data.conclusions || "");
    setSamplesExpected(data.samples_expected || "");
    setMpExpected(data.mp_expected || "");
    setEauMax(data.eau_max || 0);
  };

  const getRfq = initRequest.doRequest;

  useEffect(() => {
    getRfq();
  }, []);

  if (!currentUser) {
    return <div></div>;
  }

  if (!rfq) {
    return <Loader />;
  } else {
    return (
      <div className="full-page">
        <div className="card max-w-900 m-3 big-shadow">
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <h1 className="title m-3 mb-5 is-4">
                <i className="fas fa-edit mr-1"></i> Edit {rfq.rfq_code}
              </h1>
              <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                <div className="field m-3">
                  <label className="label">Extra Note</label>
                  <input
                    className={inputStyle("extra_note")}
                    type="text"
                    value={newExtraNote}
                    autoFocus
                    onChange={(e) => setExtraNote(e.target.value)}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">EAU min</label>
                  <input
                    className={inputStyle("eau")}
                    name="eau"
                    type="number"
                    required
                    autoFocus
                    value={newEau}
                    onChange={(e) => setEau(parseInt(e.target.value))}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">EAU max</label>
                  <input
                    className={inputStyle("eau_max")}
                    name="eau_max"
                    type="number"
                    value={newEauMax}
                    onChange={(e) => setEauMax(parseInt(e.target.value))}
                  />
                </div>

                <UserPicker
                  handleChange={setCustomerId}
                  label="Customer"
                  fieldname="newCustomerId"
                  fetch="/customers"
                  initialValue={newCustomerId}
                />

                <UserPicker
                  handleChange={setDistributorId}
                  label="Distributor"
                  fieldname="newDistributorId"
                  fetch="/distributors"
                  initialValue={newDistributorId}
                />

                <UserPicker
                  handleChange={setPmId}
                  label="PM"
                  fieldname="newPmId"
                  fetch="/users"
                  initialValue={newPmId}
                />

                <UserPicker
                  handleChange={setKamId}
                  label="KAM"
                  fieldname="newKamId"
                  fetch="/users"
                  initialValue={newKamId}
                />

                <div className="field m-3">
                  <label className="label">Samples Expected</label>
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
              </div>
              <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                <div className="field m-3">
                  <label className="label">Final Solutions</label>
                  <textarea
                    className="textarea is-400"
                    name="final_solutions"
                    value={newFinalSolutions}
                    onChange={(e) => setFinalSolutions(e.target.value)}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">Conclusions</label>
                  <textarea
                    className="textarea is-400"
                    name="conclusions"
                    value={newConclusions}
                    onChange={(e) => setConclusions(e.target.value)}
                  />
                </div>
              </div>

              {errorsJSX()}
              <div className="m-3 mt-6 ">
                <NiceButton>
                  <i className="far fa-save"></i>
                  <span className="m-1"></span> Save RFQ
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

export default EditRfq;
