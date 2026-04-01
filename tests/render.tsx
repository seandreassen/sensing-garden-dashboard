import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";

function renderWithRootProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const rootRoute = createRootRoute({
    component: () => ui,
  });

  const router = createRouter({
    routeTree: rootRoute,
    context: { queryClient },
    history: createMemoryHistory(),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

export { renderWithRootProviders };
