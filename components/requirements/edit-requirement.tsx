import React, { useState, useEffect } from "react";
import { by } from "../../utils/by";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../nice-button";
import { IRequirement } from "./requirements-table";

interface EditRequirementProps {
  id: number;
  idx: number;
  rfq_id: number;
  oldRequirement: string;
  oldPriority: number;
  oldNote: string;
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  requirementsTable: IRequirement[];
  setRequirementsTable: React.Dispatch<React.SetStateAction<IRequirement[]>>;
}

export const EditRequirement: React.FC<EditRequirementProps> = ({
  id,
  idx,
  rfq_id,
  oldRequirement,
  oldPriority,
  oldNote,
  setIsModalActive,
  requirementsTable,
  setRequirementsTable,
}) => {
  const [priority, setPriority] = useState(oldPriority);
  const [requirement, setRequirement] = useState("oldRequirement");
  const [note, setNote] = useState("oldNote");
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/requirements/${id}`,
    method: "put",
    body: {
      rfq_id,
      c_nc_cwr: "c",
      requirement,
      priority,
      note,
    },
    onSuccess: (r: IRequirement) => onSuccessAction(r, idx),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsModalActive(false);
  };

  const resetForm = () => {
    setRequirement("");
    setNote("");
  };

  const onSuccessAction = (r: IRequirement, idx: number) => {
    let newTable = [...requirementsTable];

    newTable[idx] = {
      id: r.id,
      rfq_id,
      c_nc_cwr: "c",
      requirement,
      priority,
      note,
    };

    const sortedRequirementsTable = newTable.sort(by("priority"));

    setRequirementsTable(sortedRequirementsTable);

    resetForm();
    setIsModalActive(false);
  };

  useEffect(() => {
    setRequirement(oldRequirement);
    setPriority(oldPriority);
    setNote(oldNote);
  }, [id]);

  return (
    <form onSubmit={onSubmit}>
      <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
        <div className="field m-3">
          <label className="label">order</label>
          <input
            className={inputStyle("priority")}
            name="priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
          />
        </div>
        <div className="field m-3">
          <label className="label">requirement</label>
          <textarea
            className="textarea is-400"
            required
            autoFocus
            name={requirement}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
          />
        </div>
        <div className="field m-3">
          <label className="label">note</label>
          <textarea
            className="textarea is-400"
            name={note}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={10}
          />
        </div>
      </div>

      {errorsJSX()}
      <div className="m-3 mt-6 ">
        <NiceButton>
          <i className="far fa-save"></i>
          <span className="m-1"></span> Save Requirement
        </NiceButton>
        <span className="m-3"></span>
        <NiceButton color="cancel" onClick={(event) => onCancel(event)}>
          Cancel
        </NiceButton>
      </div>
    </form>
  );
};
