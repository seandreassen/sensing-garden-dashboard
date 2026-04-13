interface OtherTaxaItem {
  name: string;
  count: number;
}

interface TaxaTreemapTooltipItem {
  name: string;
  count: number;
  items?: OtherTaxaItem[];
}

const OTHER_PREVIEW_LIMIT = 8;

function TaxaTreemapTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TaxaTreemapTooltipItem }>;
}) {
  if (!active || !payload?.[0]?.payload) {
    return null;
  }

  const item = payload[0].payload;
  const otherItems = item.items ?? [];

  return (
    <div
      className="rounded-md border px-3 py-2 shadow-lg"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
        color: "var(--color-foreground)",
      }}
    >
      <p className="text-sm font-semibold">{item.name}</p>
      <p className="text-xs text-muted-foreground">{item.count} detections</p>
      {item.name === "Others" && otherItems.length > 0 && (
        <div className="mt-2 border-t border-border pt-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Includes</p>
          <div className="flex flex-col gap-1 text-xs">
            {otherItems.slice(0, OTHER_PREVIEW_LIMIT).map((otherItem) => (
              <div key={otherItem.name} className="flex items-center justify-between gap-4">
                <span className="truncate">{otherItem.name}</span>
                <span className="shrink-0 text-muted-foreground">{otherItem.count}</span>
              </div>
            ))}
            {otherItems.length > OTHER_PREVIEW_LIMIT && (
              <p className="pt-1 text-xs text-muted-foreground">
                +{otherItems.length - OTHER_PREVIEW_LIMIT} more taxa
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { TaxaTreemapTooltip };
