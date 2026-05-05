import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process?.env?.NEXT_PUBLIC_SANITY_PROJECT_ID || "g1v8tlrq",
  dataset: process?.env?.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2023-05-03",
  token:
    "skgFCtSO6cw135Mt4O1Box5cmnpQBfY5NgVzd9c5lVN5uqkoeUVsm3kWC8vblNsBbWnhcPYKLIIF2H06WP0ltN8frUXEq35PcY1CfMz3LE4fRanEQiO5oMtH1Oa9ZQbdAj5mmYHKm437zbFUorvCmDb1mNy4FZu2ZfUlLYBXJejFIvhcN9Eq",
});