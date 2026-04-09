import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <main className="w-full max-w-lg mx-auto h-full min-h-screen relative shadow-sm bg-white overflow-x-hidden">
        {children}
        <BottomNav />
      </main>
    </div>
  );
}
