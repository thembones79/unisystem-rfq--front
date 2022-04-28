import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { useRequest } from "../../hooks/useRequest";
import { SharePointLogo } from "../../icons/sharepoint-logo";

export interface IRndTask {
  serial: number;
  name: string;
  status: string;
  rndtask_clickup_id: string;
  sp: string;
  project_id: number;
}

export interface RndtasksTableProps {
  projectId: number;
}

export const Rndtasks: React.FC<RndtasksTableProps> = ({ projectId }) => {
  const [rndtasksTable, setrndtasksTable] = useState<IRndTask[]>([]);

  const router = useRouter();

  const { doRequest, errorsJSX } = useRequest({
    url: `/projects/${projectId}/tasks`,
    method: "get",
    onSuccess: (rndtasks: IRndTask[]) => setrndtasksTable(rndtasks),
  });

  const formatStatus = (status: string) => {
    if (status.toLowerCase() === "open") {
      return "is-warning";
    } else if (status.toLowerCase() === "in progress") {
      return "is-success";
    } else if (status.includes("DEAD")) {
      return "is-danger";
    } else {
      return "is-link";
    }
  };

  const renderTableHeader = () => {
    if (rndtasksTable.length > 0) {
      const columns = ["task", "name", "status", "sharepoint"];
      return columns.map((column) => {
        return (
          <th className="p-2" key={column}>
            {column}
          </th>
        );
      });
    }
  };

  const renderTableBody = () => {
    return rndtasksTable.map(
      ({ serial, name, status, rndtask_clickup_id, sp }) => {
        return (
          <tr key={serial}>
            <td className="p-2">{serial}</td>
            <td className="p-2">{name}</td>
            <td className="p-1">
              <button
                className={`button ${formatStatus(
                  status
                )} is-small is-rounded is-light m-0`}
                onClick={() => {
                  const win = window.open(
                    `https://app.clickup.com/t/${rndtask_clickup_id}`,
                    "_blank"
                  );
                  if (win) {
                    win.focus();
                  }
                }}
              >
                {status}
              </button>
            </td>
            <td className="p-2">
              {" "}
              <button
                className="button is-link is-small is-inverted"
                onClick={() => {
                  const win = window.open(`${sp}`, "_blank");
                  if (win) {
                    win.focus();
                  }
                }}
              >
                <SharePointLogo width={22} />
              </button>
            </td>
          </tr>
        );
      }
    );
  };

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="table-container">
      <div className="mx-5 mt-2 mb-5">
        <table className="table is-narrow is-striped is-hoverable is-fullwidth is-size-7 mt-5">
          <thead>
            <tr>{renderTableHeader()}</tr>
          </thead>
          <tbody className="fixed200 ">{renderTableBody()}</tbody>
        </table>
      </div>

      {errorsJSX()}
    </div>
  );
};
