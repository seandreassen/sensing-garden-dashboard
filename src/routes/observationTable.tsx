import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { columns, type Observation } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/data-table";
export const Route = createFileRoute("/observationTable")({
  component: DemoPage,
});

{
  /*Component showing table of observation. Sorting by timestamp and pagination is as of now done client side
  Made with shadcn components using tanstack table functionality. 
  Customized shadcn components in @/components/observationsTable*/
}
async function getData(): Promise<Observation[]> {
  const res = await fetch("https://api.sensinggarden.com/v1/classifications", {
    headers: {
      "X-API-Key": "your-api-key",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch observations");
  }

  const json = await res.json();

  return json.items.map(
    (item: Observation): Observation => ({
      image_url: item.image_url,
      image_bucket: item.image_bucket,
      image_key: item.image_key,

      species: item.species,
      genus: item.genus,
      family: item.family,
      species_confidence: Number(item.species_confidence),
      genus_confidence: Number(item.genus_confidence),
      family_confidence: Number(item.family_confidence),
      timestamp: item.timestamp,
      device_id: item.device_id,
      model_id: item.model_id,
    }),
  );
}

function DemoPage() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["observations"],
    queryFn: getData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
  const memoizedData = useMemo(() => data, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading data{(error as Error).message}</div>;
  }
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={memoizedData} />
    </div>
  );
}
