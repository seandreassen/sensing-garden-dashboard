import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { EditDateRangeCard } from "@/components/deploymentEditor/EditDateRangeCard";
import { EditDescriptionCard } from "@/components/deploymentEditor/EditDescriptionCard";
import { EditImageCard } from "@/components/deploymentEditor/EditImageCard";
import { EditNameCard } from "@/components/deploymentEditor/EditNameCard";

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

vi.mock("@/components/ui/Checkbox", () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    ...props
  }: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    onCheckedChange?: (checked: boolean) => void;
  }) => (
    <input
      {...props}
      checked={Boolean(checked)}
      type="checkbox"
      onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
    />
  ),
}));

test("updates deployment name when edited", async () => {
  const onChange = vi.fn();
  const { getByRole } = await render(
    <EditNameCard initialValue="Forest garden" onChange={onChange} />,
  );

  await getByRole("button", { name: /Forest garden/ }).click();
  await getByRole("textbox").fill("Updated garden");

  expect(onChange).toHaveBeenLastCalledWith("Updated garden");
});

test("updates deployment description when edited", async () => {
  const onChange = vi.fn();
  const { getByRole } = await render(
    <EditDescriptionCard initialValue="Original description" onChange={onChange} />,
  );

  await getByRole("button", { name: /Original description/ }).click();
  await getByRole("textbox").fill("Updated description");

  expect(onChange).toHaveBeenLastCalledWith("Updated description");
});

test("updates deployment date range from form controls", async () => {
  const onChange = vi.fn();
  const { getByLabelText } = await render(
    <EditDateRangeCard initialStartDate="2025-06-01" onChange={onChange} />,
  );

  await getByLabelText("Start date").fill("2025-07-01");
  await getByLabelText("End date").click();

  expect(onChange).toHaveBeenCalledWith("2025-07-01", null);
  expect(onChange).toHaveBeenLastCalledWith("2025-07-01", "");
});

test("renders deployment image states", async () => {
  const imageUrl = "https://example.com/deployment.jpg";
  const { getByAltText, getByText, rerender } = await render(<EditImageCard />);

  await expect.element(getByText("No image")).toBeInTheDocument();

  await rerender(<EditImageCard initialUrl={imageUrl} />);

  await expect.element(getByAltText("Preview")).toHaveAttribute("src", imageUrl);
});
