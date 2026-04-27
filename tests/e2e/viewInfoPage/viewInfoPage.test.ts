import { expect, test } from "@playwright/test";

test.use({ locale: "en-US", timezoneId: "UTC" });

test("shows current info page", async ({ page }) => {
  await page.route("**/api/deployments/dep-123*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        deployment: {
          deployment_id: "dep-123",
          name: "Everything Deployment!",
          description: "This deployments contains all devices as of 9th of April 2026",
          start_time: "2025-01-01",
          end_time: null,
          model_id: "model-1",
          location_name: "Test Location",
          image_url:
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'><rect width='1200' height='700' fill='%232f4f2f'/><rect x='0' y='450' width='1200' height='250' fill='%235f7f4f'/><path d='M680 700 L790 340 L900 700 Z' fill='%2390b77d'/><path d='M180 700 C270 560 360 500 470 460 C560 430 630 420 760 420 L760 700 Z' fill='%23689257'/><circle cx='930' cy='210' r='120' fill='%23486a38'/><circle cx='1040' cy='170' r='95' fill='%23597d46'/><circle cx='780' cy='150' r='85' fill='%2367884f'/></svg>",
        },
        devices: [
          { device_id: "device-1", name: "b8f2ed92a70e5df3" },
          { device_id: "device-2", name: "c670541e-3ffb-4e56-92af-4f3e8412cba2" },
          { device_id: "device-3", name: "d590bf3c30b2cf25" },
          { device_id: "device-4", name: "deniz-test-1" },
          { device_id: "device-5", name: "dot01" },
          { device_id: "device-6", name: "e73325dab87ec077" },
        ],
      }),
    });
  });

  await page.route("**/api/deployments*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        deployments: [
          {
            deployment_id: "dep-123",
            name: "Everything Deployment!",
            start_time: "2025-01-01",
            end_time: null,
          },
          {
            deployment_id: "dep-1234",
            name: "New Deployment",
            start_time: "2025-01-01",
            end_time: null,
          },
          {
            deployment_id: "dep-12345",
            name: "Fresh Deployment",
            start_time: "2025-01-01",
            end_time: "2026-01-01",
          },
        ],
        count: 3,
        next_token: "",
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
    "/deployment/dep-123/info?rangePreset=custom&startDate=2025-06-01&endDate=2025-06-30",
  );

  await expect(page).toHaveTitle("Info | Sensing Garden Dashboard");
  await expect(page.getByText("Custom Range")).toBeVisible();
  await expect(page.getByRole("link", { name: "Everything Deployment!" })).toBeVisible();
  await expect(page.getByText("Deployment Information for: Everything Deployment!")).toBeVisible();
  await expect(
    page.getByText("This deployments contains all devices as of 9th of April 2026"),
  ).toBeVisible();
  await expect(page.getByText("Deployment Picture")).toBeVisible();
  await expect(page.getByText("Connected hubs")).toBeVisible();
  await expect(page.getByText("Deployment location")).toBeVisible();
  await expect(page.getByText("Missing VITE_GOOGLE_MAPS_API_KEY")).toBeVisible();

  await expect(page).toHaveScreenshot("view-info-page.png", {
    animations: "disabled",
    fullPage: true,
  });
});
