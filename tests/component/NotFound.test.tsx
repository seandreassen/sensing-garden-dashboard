import { renderWithRootProviders } from "@tests/render";
import { expect, test } from "vitest";

import { NotFound } from "@/components/NotFound";

test("renders NotFound component", async () => {
  const { getByRole } = await renderWithRootProviders(<NotFound />);

  await expect.element(getByRole("heading", { name: "404 - Page Not Found" })).toBeInTheDocument();
});
