import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { Loader } from "../../components/loader";

export interface IConfig {
  id: number;
  name: string;
}

export interface IRangesMargins {
  id: number;
  range: string;
  margin: number;
}

export interface ITemplate {
  id: number;
  name: string;
  category: "buffers" | "disclaimers" | "ranges";
  template: IRangesMargins[] | { pl: string; en: string };
}
interface ConfigProps {
  currentUser: IUser;
}

interface TemplateProps {
  templates: ITemplate[];
  category: "Buffers" | "Disclaimers" | "Ranges";
}

const TemplateTable: React.FC<TemplateProps> = ({ templates, category }) => {
  const filteredTemplates = templates.filter(
    (t) => t.category === category.toLowerCase()
  );
  const renderTableBody = () => {
    return filteredTemplates.map((template) => {
      const { name, id } = template;
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

  const handleEditReq = (id: number) =>
    Router.push(`/config/${category.toLowerCase()}/edit/${id}`);

  const handleNewDist = () =>
    Router.push(`/config/${category.toLowerCase()}/new`);

  const handleDeleteReq = (id: number) => Router.push(`/config/delete/${id}`);

  return templates ? (
    <div style={{ width: "30%" }}>
      <div className="mx-5 mt-2 mb-5">
        <NiceButton onClick={handleNewDist}>
          <i className="fas fa-plus"></i>
          <span className="m-1"></span> New {category} Template
        </NiceButton>

        <table className="table is-narrow is-striped is-hoverable is-fullwidth is-size-7 mt-5">
          <thead>
            <tr>
              <th>{category} Templates</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="fixed200 ">{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

const Config: React.FC<ConfigProps> = ({ currentUser }) => {
  const [templates, setTemplates] = useState<ITemplate[]>([]);

  const { doRequest, errorsJSX } = useRequest({
    url: `/configs`,
    method: "get",
    onSuccess: (data: ITemplate[]) => setTemplates(data),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return currentUser ? (
    <>
      <h1 className="title m-3 my-6"> 🕹️ My Templates </h1>
      <div className="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap">
        <TemplateTable templates={templates} category="Ranges" />
        <TemplateTable templates={templates} category="Disclaimers" />
        <TemplateTable templates={templates} category="Buffers" />
        {errorsJSX()}
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default Config;
