import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://api.sensinggarden.com/v1";

function useHubs() {
  return useQuery({
    queryKey: ["hubIds"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/devices?limit=100`);
      const data = await res.json();
      const unique = [
        ...new Set<string>(data.items.map((item: { device_id: string }) => item.device_id)),
      ];
      return unique;
    },
  });
}
export { useHubs };
