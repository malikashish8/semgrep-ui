"use server";

const {
  getAllDocuments,
  semgrepJsonFilePath,
  collectionNameFromJson,
} = require("../scripts/mongoUtils");
import FilterResults from "./filterResults";

export default async function Home() {
  var collectionName = collectionNameFromJson(semgrepJsonFilePath);
  var results = await getAllDocuments(collectionName);

  // results = results.filter(r => r.extra.metadata.category === "security")
  // results = results.filter(r => r.severity === "ERROR")

  return (
    <FilterResults
      results={JSON.parse(JSON.stringify(results))}
      collectionName={collectionName}
    ></FilterResults>
  );
}
