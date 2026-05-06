import { expect, test } from "@playwright/test";

test.use({ locale: "en-US", timezoneId: "UTC" });

const deployment = {
  deployment_id: "dep-123",
  name: "Spring Garden Survey",
  description: "A test deployment",
  start_time: "2024-03-12",
  end_time: null,
  model_id: "model-1",
  location_name: "Test Location",
};

const treemapTaxa = [
  { taxa: "Chrysis ignita", count: 471 },
  { taxa: "Vespa crabro", count: 118 },
  { taxa: "Calopteryx virgo", count: 52 },
  { taxa: "Tyria jacobaeae", count: 4 },
  { taxa: "Thaumatomyia notata", count: 4 },
  { taxa: "Anthocoris nemorum", count: 3 },
  { taxa: "Pieris napi", count: 2 },
  { taxa: "Mimas tiliae", count: 2 },
  { taxa: "Aeshna cyanea", count: 2 },
  { taxa: "Rhagonycha fulva", count: 2 },
];

test("renders taxa treemap for selected analytics filters", async ({ page }) => {
  let sawTreemapRequest = false;

  await page.route("**/api/deployments?limit=100*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        deployments: [deployment],
        count: 1,
        next_token: "",
      }),
    });
  });

  await page.route("**/api/deployments/dep-123", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        deployment,
        devices: [{ device_id: "device-1", name: "FLIK2-dot02" }],
      }),
    });
  });

  await page.route("**/api/classifications/taxa_count?*", async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get("deployment_id")).toBe("dep-123");
    expect(url.searchParams.get("taxonomy_level")).toBe("species");
    expect(url.searchParams.get("min_confidence")).toBe("0.9");
    expect(url.searchParams.get("sort_desc")).toBe("true");
    expect(url.searchParams.get("start_time")).toBe("2024-03-18T00:00:00.000Z");
    expect(url.searchParams.get("end_time")).toBe("2026-04-27T23:59:59.999Z");

    sawTreemapRequest = true;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        counts: treemapTaxa,
      }),
    });
  });

  await page.route("**/api/classifications/time_series?*", async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get("deployment_id")).toBe("dep-123");
    expect(url.searchParams.get("taxonomy_level")).toBe("species");
    expect(url.searchParams.get("min_confidence")).toBe("0.9");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        counts: [3, 0, 5, 1],
        start_time: url.searchParams.get("start_time"),
        interval_length: Number(url.searchParams.get("interval_length") ?? "1"),
        interval_unit: url.searchParams.get("interval_unit") ?? "h",
      }),
    });
  });

  await page.route("**/api/environment/time_series?*", async (route) => {
    const url = new URL(route.request().url());

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        temperature: [12, 13, 14],
        humidity: [55, 58, 60],
        pm1p0: [1, 2, 1],
        pm2p5: [2, 3, 2],
        pm4p0: [3, 4, 3],
        pm10: [4, 5, 4],
        voc: [110, 105, 120],
        nox: [90, 84, 88],
        start_time: url.searchParams.get("start_time"),
        interval_length: Number(url.searchParams.get("interval_length") ?? "1"),
        interval_unit: url.searchParams.get("interval_unit") ?? "h",
      }),
    });
  });

  await page.route("**/api/classifications?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [],
        count: 0,
        next_token: "",
      }),
    });
  });

  await page.goto(
    "/deployment/dep-123/analytics?rangePreset=custom&startDate=2024-03-18&endDate=2026-04-27&taxonomyLevel=species&minConfidence=90",
  );

  await expect(page).toHaveTitle("Analytics | Sensing Garden Dashboard");
  await expect(page.getByText("Custom Range")).toBeVisible();
  await expect(page.getByText("Species").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /90/ })).toBeVisible();

  const treemapCard = page.locator('[data-slot="card"]').filter({
    has: page.getByText("Taxa treemap"),
  });

  await expect.poll(() => sawTreemapRequest).toBe(true);
  await expect(treemapCard).toBeVisible();
  await expect(treemapCard).toContainText("Taxa treemap");
  await expect(treemapCard).toContainText("Detection count by selected taxonomy level");
  await expect(treemapCard).toContainText("Chrysis ignita");
  await expect(treemapCard).toContainText("471 detections");
  await expect(treemapCard).toContainText("Vespa crabro");
  await expect(treemapCard).toContainText("118 detections");
  await expect(treemapCard).toContainText("Calopteryx virgo");
  await expect(treemapCard).toContainText("52 detections");
  await expect(treemapCard).toContainText("Others");
  await expect(treemapCard).toContainText("4 detections");

  await expect(treemapCard).toHaveScreenshot("taxa-treemap-card.png", {
    animations: "disabled",
  });
});
