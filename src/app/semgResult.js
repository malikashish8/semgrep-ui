"use client";

import internal from "stream";
import { updateTriage } from "./lib/actions";
const { useState, useRef, useEffect, use } = require("react");

export default function SemgResult({ result, collectionName }) {
  const [status, setStatus] = useState(result.status);

  // submit form for any change since we are running locally
  const triageForm = useRef(null);
  const handleSubmit = (event) => {
    triageForm.current.requestSubmit();

    // if (event.target.name === "ignoreReason") {
    //   event.target.value = event.target.value;
    // }
  };

  // pass the click to the radio button
  const outerDivClicked = (event) => {
    var children = event.target.children;
    if (children.length > 1) {
      children[0].click();
      children[1].click();
    }
  };

  const ignoreReason = useRef(null);
  useEffect(() => {
    ignoreReason.current.value = result.ignoreReason;
  }, [result.ignoreReason]);

  const internalLink = useRef(null);
  useEffect(() => {
    internalLink.current.value = result.internalLink;
  }, [result.internalLink]);

  // ignore reason changed
  const ignoreReasonChanged = (event) => {
    handleSubmit(event);
  };

  const internalLinkChanged = (event) => {
    handleSubmit(event);
  };

  var linkHash = "#L" + result.start.line + "-" + result.end.line;
  var gitlabPaths = [];
  var parts = result.path.split("/").length - 2;
  for (var i = 2; i < parts + 2; i++) {
    var gitlabPath =
      `https://gitlab.com/vistaprint-org/${collectionName}/` +
      result.path.split("/").slice(0, i).join("/") +
      "/-/blob/HEAD/" +
      result.path.split("/").slice(i).join("/") +
      linkHash;
    gitlabPaths.push(gitlabPath);
  }
  return (
    <div className="p-2 flex items-center">
      <form action={updateTriage} className="p-1" ref={triageForm}>
        <input type="hidden" name="fingerprint" value={result.fingerprint} />

        <fieldset className="hover:text-white-1 text-gray-500 select-none">
          <div
            className={`flex items-center flex-col text-xl hover:bg-gray-500 hover:text-white hover:cursor-pointer active:bg-white ${
              status === "triaged" ? "bg-gray-600 text-white" : ""
            }`}
            onClick={(e) => {
              outerDivClicked(e);
              setStatus("triaged");
            }}
          >
            <input
              type="radio"
              name="status"
              id="triaged"
              value="triaged"
              className=""
              checked={status === "triaged"}
              hidden
              onChange={handleSubmit}
            />
            <label htmlFor="triage">✅ Triaged</label>
          </div>
          <div
            className={`flex items-center flex-col text-xl hover:bg-gray-500 hover:text-white hover:cursor-pointer active:bg-blue-gray-50 ${
              status === "ignored" ? "bg-gray-600 text-white" : ""
            }`}
            onClick={(e) => {
              outerDivClicked(e);
              setStatus("ignored");
            }}
          >
            <input
              type="radio"
              name="status"
              id="ignored"
              value="ignored"
              className=""
              checked={status === "ignored"}
              hidden
              onChange={handleSubmit}
            />
            <label htmlFor="ignore" className="active:bg-blue-gray-50">
              👎 Ignore
            </label>
          </div>
          <div
            className={`flex items-center flex-col text-xl hover:bg-gray-500 hover:text-white hover:cursor-pointer active:bg-white ${
              status === "raised" ? "bg-gray-600 text-white" : ""
            }`}
            onClick={(e) => {
              outerDivClicked(e);
              setStatus("raised");
            }}
          >
            <input
              type="radio"
              name="status"
              id="raised"
              value="raised"
              className=""
              checked={status === "raised"}
              hidden
              onChange={handleSubmit}
            />
            <label htmlFor="raised">🕕 Raised</label>
          </div>
        </fieldset>

        <div className="p-1">
          <input
            type="text"
            name="ignoreReason"
            ref={ignoreReason}
            placeholder="Suppress Reason"
            onChange={ignoreReasonChanged}
          />
        </div>
        <div className="p-1">
          <input
            type="text"
            name="internalLink"
            ref={internalLink}
            placeholder="Internal Link"
            onChange={handleSubmit}
          />
        </div>
      </form>
      <div>
        <div className="font-mono text-sm">
          {result.check_id}{" "}
          <a
            className="no-underline"
            href={result.extra.metadata["semgrep.dev"].rule.url}
            target="_blank"
          >
            &#128279;
          </a>
          <a
            className="no-underline"
            href={result.extra.metadata.source}
            target="_blank"
          >
            &#128279;
          </a>
        </div>
        <div className="text-sm">{result.path}</div>
        {/* links */}
        <div className="mr-6">
          {gitlabPaths.map((path, index) => (
            <span key={index} className="mr-4">
              <a href={path} target="_blank">
                {path.split("/-/blob/HEAD/")[0].split("/").slice(-1)[0]}
              </a>
            </span>
          ))}
        </div>
        {/* code */}
        <div className="font-mono text-sm text-orange-800">
          {result.extra.lines.length > 200
            ? result.extra.lines.slice(0, 200) + "..."
            : result.extra.lines}
        </div>
        <div>{result.extra.message}</div>
        <div className="font-mono text-sm">
          severity:{result.severity} category:{result.extra.metadata.category}{" "}
          impact:{result.extra.metadata.impact} likelyhood:
          {result.extra.metadata.likelihood}
        </div>
        <div hidden={result.extra.metadata.description === undefined}>
          description: {result.extra.metadata.description}
        </div>
      </div>
    </div>
  );
}
