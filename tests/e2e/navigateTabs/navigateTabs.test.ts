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

const observations = [
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
    image_url: "/test-images/1.jpg",
    image_bucket: "test-bucket",
    image_key: "1.jpg",
  },
  {
    timestamp: "2025-06-18T15:13:00.000Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Erebidae",
    genus: "Tyria",
    species: "Tyria jacobaeae",
    family_confidence: 0.98,
    genus_confidence: 0.98,
    species_confidence: 0.98,
    image_url: "/test-images/2.jpg",
    image_bucket: "test-bucket",
    image_key: "2.jpg",
  },
  {
    timestamp: "2025-06-18T15:12:00.000Z",
    device_id: "device-1",
    model_id: "model-1",
    family: "Apidae",
    genus: "Apis",
    species: "Apis mellifera",
    family_confidence: 0.97,
    genus_confidence: 0.97,
    species_confidence: 0.97,
    image_url: "/test-images/3.jpg",
    image_bucket: "test-bucket",
    image_key: "3.jpg",
  },
];

const taxaCounts = [
  { taxa: "Vespa crabro", count: 12 },
  { taxa: "Tyria jacobaeae", count: 8 },
  { taxa: "Apis mellifera", count: 5 },
];

const filteredQuery =
  "rangePreset=custom&startDate=2024-04-18&endDate=2026-04-27&hub=device-1&taxonomyLevel=species&minConfidence=90";

function assertFilteredRequest(url: URL) {
  expect(url.searchParams.get("deployment_id")).toBe("dep-123");
  expect(url.searchParams.get("device_id")).toBe("device-1");
  expect(url.searchParams.get("taxonomy_level")).toBe("species");
  expect(url.searchParams.get("min_confidence")).toBe("0.9");
  expect(url.searchParams.get("start_time")).toBe("2024-04-18T00:00:00.000Z");
  expect(url.searchParams.get("end_time")).toBe("2026-04-27T23:59:59.999Z");
}

test("preserves filters when navigating between dashboard tabs", async ({ page }) => {
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
        devices: [{ device_id: "device-1", name: "mattia" }],
      }),
    });
  });

  await page.route("**/api/classifications?*", async (route) => {
    const url = new URL(route.request().url());

    assertFilteredRequest(url);

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

    assertFilteredRequest(url);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        count: observations.length,
      }),
    });
  });

  await page.route("**/api/classifications/taxa_count?*", async (route) => {
    const url = new URL(route.request().url());

    assertFilteredRequest(url);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        counts: taxaCounts,
      }),
    });
  });

  await page.route("**/api/classifications/time_series?*", async (route) => {
    const url = new URL(route.request().url());

    assertFilteredRequest(url);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        counts: [2, 0, 3, 1, 4],
        start_time: url.searchParams.get("start_time"),
        interval_length: Number(url.searchParams.get("interval_length") ?? "1"),
        interval_unit: url.searchParams.get("interval_unit") ?? "d",
      }),
    });
  });

  await page.route("**/api/environment/time_series?*", async (route) => {
    const url = new URL(route.request().url());

    expect(url.searchParams.get("deployment_id")).toBe("dep-123");

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
        interval_unit: url.searchParams.get("interval_unit") ?? "d",
      }),
    });
  });

  await page.goto(`/deployment/dep-123/overview?${filteredQuery}`);

  await expect(page).toHaveTitle("Overview | Sensing Garden Dashboard");
  await expect(page.getByText("Custom Range")).toBeVisible();
  await expect(page.getByText("mattia")).toBeVisible();
  await expect(page.getByText("Species").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /90/ })).toBeVisible();
  await expect(page.getByText("Top species")).toBeVisible();
  await expect(page).toHaveURL(`/deployment/dep-123/overview?${filteredQuery}`);
  await expect(page).toHaveScreenshot("navigate-tabs-overview-page.png", {
    animations: "disabled",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Analytics" }).click();

  await expect(page).toHaveTitle("Analytics | Sensing Garden Dashboard");
  await expect(page).toHaveURL(`/deployment/dep-123/analytics?${filteredQuery}`);
  await expect(page.getByText("Taxa treemap")).toBeVisible();
  await expect(page).toHaveScreenshot("navigate-tabs-analytics-page.png", {
    animations: "disabled",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Observations" }).click();

  await expect(page).toHaveTitle("Observations | Sensing Garden Dashboard");
  await expect(page).toHaveURL(`/deployment/dep-123/observations?${filteredQuery}`);
  await expect(page.locator("table")).toBeVisible();
  await expect(page.locator("table")).toContainText("Vespa crabro");
  await expect(page.locator("table")).toContainText("Tyria jacobaeae");
  await expect(page).toHaveScreenshot("navigate-tabs-observations-page.png", {
    animations: "disabled",
    fullPage: true,
  });
});
