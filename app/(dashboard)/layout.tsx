import Navbar from "@/components/nav/Navbar";
import AIChatWidget from "@/components/ai/AIChatWidget";
import { WatchlistProvider } from "@/contexts/WatchlistContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WatchlistProvider>
      <Navbar />
      <main style={{ paddingBottom: 88 /* space for AI widget */ }}>
        {children}
      </main>
      <AIChatWidget />
    </WatchlistProvider>
  );
}
