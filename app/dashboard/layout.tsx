import { Sidebar } from "@/components/layouts/dashboard/sidebar";
import { Navbar } from "@/components/layouts/dashboard/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main id="main-content" className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
      </div>
    </div>
  );
}
