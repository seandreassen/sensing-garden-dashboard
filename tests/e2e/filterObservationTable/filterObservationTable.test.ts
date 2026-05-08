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

const devices = [{ device_id: "device-1", name: "FLIK2-dot02" }];

const observations = [
  {
    timestamp: "2026-04-22T16:47:00Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Unknown family",
    genus: "Unknown genus",
    species: "unknown",
    family_confidence: 0.97,
    genus_confidence: 0.97,
    species_confidence: 0.97,
    image_url: "/test-images/1.jpg",
    image_bucket: "test-bucket",
    image_key: "1.jpg",
  },
  {
    timestamp: "2026-04-22T15:19:00Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Family_11",
    genus: "Genus_11",
    species: "Species_11",
    family_confidence: 1,
    genus_confidence: 1,
    species_confidence: 1,
    image_url: "/test-images/2.jpg",
    image_bucket: "test-bucket",
    image_key: "2.jpg",
  },
  {
    timestamp: "2026-04-22T14:12:00Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Family_12",
    genus: "Genus_12",
    species: "Species_12",
    family_confidence: 0.93,
    genus_confidence: 0.93,
    species_confidence: 0.93,
    image_url: "/test-images/3.jpg",
    image_bucket: "test-bucket",
    image_key: "3.jpg",
  },
  {
    timestamp: "2026-04-22T13:05:00Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Family_13",
    genus: "Genus_13",
    species: "Species_13",
    family_confidence: 0.9,
    genus_confidence: 0.9,
    species_confidence: 0.9,
    image_url: "/test-images/4.jpg",
    image_bucket: "test-bucket",
    image_key: "4.jpg",
  },
];

test("filters observation table by minimum confidence", async ({ page }) => {
  let sawTableRequest = false;

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
        devices,
      }),
    });
  });

  await page.route("**/api/classifications?*", async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get("deployment_id")).toBe("dep-123");
    expect(url.searchParams.get("min_confidence")).toBe("0.9");
    expect(url.searchParams.get("taxonomy_level")).toBe("species");

    if (url.searchParams.get("limit") === "5") {
      sawTableRequest = true;
      expect(url.searchParams.get("sort_by")).toBe("timestamp");
      expect(url.searchParams.get("sort_desc")).toBe("true");
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: observations,
        count: observations.length,
        next_token: "",
      }),
    });
  });

  await page.route("**/api/classifications/count?*", async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get("deployment_id")).toBe("dep-123");
    expect(url.searchParams.get("min_confidence")).toBe("0.9");
    expect(url.searchParams.get("taxonomy_level")).toBe("species");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        count: observations.length,
      }),
    });
  });

  await page.goto(
    "/deployment/dep-123/observations?rangePreset=3m&taxonomyLevel=species&minConfidence=90",
  );

  await expect(page).toHaveTitle("Observations | Sensing Garden Dashboard");
  await expect(page.getByText("Last 3 Months")).toBeVisible();
  await expect(page.getByText("All Hubs")).toBeVisible();
  await expect(page.getByText("Species").first()).toBeVisible();
  await expect(page.getByText("Select species")).toBeVisible();
  await expect(page.getByRole("button", { name: /90/ })).toBeVisible();

  const table = page.locator("table");

  await expect(table).toBeVisible();
  await expect.poll(() => sawTableRequest).toBe(true);
  await expect(table).toContainText("unknown");
  await expect(table).toContainText("Species_11");
  await expect(table).toContainText("Species_12");
  await expect(table).toContainText("Species_13");
  await expect(table).toContainText("97%");
  await expect(table).toContainText("100%");
  await expect(table).toContainText("93%");
  await expect(table).toContainText("90%");
  await expect(table).not.toContainText("82%");
  await expect(table).not.toContainText("NaN%");

  await expect(page.getByText(/Rows\s+1\s+-\s+4\s+of\s+4/)).toBeVisible();

  await expect(page).toHaveScreenshot("observations-min-confidence-page.png", {
    animations: "disabled",
    fullPage: true,
  });

  await expect(table).toHaveScreenshot("observations-table-min-confidence.png", {
    animations: "disabled",
  });
});
