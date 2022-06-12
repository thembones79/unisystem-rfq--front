import React from "react";
interface MiniTableProps {
  dataObject: {};
  label: string;
}

export const MiniTable: React.FC<MiniTableProps> = ({ dataObject, label }) => {
  const renderRows = () => {
    const keys = Object.keys(dataObject) as Array<keyof typeof dataObject>;
    return keys
      .filter((key) => dataObject[key])
      .map((key) => (
        <tr key={key}>
          <td>{key}:</td>
          <td>
            <em>{dataObject[key]}</em>
          </td>
        </tr>
      ));
  };

  console.log(renderRows());

  return renderRows().length ? (
    <table className="table is-narrow is-size-7 mx-6 mb-6 is-striped mt-2">
      <thead>
        <tr>
          <th>{label}</th>
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  ) : null;
};
