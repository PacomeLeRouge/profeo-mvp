import { loadTutorDashboard } from "@/lib/data/dashboard";
import { TutorDashboardClient } from "./TutorDashboardClient";

export default async function TutorDashboardPage() {
  const data = await loadTutorDashboard();
  return <TutorDashboardClient initialData={data} />;
}
