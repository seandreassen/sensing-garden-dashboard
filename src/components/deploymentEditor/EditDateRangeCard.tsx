import { useState } from "react";

import { Card, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { useDirtyValueTracker } from "@/lib/hooks/useDirtyValueTracker";

function EditDateRangeCard({
  initialStartDate = "",
  initialEndDate = "",
  onChange,
}: {
  initialStartDate?: string;
  initialEndDate?: string;
  onChange?: (startDate: string, endDate: string | null) => void;
}) {
  const [hasEndDate, setHasEndDate] = useState(!!initialEndDate);
  const {
    value: startDate,
    setValue: setStartDate,
    isDirty: isStartDirty,
  } = useDirtyValueTracker(initialStartDate);
  const {
    value: endDate,
    setValue: setEndDate,
    isDirty: isEndDirty,
  } = useDirtyValueTracker(initialEndDate);

  const isDirty = isStartDirty || isEndDirty || hasEndDate !== !!initialEndDate;

  function handleStartChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(e.target.value);
    onChange?.(e.target.value, hasEndDate ? endDate : null);
  }

  function handleEndChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEndDate(e.target.value);
    onChange?.(startDate, e.target.value);
  }

  const labelClass = "text-sm text-muted-foreground";
  const inputClass =
    "w-full rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring";

  return (
    <Card>
      <CardTitle className={`px-4 text-center ${isDirty ? "text-primary" : ""}`}>
        Date Range
      </CardTitle>
      <div className="flex flex-col gap-3 px-4 pt-1">
        <div className="flex flex-col gap-1">
          <label htmlFor="start-date" className={labelClass}>
            Start date
          </label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={handleStartChange}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label htmlFor="has-end-date" className={labelClass}>
              End date
            </label>
            <Checkbox
              id="has-end-date"
              checked={hasEndDate}
              onCheckedChange={(checked) => {
                setHasEndDate(!!checked);
                onChange?.(startDate, checked ? endDate : null);
              }}
            />
          </div>
          <Input
            type="date"
            value={endDate}
            onChange={handleEndChange}
            disabled={!hasEndDate}
            className={`${inputClass} ${!hasEndDate ? "cursor-not-allowed opacity-40" : ""}`}
          />
        </div>
      </div>
    </Card>
  );
}

export { EditDateRangeCard };
