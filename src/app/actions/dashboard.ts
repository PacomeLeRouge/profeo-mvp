"use server";

import {
  loadStudentDashboard,
  loadTutorDashboard,
} from "@/lib/data/dashboard";

export async function refreshStudentDashboardAction() {
  return loadStudentDashboard();
}

export async function refreshTutorDashboardAction() {
  return loadTutorDashboard();
}
