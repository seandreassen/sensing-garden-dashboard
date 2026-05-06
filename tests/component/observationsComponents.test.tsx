import type { ButtonHTMLAttributes, ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { PaginationControls } from "@/components/observations/PaginationControls";

vi.mock("@/components/ui/Button", () => ({
  Button: ({
    children,
    className,
    size: _size,
    variant: _variant,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    size?: string;
    variant?: string;
  }) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

test("renders pagination state and disables previous on first page", async () => {
  const onPageChange = vi.fn();
  const { getByRole, getByText } = await render(
    <PaginationControls
      isCountError={false}
      isCountLoading={false}
      limit={10}
      onPageChange={onPageChange}
      pageIndex={0}
      rowCount={25}
    />,
  );

  await expect.element(getByText(/Page\s+1\s+of 3/)).toBeInTheDocument();
  await expect.element(getByText(/Rows\s+1\s+-\s+10\s+of\s+25/)).toBeInTheDocument();
  await expect.element(getByRole("button", { name: "Previous" })).toBeDisabled();
  await expect.element(getByRole("button", { name: "Next" })).not.toBeDisabled();

  await getByRole("button", { name: "Next" }).click();

  expect(onPageChange).toHaveBeenCalledWith("forward");
});

test("renders pagination loading and error states", async () => {
  const onPageChange = vi.fn();
  const { getByText, rerender } = await render(
    <PaginationControls
      isCountError={false}
      isCountLoading
      limit={10}
      onPageChange={onPageChange}
      pageIndex={0}
      rowCount={0}
    />,
  );

  await expect.element(getByText(/Page\s+0\s+of \.\.\./)).toBeInTheDocument();
  await expect.element(getByText("Loading...")).toBeInTheDocument();

  await rerender(
    <PaginationControls
      isCountError
      isCountLoading={false}
      limit={10}
      onPageChange={onPageChange}
      pageIndex={0}
      rowCount={0}
    />,
  );

  await expect.element(getByText(/Page\s+0\s+of \?/)).toBeInTheDocument();
  await expect.element(getByText("Error fetching row count.")).toBeInTheDocument();
});
