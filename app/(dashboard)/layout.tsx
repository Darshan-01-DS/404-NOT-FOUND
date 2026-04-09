import Navbar from "@/components/nav/Navbar";
import AIChatWidget from "@/components/ai/AIChatWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ paddingBottom: 88 /* space for AI widget */ }}>
        {children}
      </main>
      <AIChatWidget />
    </>
  );
}
