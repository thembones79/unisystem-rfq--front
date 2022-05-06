import React from "react";
interface DataListProps {
  options: string[];
  value: string;
  label: string;
  fieldname: string;
  className: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

export const DataList: React.FC<DataListProps> = ({
  options,
  value,
  label,
  fieldname,
  onChange,
  className,
}) => {
  const renderOptions = (opts: string[]) => {
    return opts.map((x) => <option key={x}>{x}</option>);
  };

  return (
    <div className="field m-3">
      <label className="label is-small">{label}</label>
      <input
        name={fieldname}
        list={fieldname}
        className={className}
        style={{ maxWidth: "150px", width: "100%" }}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id={fieldname}>{renderOptions(options)}</datalist>
    </div>
  );
};
