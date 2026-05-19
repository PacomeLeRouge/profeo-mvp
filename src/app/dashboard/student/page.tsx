import { loadStudentDashboard } from "@/lib/data/dashboard";
import { StudentDashboardClient } from "./StudentDashboardClient";

export default async function StudentDashboardPage() {
  const data = await loadStudentDashboard();
  return <StudentDashboardClient initialData={data} />;
}
