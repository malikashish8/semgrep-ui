"use client";

// import SemgError from "./semgError";
import { useEffect, useState } from "react";
import SemgResult from "./semgResult";

export default function FilterResults({ results, collectionName }) {
  const [showNew, setShowNew] = useState(false);
  const [showIgnored, setShowIgnored] = useState(true);
  const [showRaised, setShowRaised] = useState(true);
  const [showTriaged, setShowTriaged] = useState(true);
  const [stateResults, setStateResults] = useState([]);

  // initiate stateResults based on initial filters
  useEffect(() => {
    var tmpResults = [];
    console.log(`results: ${results.length}`);
    results.forEach((result) => {
      console.log(result.status);
      if (result.status === "new" && showNew) {
        tmpResults.push(result);
      } else if (result.status === "triaged" && showTriaged) {
        tmpResults.push(result);
      } else if (result.status === "ignored" && showIgnored) {
        tmpResults.push(result);
      } else if (result.status === "raised" && showRaised) {
        tmpResults.push(result);
      } else {
        console.log("not included");
      }
    });
    setStateResults(tmpResults);
    console.log(tmpResults.length);
  }, [results, showNew, showTriaged, showIgnored, showRaised]);

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between p-1 border-2 font-bold sticky top-0 bg-bg-top-gray border-bg-top-gray bg-opacity-100 border-b-slate-400">
        <div className="text-xl">Filters</div>
        <div className="flex text-gray-500 bg-gray-200 select-none">
          <div
            className={`p-2 border-2 hover:text-black hover:cursor-pointer ${
              showNew
                ? "bbox-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
                : ""
            }`}
            onClick={() => setShowNew(!showNew)}
          >
            {results.filter((r) => r.status == "new").length} untriaged
          </div>
          <div
            className={`p-2 border-2 hover:text-black hover:cursor-pointer ${
              showTriaged
                ? "bbox-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
                : ""
            }`}
            onClick={() => setShowTriaged(!showTriaged)}
          >
            {results.filter((r) => r.status == "triaged").length} triaged
          </div>
          <div
            className={`p-2 border-2 hover:text-black hover:cursor-pointer ${
              showIgnored
                ? "bbox-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
                : ""
            }`}
            onClick={() => setShowIgnored(!showIgnored)}
          >
            {results.filter((r) => r.status == "ignored").length} ignored
          </div>
          <div
            className={`p-2 border-2 hover:text-black hover:cursor-pointer ${
              showRaised
                ? "bbox-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
                : ""
            }`}
            onClick={() => setShowRaised(!showRaised)}
          >
            {results.filter((r) => r.status == "raised").length} raised
          </div>
        </div>
        <div className="p-2">
          {stateResults.length}/{results.length} selected
        </div>
      </header>
      <div className="p-4 flex flex-col items-center xl:pv-32 2xl:pv-64">
        <div className="text-4xl">{collectionName}</div>
        <div className="flex min-h-screen flex-col p-2">
          <div className="w-full divide-y mb-4">
            {stateResults.map((result, i) => {
              return (
                <SemgResult
                  result={result}
                  collectionName={collectionName}
                  key={i}
                ></SemgResult>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
