"use client";

import { updateTriage } from "./lib/actions";
const { useState, useRef, useEffect, use } = require("react");

export default function SemgResult({ result, collectionName, onUpdate }) {
  const [status, setStatus] = useState(result.status);
  const triageForm = useRef(null);
  var statusInput = useRef(null);
  var ignoreReasonInput = useRef(null);
  var internalLinkInput = useRef(null);

  // when the form is changed manually
  function changed(event) {
    // identify the change
    var statusFromEvent = result.status;
    if (event.target.innerText === "✅ Triaged") {
      statusFromEvent = "triaged";
      console.log("triaged");
    } else if (event.target.innerText === "👎 Ignore") {
      statusFromEvent = "ignored";
    } else if (event.target.innerText === "🕕 Raised") {
      statusFromEvent = "raised";
    }

    // update the parent for filtering
    onUpdate({
      ...result,
      fingerprint: result.fingerprint,
      status: statusFromEvent,
      ignoreReason: ignoreReasonInput.current.value,
      internalLink: internalLinkInput.current.value,
    });

    // send the form to backend
    statusInput.current.value = statusFromEvent;
    triageForm.current.requestSubmit();
    setStatus(statusFromEvent);
  }

  // when the result is updated from the parent set respective form value
  useEffect(() => {
    statusInput.current.value = result.status;
    ignoreReasonInput.current.value = result.ignoreReason;
    internalLinkInput.current.value = result.internalLink;
  }, [result]);

  // generate all probable gitlab links since we do not know the project root
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
        <input
          type="hidden"
          name="status"
          ref={statusInput}
          value={result.status}
        />
        <div className="hover:text-white-1 text-gray-500 select-none p-1">
          <div
            className={`flex items-center flex-col text-xl hover:bg-gray-500 hover:text-white hover:cursor-pointer ${
              status === "triaged" ? "bg-gray-600 text-white" : ""
            }`}
            name="triaged"
            onClick={changed}
          >
            ✅ Triaged
          </div>
          <div
            className={`flex items-center flex-col text-xl hover:bg-gray-500 hover:text-white hover:cursor-pointer active:bg-blue-gray-50 ${
              status === "ignored" ? "bg-gray-600 text-white" : ""
            }`}
            onClick={changed}
          >
            👎 Ignore
          </div>
          <div
            className={`flex items-center flex-col text-xl hover:bg-gray-500 hover:text-white hover:cursor-pointer ${
              status === "raised" ? "bg-gray-600 text-white" : ""
            }`}
            onClick={changed}
          >
            🕕 Raised
          </div>
        </div>

        <div className="p-1">
          <input
            type="text"
            name="ignoreReason"
            placeholder="Suppress Reason"
            ref={ignoreReasonInput}
            onChange={changed}
          />
        </div>
        <div className="p-1">
          <input
            type="text"
            name="internalLink"
            placeholder="Internal Link"
            ref={internalLinkInput}
            onChange={changed}
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
          impact:{result.extra.metadata.impact} likelihood:
          {result.extra.metadata.likelihood}
        </div>
        <div hidden={result.extra.metadata.description === undefined}>
          description: {result.extra.metadata.description}
        </div>
      </div>
    </div>
  );
}
