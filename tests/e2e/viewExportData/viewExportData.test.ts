import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

test.use({ locale: "en-US", timezoneId: "UTC" });

const deployment = {
  deployment_id: "dep-123",
  name: "Everything Deployment!",
  description: "A test deployment",
  start_time: "2024-03-11",
  end_time: null,
  model_id: "model-1",
  location_name: "Test Location",
};

const devices = [{ device_id: "device-1", name: "mattia" }];

const observations = [
  {
    timestamp: "2025-06-18T15:14:00.000Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Erebidae",
    genus: "Tyria",
    species: "Tyria jacobaeae",
    family_confidence: 0.98,
    genus_confidence: 0.98,
    species_confidence: 0.98,
    image_url: "/test-images/1.jpg",
    image_bucket: "test-bucket",
    image_key: "1.jpg",
  },
  {
    timestamp: "2025-06-18T15:14:00.000Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Vespidae",
    genus: "Vespa",
    species: "Vespa crabro",
    family_confidence: 0.99,
    genus_confidence: 0.99,
    species_confidence: 0.99,
    image_url: "/test-images/2.jpg",
    image_bucket: "test-bucket",
    image_key: "2.jpg",
  },
  {
    timestamp: "2025-06-18T15:14:00.000Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Vespidae",
    genus: "Vespa",
    species: "Vespa crabro",
    family_confidence: 0.99,
    genus_confidence: 0.99,
    species_confidence: 0.99,
    image_url: "/test-images/3.jpg",
    image_bucket: "test-bucket",
    image_key: "3.jpg",
  },
];

test("exports filtered observation data as json", async ({ page }) => {
  let sawExportRequest = false;

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
    expect(url.searchParams.get("device_id")).toBe("device-1");
    expect(url.searchParams.get("taxonomy_level")).toBe("species");
    expect(url.searchParams.get("min_confidence")).toBe("0.9");
    expect(url.searchParams.get("start_time")).toBe("2024-04-18T00:00:00.000Z");
    expect(url.searchParams.get("end_time")).toBe("2026-04-27T23:59:59.999Z");

    sawExportRequest = true;

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
    expect(url.searchParams.get("device_id")).toBe("device-1");
    expect(url.searchParams.get("taxonomy_level")).toBe("species");
    expect(url.searchParams.get("min_confidence")).toBe("0.9");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        count: observations.length,
      }),
    });
  });

  await page.goto(
    "/deployment/dep-123/observations?rangePreset=custom&startDate=2024-04-18&endDate=2026-04-27&hub=device-1&taxonomyLevel=species&minConfidence=90",
  );

  await expect(page).toHaveTitle("Observations | Sensing Garden Dashboard");
  await expect(page.getByText("Custom Range")).toBeVisible();
  await expect(page.getByText("mattia")).toBeVisible();
  await expect(page.getByText("Species").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /90/ })).toBeVisible();

  await expect.poll(() => sawExportRequest).toBe(true);

  await page.getByRole("button", { name: "Export data" }).click();

  const exportPopover = page.locator('[data-slot="popover-content"]');

  await expect(exportPopover).toBeVisible();
  await expect(exportPopover).toContainText("Select formats");
  await expect(exportPopover).toContainText("CSV");
  await expect(exportPopover).toContainText("JSON");
  await expect(exportPopover).toContainText("Images (ZIP)");

  await page.getByRole("button", { name: "CSV" }).click();

  await expect(page).toHaveScreenshot("export-data-json-page.png", {
    animations: "disabled",
  });

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download data" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(
    /^Sensing_Garden_Observations_\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.json$/,
  );

  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  if (!downloadPath) {
    throw new Error("Expected Playwright to provide a download path for the exported JSON file.");
  }

  const fileContents = await readFile(downloadPath, "utf8");
  const parsed = JSON.parse(fileContents);

  expect(fileContents).toMatchSnapshot("exported-observations.json");

  expect(parsed).toEqual([
    {
      timestamp: "2025-06-18T15:14:00.000Z",
      device_id: "device-1",
      species: "Tyria jacobaeae",
      species_confidence: 0.98,
    },
    {
      timestamp: "2025-06-18T15:14:00.000Z",
      device_id: "device-1",
      species: "Vespa crabro",
      species_confidence: 0.99,
    },
    {
      timestamp: "2025-06-18T15:14:00.000Z",
      device_id: "device-1",
      species: "Vespa crabro",
      species_confidence: 0.99,
    },
  ]);
});
