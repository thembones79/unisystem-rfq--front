import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";

export interface IDistributor {
  id: number;
  name: string;
}

interface DistributorsTableProps {
  currentUser: IUser;
}

const DistributorsTable: React.FC<DistributorsTableProps> = ({
  currentUser,
}) => {
  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  });

  const [distributorsTable, setDistributorsTable] = useState<IDistributor[]>(
    []
  );

  const { doRequest, errorsJSX } = useRequest({
    url: `/distributors`,
    method: "get",
    onSuccess: (distributors: IDistributor[]) =>
      setDistributorsTable(distributors),
  });

  const renderTableBody = () => {
    return distributorsTable.map((distributor) => {
      const { name, id } = distributor;
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

  const handleEditReq = (id: number) => Router.push(`/distributors/edit/${id}`);

  const handleNewDist = () => Router.push(`/distributors/new`);

  const handleDeleteReq = (id: number) =>
    Router.push(`/distributors/delete/${id}`);

  useEffect(() => {
    doRequest();
  }, []);

  return currentUser ? (
    <div className="table-container">
      <div className="mx-5 mt-2 mb-5">
        <NiceButton onClick={handleNewDist}>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> New Distributor
        </NiceButton>

        <table className="table is-narrow is-striped is-hoverable is-fullwidth is-size-7 mt-5">
          <thead>
            <tr>
              <th>distributor</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="fixed200 ">{renderTableBody()}</tbody>
        </table>
      </div>

      {errorsJSX()}
    </div>
  ) : (
    <div></div>
  );
};

export default DistributorsTable;
