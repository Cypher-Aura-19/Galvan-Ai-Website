import { requireAdmin } from "../auth-guard";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  await requireAdmin();
  return <AdminDashboardClient />;
} 