import type { PostClassificationBody } from "./lib/types/api";

const BASE_URL = "https://api.sensinggarden.com/v1";

export async function getClassifications(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/classifications?${query}`);
  return res.json();
}

export async function getEnvironmentData(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/environment?${query}`);
  return res.json();
}

export async function postClassification(data: PostClassificationBody) {
  const res = await fetch(`${BASE_URL}/classifications`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}
