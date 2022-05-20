import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import { GetStaticPaths } from "next";
import { useRequest } from "../../../hooks/useRequest";
import { UserPicker } from "../../../components/user-picker";
import { NiceButton } from "../../../components/nice-button";
import { Loader } from "../../../components/loader";
import { IUser } from "../../users";
import { IPartnumber } from "..";

interface NewPartnumberProps {
  currentUser: IUser;
}

const NewPartnumber = ({ currentUser }: NewPartnumberProps) => {
  const router = useRouter();
  const { projectId } = router.query;
  const [size, setSize] = useState("");
  const [display, setDisplay] = useState("");
  const [touch, setTouch] = useState("");
  const [mechanics, setMechanics] = useState("");
  const [thirdPartyPn, setThirdPartyPn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: "/partnumbers",
    method: "post",
    body: {
      project_id: projectId,
      size,
      display,
      touch,
      mechanics,
      third_party_pn: thirdPartyPn,
    },
    onSuccess: () => onSuccess(),
  });

  const isRequired = thirdPartyPn === "";

  const onSuccess = () => {
    Router.push(`/projects/${projectId}`);
    setIsLoading(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    Router.push(`/projects/${projectId}`);
  };

  const sizeOptions = [
    "015",
    "026",
    "028",
    "040",
    "043",
    "050",
    "070",
    "080",
    "101",
    "104",
    "121",
    "123",
    "133",
    "150",
    "156",
    "170",
    "195",
    "215",
    "238",
    "240",
    "280",
    "312",
    "550",
    "750",
  ];

  const renderSizeOptions = () => {
    return sizeOptions.map((x) => (
      <option key={x} value={x}>
        {parseInt(x) / 10} inches
      </option>
    ));
  };

  const sanitizeSize = (txt: string) => {
    const correct = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return txt
      .split("")
      .filter((x) => correct.indexOf(x) >= 0)
      .join("")
      .substring(0, 3);
  };

  const sanitizeMechanics = (txt: string) => {
    return txt[0]?.toUpperCase() === "M" ? "M" : "";
  };

  interface IOptions {
    letter: string;
    description: string;
  }

  const touchOptions = [
    {
      letter: "C",
      description: "Capacitive",
    },
    {
      letter: "R",
      description: "Resistive",
    },
    {
      letter: "S",
      description: "Sensor only",
    },
    {
      letter: "G",
      description: "Glass only",
    },
    {
      letter: "N",
      description: "None",
    },
  ];

  const displayOptions = [
    {
      letter: "T",
      description: "TFT",
    },
    {
      letter: "M",
      description: "Mono",
    },
    {
      letter: "O",
      description: "OLED",
    },
    {
      letter: "E",
      description: "EPD",
    },
    {
      letter: "N",
      description: "None",
    },
  ];

  const sanitizeInput = (txt: string, opts: IOptions[]) => {
    const correct = opts.map(({ letter }) => letter);
    const letter = txt[0]?.toUpperCase();
    return correct.indexOf(letter) >= 0 ? letter : "";
  };

  const renderOptions = (opts: IOptions[]) =>
    opts.map(({ letter, description }) => (
      <option key={letter} value={letter}>
        {description}
      </option>
    ));

  const renderLoader = () =>
    errorsJSX()?.props.children.length === 0 ? (
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
        <p className="title is-4 mb-6 mt-3">Please Wait...</p>
        <p className="subtitle"></p>
        <p className="subtitle">🔑 Signing into ClickUp...</p>
        <p className="subtitle">🗝 Signing into Sharepoint...</p>
        <p className="subtitle"></p>
        <p className="subtitle">
          <strong>Copying SharePoint folder structure...</strong>
        </p>
        <p></p>
        <p className="subtitle">💪 💪 💪</p>
        <Loader />
      </div>
    ) : (
      errorsJSX()
    );

  if (!currentUser) {
    return <div></div>;
  }
  const renderContent = () => (
    <form onSubmit={onSubmit}>
      <h1 className="title m-3 mb-5">🚀 New Partnumber</h1>
      <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
        <div className="field m-3">
          <label className="label">Size</label>
          <input
            className={inputStyle("size")}
            name="size"
            list="size"
            type="text"
            required={isRequired}
            value={size}
            onChange={(e) => setSize(sanitizeSize(e.target.value))}
          />
        </div>
        <datalist id="size">{renderSizeOptions()}</datalist>

        <div className="field m-3">
          <label className="label">Display</label>
          <input
            className={inputStyle("display")}
            name="display"
            list="display"
            type="text"
            required={isRequired}
            value={display}
            onChange={(e) =>
              setDisplay(sanitizeInput(e.target.value, displayOptions))
            }
          />
        </div>
        <datalist id="display">{renderOptions(displayOptions)}</datalist>

        <div className="field m-3">
          <label className="label">Touch</label>
          <input
            className={inputStyle("touch")}
            name="touch"
            list="touch"
            type="text"
            required={isRequired}
            value={touch}
            onChange={(e) =>
              setTouch(sanitizeInput(e.target.value, touchOptions))
            }
          />
        </div>
        <datalist id="touch">{renderOptions(touchOptions)}</datalist>

        <div className="field m-3">
          <label className="label">Mechanics</label>
          <input
            className={inputStyle("mechanics")}
            name="mechanics"
            list="mechanics"
            type="text"
            value={mechanics}
            onChange={(e) => setMechanics(sanitizeMechanics(e.target.value))}
          />
        </div>
        <datalist id="mechanics">
          <option value={"M"}>Mechanics present</option>
        </datalist>
      </div>
      <hr />
      <div className="mx-3 my-5">
        Supplier PN (fill only if supplier's PN is used)
      </div>
      <div className="field m-3">
        <label className="label">* Supplier Partnumber</label>
        <input
          className={inputStyle("third_party_pn")}
          name="third_party_pn"
          list="third_party_pn"
          type="text"
          value={thirdPartyPn}
          onChange={(e) => setThirdPartyPn(e.target.value.toUpperCase())}
        />
      </div>
      <div className="m-3 mt-6 ">
        <NiceButton>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> Add Partnumber
        </NiceButton>
        <span className="m-3"></span>
        <NiceButton color="cancel" onClick={(event) => onCancel(event)}>
          Cancel
        </NiceButton>
      </div>
    </form>
  );

  return (
    <div className="full-page ">
      <div className="card max-w-900 m-3 big-shadow">
        <div className="card-content">
          {isLoading ? renderLoader() : renderContent()}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(context: any) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default NewPartnumber;
