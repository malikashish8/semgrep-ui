"use client";

import { useEffect, useReducer, useState } from "react";
import SemgResult from "./semgResult";

export default function FilterResults({ results, collectionName }) {
  const [showNew, setShowNew] = useState(false);
  const [showIgnored, setShowIgnored] = useState(true);
  const [showRaised, setShowRaised] = useState(true);
  const [showResolved, setShowResolved] = useState(true);
  const [stateResults, setStateResults] = useState([]);

  const [selectedResult, setSelectedResult] = useState(null);

  const [reducedResults, dispatch] = useReducer(resultsReducer, results);

  // initiate stateResults based on initial filters
  useEffect(() => {
    var tmpResults = [];
    reducedResults.forEach((result) => {
      if (result.status === "new" && showNew) {
        tmpResults.push(result);
      } else if (result.status === "ignored" && showIgnored) {
        tmpResults.push(result);
      } else if (result.status === "raised" && showRaised) {
        tmpResults.push(result);
      } else if (result.status === "resolved" && showResolved) {
        tmpResults.push(result);
      }
    });
    setStateResults(tmpResults);
  }, [results, showNew, showResolved, showIgnored, showRaised, reducedResults]);

  function handleUpdateResult(result) {
    dispatch({ type: "updated", result });
  }

  function handleResultClick(fingerprint) {
    setSelectedResult(fingerprint);
  }

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between p-1 border-2 font-bold sticky top-0 bg-bg-top-gray border-bg-top-gray bg-opacity-100 border-b-slate-400">
        <div className="text-xl">Filters</div>
        <div className="flex text-gray-500 bg-gray-200 select-none">
          <div
            className={`p-2 border-2 hover:text-black hover:cursor-pointer ${showNew
              ? "bbox-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
              : ""
              }`}
            onClick={() => setShowNew(!showNew)}
          >
            {reducedResults.filter((r) => r.status == "new").length} untriaged
          </div>
          <div
            className={`p-2 border-2 hover:text-black hover:cursor-pointer ${showIgnored
              ? "bbox-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
              : ""
              }`}
            onClick={() => setShowIgnored(!showIgnored)}
          >
            {reducedResults.filter((r) => r.status == "ignored").length} ignored
          </div>
          <div
            className={`p-2 border-2 hover:text-black hover:cursor-pointer ${showRaised
              ? "bbox-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
              : ""
              }`}
            onClick={() => setShowRaised(!showRaised)}
          >
            {reducedResults.filter((r) => r.status == "raised").length} raised
          </div>
          <div
            className={`p-2 border-2 hover:text-black hover:cursor-pointer ${showResolved
              ? "bbox-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
              : ""
              }`}
            onClick={() => setShowResolved(!showResolved)}
          >
            {reducedResults.filter((r) => r.status == "resolved").length} resolved
          </div>
        </div>
        <div className="p-2">
          {stateResults.length}/{results.length} selected
        </div>
      </header>
      <div className="p-4 flex flex-col items-center xl:pv-32 2xl:pv-64">
        <div className="text-4xl">{collectionName}</div>
        <div className="w-full flex min-h-screen flex-col divide-y p-2 mb-4">
          {stateResults.map((result) => {
            return (
              <SemgResult
                result={result}
                collectionName={collectionName}
                onUpdate={handleUpdateResult}
                isSelected={result.fingerprint === selectedResult}
                handleClick={() => handleResultClick(result.fingerprint)}
                key={result.fingerprint}
              ></SemgResult>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function resultsReducer(results, action) {
  switch (action.type) {
    case "updated": {
      return results.map((result) => {
        if (result.fingerprint === action.result.fingerprint) {
          return action.result;
        }
        return result;
      });
    }
  }
}
