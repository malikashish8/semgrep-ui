"use server";

import { MongoClient } from "mongodb";
import { z } from "zod";

const DB = "semgrep";

const FormSchema = z.object({
  fingerprint: z.string(),
  status: z.enum(["new", "ignored", "raised", "resolved"]),
  ignoreReason: z.string().optional(),
  internalLink: z.string().optional(),
});

export async function updateTriage(collectionName: string, formData: FormData) {
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
    const collection = db.collection(collectionName);
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
