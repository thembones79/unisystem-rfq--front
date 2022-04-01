import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { useRequest } from "../../hooks/useRequest";
import { IPartnumberWithNames } from "../../pages/partnumbers/[partnumberId]";

export interface PartnumbersTableProps {
  projectId: number;
}

export const Partnumbers: React.FC<PartnumbersTableProps> = ({ projectId }) => {
  const [partnumbersTable, setPartnumbersTable] = useState<
    IPartnumberWithNames[]
  >([]);

  const router = useRouter();

  const { doRequest, errorsJSX } = useRequest({
    url: `/projects/${projectId}/partnumbers`,
    method: "get",
    onSuccess: (partnumbers: IPartnumberWithNames[]) =>
      setPartnumbersTable(partnumbers),
  });

  const renderTableHeader = () => {
    if (partnumbersTable.length > 0) {
      const columns = ["partnumber", "version", "revision", "note"];
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
    return partnumbersTable.map(({ pn, version, revision, note, id }) => {
      return (
        <tr key={id} onClick={() => router.push(`/partnumbers/${id}`)}>
          <td className="p-2">{pn}</td>
          <td className="p-2">{version}</td>
          <td className="p-2">{revision}</td>
          <td className="p-2">{note}</td>
        </tr>
      );
    });
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
