import { createFileRoute } from "@tanstack/react-router";
import { Products } from "./_app.dashboard.products";

export const Route = createFileRoute("/_app/dashboard/my-products")({
  head: () => ({ meta: [{ title: "My Products — KOSMO" }] }),
  component: Products,
});
