import { expect, test } from "@playwright/test";

test("shows correct info page", async ({ page }) => {
  await page.route("**/api/deployments/dep-123*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        deployment: {
          deployment_id: "dep-123",
          name: "Test Deployment",
          description: "A test deployment",
          start_time: "2025-01-01",
          end_time: null,
          model_id: "model-1",
          location_name: "Test Location",
        },
        devices: [{ device_id: "device-1", deployment_id: "dep-123" }],
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
            id: "dep-123",
            name: "Test Deployment",
            start_time: "2025-01-01",
            end_time: null,
          },
          {
            id: "dep-1234",
            name: "Test Deployment 2",
            start_time: "2025-01-01",
            end_time: null,
          },
          {
            id: "dep-12345",
            name: "Test Deployment 3",
            start_time: "2025-01-01",
            end_time: "2026-01-01",
          },
        ],
      }),
    });
  });

  await page.goto(
    "/deployment/dep-123/info?rangePreset=custom&startDate=2025-06-01&endDate=2025-06-30",
  );

  await expect(page).toHaveTitle("Info | Sensing Garden Dashboard");
  await expect(page.getByText("This page is not finished yet")).toBeVisible();

  await expect(page).toHaveScreenshot("deployment-info.png");
});
