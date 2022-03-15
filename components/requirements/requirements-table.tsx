import React, { useState, useEffect } from "react";
import { useRequest } from "../../hooks/useRequest";
import { Modal } from "../modal";
import { NewRequirement } from "./new-requirement";
import { EditRequirement } from "./edit-requirement";
import { NiceButton } from "../nice-button";
import { DeleteRequirement } from "./delete-requirement";

export interface IRequirement {
  id: number;
  rfq_id: number;
  c_nc_cwr: string;
  requirement: string;
  note: string;
  priority: number;
}

export interface RequirementsTableProps {
  rfq_id: number;
}

interface IHandleEditReq extends IRequirement {
  idx: number;
}

interface IHandleDeleteReq {
  id: number;
  idx: number;
}

export const RequirementsTable: React.FC<RequirementsTableProps> = ({
  rfq_id,
}) => {
  const [isModalActive, setIsModalActive] = useState(false);

  const [requirementsTable, setRequirementsTable] = useState<IRequirement[]>(
    []
  );

  const [modalBody, setModalBody] = useState(
    <NewRequirement
      rfq_id={rfq_id}
      setIsModalActive={setIsModalActive}
      requirementsTable={requirementsTable}
      setRequirementsTable={setRequirementsTable}
    />
  );

  const [modalTitle, setModalTitle] = useState("");

  const { doRequest, errorsJSX } = useRequest({
    url: `/rfqs/${rfq_id}/requirements`,
    method: "get",
    onSuccess: (requirements: IRequirement[]) =>
      setRequirementsTable(requirements),
  });

  const renderTableHeader = () => {
    if (requirementsTable.length > 0) {
      const columns = ["priority", "requirement", "note", ""];
      return columns.map((column) => {
        return (
          <th className={column === "" ? "is-120" : "p-2"} key={column}>
            {column}
          </th>
        );
      });
    }
  };

  const renderTableBody = () => {
    return requirementsTable.map((r, idx) => {
      const { c_nc_cwr, requirement, note, id, priority } = r;
      return (
        <tr key={id}>
          <td className="p-2">{priority}</td>
          <td className="p-2">{requirement}</td>
          <td className="p-2">{note}</td>
          <td className="is-120 p-2">
            <button
              onClick={() => {
                handleEditReq({
                  c_nc_cwr,
                  requirement,
                  note,
                  id,
                  idx,
                  rfq_id,
                  priority,
                });
              }}
              className="button is-link is-inverted is-rounded is-small mx-1 p-3"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => {
                handleDeleteReq({ id, idx });
              }}
              className="button is-danger is-inverted  is-rounded is-small mx-1 p-3"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      );
    });
  };

  const handleEditReq = ({
    requirement,
    note,
    id,
    idx,
    rfq_id,
    priority,
  }: IHandleEditReq) => {
    setModalBody(
      <EditRequirement
        rfq_id={rfq_id}
        setIsModalActive={setIsModalActive}
        requirementsTable={requirementsTable}
        setRequirementsTable={setRequirementsTable}
        id={id}
        idx={idx}
        oldRequirement={requirement}
        oldNote={note}
        oldPriority={priority}
      />
    );

    setModalTitle("Edit Requirement");

    setIsModalActive(true);
  };

  const handleNewReq = () => {
    setModalBody(
      <NewRequirement
        rfq_id={rfq_id}
        setIsModalActive={setIsModalActive}
        requirementsTable={requirementsTable}
        setRequirementsTable={setRequirementsTable}
      />
    );

    setModalTitle("New Requirement");

    setIsModalActive(true);
  };

  const handleDeleteReq = ({ id, idx }: IHandleDeleteReq) => {
    setModalBody(
      <DeleteRequirement
        setIsModalActive={setIsModalActive}
        requirementsTable={requirementsTable}
        setRequirementsTable={setRequirementsTable}
        id={id}
        idx={idx}
      />
    );

    setModalTitle("Delete Requirement");

    setIsModalActive(true);
  };

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="table-container">
      <div className="mx-5 mt-2 mb-5">
        <NiceButton onClick={handleNewReq}>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> New Requirement
        </NiceButton>

        <table className="table is-narrow is-striped is-hoverable is-fullwidth is-size-7 mt-5">
          <thead>
            <tr>{renderTableHeader()}</tr>
          </thead>
          <tbody className="fixed200 ">{renderTableBody()}</tbody>
        </table>
      </div>

      {errorsJSX()}
      <Modal
        modalTitle={modalTitle}
        modalBody={modalBody}
        isModalActive={isModalActive}
        setIsModalActive={setIsModalActive}
        noFooter
      />
    </div>
  );
};
