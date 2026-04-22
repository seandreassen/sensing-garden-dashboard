import { expect, test } from "vitest";

import { addQueryParameters } from "@/lib/utils/queryParameters";

test("adds valid scalar query parameters", () => {
  const params = new URLSearchParams();

  addQueryParameters(params, {
    deployment_id: "dep-123",
    limit: 50,
    model_id: "model-1",
    sort_by: "timestamp",
    sort_desc: true,
    taxonomy_level: "genus",
  });

  expect(params.get("deployment_id")).toBe("dep-123");
  expect(params.get("limit")).toBe("50");
  expect(params.get("model_id")).toBe("model-1");
  expect(params.get("sort_by")).toBe("timestamp");
  expect(params.get("sort_desc")).toBe("true");
  expect(params.get("taxonomy_level")).toBe("genus");
});

test("serializes filters into backend query format", () => {
  const params = new URLSearchParams();

  addQueryParameters(params, {
    device_id: ["hub-1", "hub-2"],
    min_confidence: 75,
    selected_taxa: ["Vespa", "Chrysis"],
  });

  expect(params.get("device_id")).toBe("hub-1,hub-2");
  expect(params.get("min_confidence")).toBe("0.75");
  expect(params.get("selected_taxa")).toBe("Vespa,Chrysis");
});

test("normalizes valid date query parameters", () => {
  const params = new URLSearchParams();

  addQueryParameters(params, {
    end_time: "2025-06-01T12:00:00.000Z",
    start_time: "2025-06-01T00:00:00.000Z",
  });

  expect(params.get("start_time")).toBe("2025-06-01T00:00:00.000Z");
  expect(params.get("end_time")).toBe("2025-06-01T12:00:00.000Z");
});

test("skips empty or invalid query parameters", () => {
  const params = new URLSearchParams();

  addQueryParameters(params, {
    device_id: [],
    end_time: "not-a-date",
    limit: 10.5,
    next_token: null,
    selected_taxa: [],
    start_time: "not-a-date",
  });

  expect(params.toString()).toBe("");
});

test("skips min_confidence when value is 0", () => {
  const params = new URLSearchParams();
  addQueryParameters(params, { min_confidence: 0 });
  expect(params.has("min_confidence")).toBe(false);
});
