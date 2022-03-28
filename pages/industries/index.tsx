import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { Loader } from "../../components/loader";

export interface IIndustry {
  id: number;
  name: string;
}

interface IndustriesTableProps {
  currentUser: IUser;
}

const IndustriesTable: React.FC<IndustriesTableProps> = ({ currentUser }) => {
  const [industriesTable, setIndustriesTable] = useState<IIndustry[]>([]);

  const { doRequest, errorsJSX } = useRequest({
    url: `/industries`,
    method: "get",
    onSuccess: (Industries: IIndustry[]) => setIndustriesTable(Industries),
  });

  const renderTableBody = () => {
    return industriesTable.map((industry) => {
      const { name, id } = industry;
      return (
        <tr key={id}>
          <td className="p-2">{name}</td>
          <td className="is-120 p-2">
            <button
              onClick={() => {
                handleEditReq(id);
              }}
              className="button is-link is-inverted is-rounded is-small mx-1 p-3"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => {
                handleDeleteReq(id);
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

  const handleEditReq = (id: number) => Router.push(`/industries/edit/${id}`);

  const handleNewDist = () => Router.push(`/industries/new`);

  const handleDeleteReq = (id: number) =>
    Router.push(`/industries/delete/${id}`);

  useEffect(() => {
    doRequest();
  }, []);

  return currentUser ? (
    <div className="table-container">
      <div className="mx-5 mt-2 mb-5">
        <NiceButton onClick={handleNewDist}>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> New Industry
        </NiceButton>

        <table className="table is-narrow is-striped is-hoverable is-fullwidth is-size-7 mt-5">
          <thead>
            <tr>
              <th>Industry</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="fixed200 ">{renderTableBody()}</tbody>
        </table>
      </div>

      {errorsJSX()}
    </div>
  ) : (
    <Loader />
  );
};

export default IndustriesTable;
