import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { supabase } from "./lib/supabase";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient, supabase },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
