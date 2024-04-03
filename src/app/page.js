"use server";

const {
  getAllDocuments,
  collectionNameFromJson,
} = require("../scripts/mongoUtils");
import { ignoredCheckIds, ignoredPathsContaining, onlyErrorSeverity, impactMedOrHigher, likelihoodMedOrHigher, semgrepJsonFilePath } from "./app.config";
import FilterResults from "./filterResults";

export default async function Home() {
  var collectionName = collectionNameFromJson(semgrepJsonFilePath);
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

  return (
    <FilterResults
      results={JSON.parse(JSON.stringify(results))}
      collectionName={collectionName}
    ></FilterResults>
  );
}
