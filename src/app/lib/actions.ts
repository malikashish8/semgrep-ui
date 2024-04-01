"use server";

import { MongoClient } from "mongodb";
import { z } from "zod";
import {
  collectionNameFromJson,
  semgrepJsonFilePath,
} from "../../scripts/mongoUtils";

const DB = "semgrep";
const COLLECTION = collectionNameFromJson(semgrepJsonFilePath);

const FormSchema = z.object({
  fingerprint: z.string(),
  status: z.enum(["new", "ignored", "raised", "resolved"]),
  ignoreReason: z.string().optional(),
  internalLink: z.string().optional(),
});

export async function updateTriage(formData: FormData) {
  const data = FormSchema.parse({
    fingerprint: formData.get("fingerprint"),
    status: formData.get("status"),
    ignoreReason: formData.get("ignoreReason"),
    internalLink: formData.get("internalLink"),
  });
  const { fingerprint, status, ignoreReason, internalLink } = data;
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(DB);
    const collection = db.collection(COLLECTION);
    await collection.findOneAndUpdate(
      { fingerprint: fingerprint },
      {
        $set: {
          status: status,
          ignoreReason: ignoreReason,
          internalLink: internalLink,
        },
      }
    );
  } finally {
    await client.close();
  }
}
