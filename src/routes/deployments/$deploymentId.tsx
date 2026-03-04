import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AnalyticsData } from "@/components/analytics/AnalyticsData";

export const Route = createFileRoute("/deployments/$deploymentId")({
  component: DeploymentPage,
});

function DeploymentPage() {
  const { deploymentId } = Route.useParams();
  const navigate = useNavigate();

  const lastTab = sessionStorage.getItem(`deployment-${deploymentId}-tab`) as
    | "overview"
    | "analytics"
    | "observations"
    | null;

  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "observations">(
    lastTab || "overview",
  );

  return (
    <main className="flex min-h-screen flex-col gap-6 p-6 pt-16">
      <h1 className="item-center text-2xl font-semibold">Deployment: {deploymentId}</h1>
      <button
        className="text-sm text-white/60 underline underline-offset-4"
        onClick={() => navigate({ to: "/" })}
      >
        ← Back
      </button>

      <div className="mt-4 flex gap-4">
        <button
          className={`rounded px-16 py-2 transition-all duration-200 ${
            activeTab === "overview"
              ? "bg-green-300 text-black"
              : "bg-gray-800 text-gray-400 hover:scale-102 hover:text-white"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          className={`rounded px-16 py-2 transition-all duration-200 ${
            activeTab === "analytics"
              ? "bg-green-300 text-black"
              : "bg-gray-800 text-gray-400 hover:scale-102 hover:text-white"
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>

        <button
          className={`rounded px-16 py-2 transition-all duration-200 ${
            activeTab === "observations"
              ? "bg-green-300 text-black"
              : "bg-gray-800 text-gray-400 hover:scale-102 hover:text-white"
          }`}
          onClick={() => setActiveTab("observations")}
        >
          Observations
        </button>
      </div>

      <div className="mt-6 w-full">
        {activeTab === "overview" && <OverviewData />}
        {activeTab === "analytics" && <AnalyticsData deploymentId={deploymentId} />}
        {activeTab === "observations" && <ObservationsData />}
      </div>
    </main>
  );
}

function OverviewData() {
  return <div>Overview data</div>;
}

function ObservationsData() {
  return <div>Observation data</div>;
}
