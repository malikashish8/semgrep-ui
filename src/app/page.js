"use server";

const {
  collectionNameFromFileName,
  createCollectionFromJson,
  getAllDocuments,
} = require("../scripts/mongoUtils");
import { ignoredCheckIds, ignoredPathsContaining, onlyErrorSeverity, impactMedOrHigher, likelihoodMedOrHigher } from "./app.config";
import FilterResults from "./filterResults";
import FileInput from "./fileInput";

let collectionName = "";
let basescmPath = "";

export default async function Home() {
  // rerender will be triggerred by the client side fileInput.js component when a file is uploaded
  if (collectionName !== "") {

    var results = await getAllDocuments(collectionName);

    results = results.filter(r => r.extra.metadata.category === "security")
    results = results.filter(r => !ignoredCheckIds.includes(r.check_id));

    // result.path does not contain any string in ignoredPathsContaining
    results = results.filter(r => {
      for (const p of ignoredPathsContaining) {
        if (r.path.toLowerCase().includes(p)) {
          return false;
        }
      }
      return true;
    });

    if (onlyErrorSeverity) results = results.filter(r => r.severity === "ERROR")
    if (impactMedOrHigher) results = results.filter(r => r.extra.metadata.impact === "HIGH" || r.extra.metadata.impact === "MEDIUM")
    if (likelihoodMedOrHigher) results = results.filter(r => r.extra.metadata.likelihood === "MEDIUM" || r.extra.metadata.likelihood === "HIGH")
  }

  async function updateFileName(name) {
    "use server";
    collectionName = collectionNameFromFileName(name);
  }

  async function updateFileJSON(jsonData) {
    "use server";
    createCollectionFromJson(collectionName, jsonData)
  }

  async function updateBaseScmPath(path) {
    "use server";
    basescmPath = path;
  }

  return (
    <div>
      <FileInput updateFileName={updateFileName} updateFileJSON={updateFileJSON} updateBaseScmPath={updateBaseScmPath} className="relative pb-10 min-h-screen"></FileInput>
      {collectionName &&
        <FilterResults
          results={JSON.parse(JSON.stringify(results))}
          collectionName={collectionName}
          basescmPath={basescmPath}
        ></FilterResults>
      }
    </div>
  );
}
