import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process?.env?.NEXT_PUBLIC_SANITY_PROJECT_ID || "g1v8tlrq",
  dataset: process?.env?.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2023-05-03",
  token: process?.env?.SANITY_API_TOKEN,
});
