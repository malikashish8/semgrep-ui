"use client";

import { updateTriage } from "./lib/actions";
const { useState, useRef, useEffect } = require("react");

export default function SemgResult({ result, collectionName, baseScmPath, onUpdate, isSelected, handleClick }) {
  const [status, setStatus] = useState(result.status);
  const triageForm = useRef(null);
  var statusInput = useRef(null);
  var ignoreReasonInput = useRef(null);
  var internalLinkInput = useRef(null);

  // when the form is changed manually
  function changed(event) {
    // identify the change
    var statusFromEvent = result.status;
    if (event.target.innerText === "👎 Ignore") {
      statusFromEvent = "ignored";
    } else if (event.target.innerText === "🕕 Raised") {
      statusFromEvent = "raised";
    } else if (event.target.innerText === "✅ Resolved") {
      statusFromEvent = "resolved";
    }

    if (statusFromEvent !== result.status) {
      // update the parent for filtering on status change
      onUpdate({
        ...result,
        fingerprint: result.fingerprint,
        status: statusFromEvent,
        ignoreReason: ignoreReasonInput.current.value,
        internalLink: internalLinkInput.current.value,
      });

      setStatus(statusFromEvent);
      statusInput.current.value = statusFromEvent;
    }

    // send the form to backend
    triageForm.current.requestSubmit();
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
  for (var i = 1; i < parts + 2; i++) {
    var orgGitlabPath = orgGitlabPath = `${baseScmPath}${collectionName}/`

    var gitlabPath =
      orgGitlabPath +
      result.path.split("/").slice(0, i).join("/") +
      "/-/blob/HEAD/" +
      result.path.split("/").slice(i).join("/") +
      linkHash;
    gitlabPaths.push(gitlabPath);
  }

  return (
    <div className={`flex items-center p-2 border-l-4 rounded-sm ${isSelected ? "bg-gray-200 border-l-pink-500" : ""}`} onClick={handleClick}>
      <form action={(formData) => updateTriage(collectionName, formData)} className="p-1" ref={triageForm}>
        <input type="hidden" name="fingerprint" value={result.fingerprint} />
        <input
          type="hidden"
          name="status"
          ref={statusInput}
          value={result.status}
        />
        <div className="text-xl text-gray-500 select-none p-1 px-4">
          <div
            className={`hover:text-white hover:bg-gray-500 hover:cursor-pointer px-4 rounded-lg ${status === "ignored" ? "bg-gray-600 text-white" : ""
              }`}
            onClick={changed}
          >
            👎 Ignore
          </div>
          <div
            className={`hover:text-white hover:bg-gray-500 hover:cursor-pointer px-4 rounded-lg ${status === "raised" ? "bg-gray-600 text-white" : ""
              }`}
            onClick={changed}
          >
            🕕 Raised
          </div>
          <div
            className={`hover:text-white hover:bg-gray-500 hover:cursor-pointer px-4 rounded-lg ${status === "resolved" ? "bg-gray-600 text-white" : ""
              }`}
            onClick={changed}
          >
            ✅ Resolved
          </div>
        </div>

        <div className="p-1">
          <input
            type="text"
            name="ignoreReason"
            placeholder="Ignore Reason"
            ref={ignoreReasonInput}
            onChange={changed}
            className="rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <div className="p-1">
          <input
            type="text"
            name="internalLink"
            placeholder="Internal Link"
            ref={internalLinkInput}
            onChange={changed}
            className="rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </form>
      <div>
        <div className="font-mono text-sm">
          {result.check_id}{" "}
          <a
            className="no-underline text-xs"
            href={result.extra.metadata["semgrep.dev"].rule.url}
            target="_blank"
          >
            &#128279;
          </a>
          <a
            className="no-underline text-xs"
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
          {result.extra.lines.length > 150
            ? result.extra.lines.slice(0, 150) + "..."
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
