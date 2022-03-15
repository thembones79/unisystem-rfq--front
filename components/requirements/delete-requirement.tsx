import React from "react";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../nice-button";
import { IRequirement } from "./requirements-table";

interface DeleteRequirementProps {
  id: number;
  idx: number;
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  requirementsTable: IRequirement[];
  setRequirementsTable: React.Dispatch<React.SetStateAction<IRequirement[]>>;
}

export const DeleteRequirement: React.FC<DeleteRequirementProps> = ({
  id,
  idx,
  setIsModalActive,
  requirementsTable,
  setRequirementsTable,
}) => {
  const { doRequest, errorsJSX } = useRequest({
    url: `/requirements/${id}`,
    method: "delete",
    onSuccess: () => onSuccessAction(),
  });

  const deleteReq = async () => {
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsModalActive(false);
  };

  const onSuccessAction = () => {
    let newTable = [...requirementsTable];
    newTable.splice(idx, 1);
    setRequirementsTable([...newTable]);
    setIsModalActive(false);
  };

  return (
    <div>
      <div className="m-3">
        <div>
          You are going to <b>delete</b> this requirement!
        </div>
        <div> Are you really sure you want to do this?</div>
      </div>
      <div className="m-3 mt-6 ">
        <NiceButton color="danger" onClick={() => deleteReq()}>
          <i className="far fa-trash-alt"></i>
          <span className="m-1"></span> Delete Requirement
        </NiceButton>
        <span className="m-3"></span>
        <NiceButton color="cancel" onClick={(event) => onCancel(event)}>
          Cancel
        </NiceButton>
      </div>
      {errorsJSX()}
    </div>
  );
};
