import React, { useState, useEffect } from "react";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { NiceButton } from "../../../../components/nice-button";
import { Loader } from "../../../../components/loader";
import { useRequest } from "../../../../hooks/useRequest";
import { IRangesMargins } from "../..";

interface IFetchedTemplate {
  name: string;
  template: string;
}

interface ITemplateToRender {
  name: string;
  template: { pl: string; en: string };
}

const EditDisclaimer: React.FC = () => {
  const router = useRouter();
  const { configId } = router.query;
  const [config, setConfig] = useState<ITemplateToRender>();
  const lineHeight = 36;
  const [heightPl, setHeightPl] = useState(lineHeight);
  const [heightEn, setHeightEn] = useState(lineHeight);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/configs/${configId}`,
    method: "put",
    body: {
      name: config?.name,
      template: JSON.stringify(config?.template),
    },
    onSuccess: () => router.push(`/config`),
  });

  const initRequest = useRequest({
    url: `/configs/${configId}`,
    method: "get",
    onSuccess: (data: IFetchedTemplate) => setData(data),
  });

  const setData = (data: IFetchedTemplate) => {
    const template = JSON.parse(data.template);
    setConfig({
      name: data.name,
      template,
    });
    setHeightPl(24 * template.pl.split("\n").length + 12);
    setHeightEn(24 * template.en.split("\n").length + 12);
  };

  const getConfig = initRequest.doRequest;

  useEffect(() => {
    getConfig();
  }, []);

  if (!config) {
    return <Loader />;
  } else {
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await doRequest();
    };

    const onCancel = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      router.push(`/config`);
    };

    return (
      <div className="full-page full-page--top">
        <div className="card max-w-900 m-3 big-shadow">
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <h1 className="title m-3 mb-5 is-4">
                <i className="fas fa-edit mr-1"></i> Edit Disclaimer:{" "}
                {config.name}
              </h1>
              <div className="is-flex is-flex-direction-column">
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
                  <label className="label">Disclaimer PL</label>
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
                  <label className="label">Disclaimer EN</label>
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
                  <span className="m-1"></span> Save Disclaimer
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
  }
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

export default EditDisclaimer;
