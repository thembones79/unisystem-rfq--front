import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";

interface ITemplateToRender {
  name: string;
  template: { pl: string; en: string };
}

const ensureHashtags = (template: { pl: string; en: string }) => {
  return {
    pl: template.pl.includes("###") ? template.pl : template.pl + " ###",
    en: template.en.includes("###") ? template.en : template.en + " ###",
  };
};

const NewBuffer: React.FC = () => {
  const router = useRouter();
  const [config, setConfig] = useState<ITemplateToRender>({
    name: "",
    template: { pl: "###", en: "###" },
  });
  const lineHeight = 36;
  const [heightPl, setHeightPl] = useState(lineHeight);
  const [heightEn, setHeightEn] = useState(lineHeight);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/configs`,
    method: "post",
    body: {
      name: config?.name,
      category: "buffers",
      template: JSON.stringify(ensureHashtags(config?.template)),
    },
    onSuccess: () => router.push(`/config`),
  });
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    router.push(`/config`);
  };

  return (
    <div className="full-page full-page--top">
      <div className="card max-w-900 m-3 big-shadow">
        <div className="card-content">
          <form onSubmit={onSubmit}>
            <h1 style={{ fontSize: "34px" }} className="title m-3 mb-5 is-4">
              <i className="fas fa-edit mr-1"></i> New Buffer Notification
            </h1>
            <div className="is-flex is-flex-direction-column">
              <div className="notification is-primary is-light">
                <p style={{ marginBottom: "16px", fontSize: "18px" }}>
                  <strong>💡 Pro Tip </strong>
                </p>
                <p className="m-2">
                  Use <strong>###</strong> (three hashes) in your template. They
                  will be replaced with{" "}
                  <strong>"When to pick up (from buffer)"</strong> variable in
                  the results.
                </p>
              </div>

              <div className="field m-3">
                <label className="label">Name</label>
                <input
                  className={inputStyle("name")}
                  type="text"
                  value={config.name}
                  required
                  autoFocus
                  onChange={(e) =>
                    setConfig({ ...config, name: e.target.value })
                  }
                />
              </div>
              <div className="field m-3">
                <label className="label">Buffer Notification PL</label>
                <textarea
                  className="input"
                  value={config.template.pl}
                  style={{ height: `${heightPl}px` }}
                  onChange={(e) => {
                    setHeightPl(24 * e.target.value.split("\n").length + 12);
                    setConfig({
                      ...config,
                      template: {
                        en: config.template.en,
                        pl: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="field m-3">
                <label className="label">Buffer Notification EN</label>
                <textarea
                  className="input"
                  value={config.template.en}
                  style={{ height: `${heightEn}px` }}
                  onChange={(e) => {
                    setHeightEn(24 * e.target.value.split("\n").length + 12);
                    setConfig({
                      ...config,
                      template: {
                        pl: config.template.pl,
                        en: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton>
                <i className="far fa-save"></i>
                <span className="m-1"></span> Save Buffer Notification
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton color="cancel" onClick={onCancel}>
                Cancel
              </NiceButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewBuffer;
