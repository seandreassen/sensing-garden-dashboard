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

const selectedPeriodFamilies = [
  { taxa: "Vespidae", count: 1338 },
  { taxa: "Chrysididae", count: 1240 },
  { taxa: "Limnephilidae", count: 1028 },
  { taxa: "Erebidae", count: 574 },
  { taxa: "Megachilidae", count: 420 },
];

const selectedPeriodObservationCount = 6473;

const isInitialRange = (url: URL) =>
  url.searchParams.get("start_time") === "2024-03-19T00:00:00.000Z" &&
  url.searchParams.get("end_time") === "2024-03-20T23:59:59.999Z";

const isSelectedRange = (url: URL) =>
  url.searchParams.get("start_time") === "2024-03-19T00:00:00.000Z" &&
  url.searchParams.get("end_time") === "2026-04-27T23:59:59.999Z";

test("shows top families in overview after extending the date range", async ({ page }) => {
  let sawSelectedRangeTaxaRequest = false;

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
    expect(url.searchParams.get("taxonomy_level")).toBe("family");

    if (isSelectedRange(url)) {
      sawSelectedRangeTaxaRequest = true;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        counts: isSelectedRange(url) ? selectedPeriodFamilies : isInitialRange(url) ? [] : [],
      }),
    });
  });

  await page.route("**/api/classifications/count?*", async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get("deployment_id")).toBe("dep-123");
    expect(url.searchParams.get("taxonomy_level")).toBe("family");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        count: isSelectedRange(url) ? selectedPeriodObservationCount : 0,
      }),
    });
  });

  await page.route("**/api/classifications/time_series?*", async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get("deployment_id")).toBe("dep-123");
    expect(url.searchParams.get("taxonomy_level")).toBe("family");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        counts: isSelectedRange(url) ? [0, 210, 1840, 560, 1120] : [],
        start_time: url.searchParams.get("start_time"),
        interval_length: Number(url.searchParams.get("interval_length") ?? "1"),
        interval_unit: url.searchParams.get("interval_unit") ?? "d",
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
    "/deployment/dep-123/overview?rangePreset=custom&startDate=2024-03-19&endDate=2024-03-20",
  );

  await expect(page).toHaveTitle("Overview | Sensing Garden Dashboard");
  await expect(page.getByText("Custom Range")).toBeVisible();
  await expect(page.getByText("Top families")).toBeVisible();

  const topFamiliesCard = page.locator('[data-slot="card"]').filter({
    has: page.getByText("Top families"),
  });

  await expect(topFamiliesCard).toContainText("No data for selected filters");

  await page.getByLabel("End date").fill("2026-04-27");

  await expect(page).toHaveURL(
    /\/deployment\/dep-123\/overview\?rangePreset=custom&startDate=2024-03-19&endDate=2026-04-27/,
  );
  await expect.poll(() => sawSelectedRangeTaxaRequest).toBe(true);

  await expect(topFamiliesCard).toContainText("Vespidae");
  await expect(topFamiliesCard).toContainText("1338");
  await expect(topFamiliesCard).toContainText("(20.7%)");
  await expect(topFamiliesCard).toContainText("Chrysididae");
  await expect(topFamiliesCard).toContainText("1240");
  await expect(topFamiliesCard).toContainText("(19.2%)");
  await expect(topFamiliesCard).toContainText("Limnephilidae");
  await expect(topFamiliesCard).toContainText("1028");
  await expect(topFamiliesCard).toContainText("(15.9%)");
  await expect(topFamiliesCard).toContainText("Erebidae");
  await expect(topFamiliesCard).toContainText("574");
  await expect(topFamiliesCard).toContainText("(8.9%)");
  await expect(topFamiliesCard).toContainText("Megachilidae");
  await expect(topFamiliesCard).toContainText("420");
  await expect(topFamiliesCard).toContainText("(6.5%)");

  await expect(page).toHaveScreenshot("overview-top-families-page.png", {
    animations: "disabled",
    fullPage: true,
  });

  await expect(topFamiliesCard).toHaveScreenshot("top-families-card.png", {
    animations: "disabled",
  });
});
