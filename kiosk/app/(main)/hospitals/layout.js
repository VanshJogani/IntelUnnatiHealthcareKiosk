export const metadata = {
  title: 'Empanelled Hospitals',
  description: 'List of hospitals empanelled under Ayushman Bharat PMJAY',
};

export default function HospitalsLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="p-6 border-b border-emerald-700/50">
        <h1 className="text-4xl font-bold">Empanelled Hospitals</h1>
        <p className="text-muted-foreground mt-1">
          List of hospitals empanelled under Ayushman Bharat PMJAY
        </p>
      </header>

      <main className="p-6">{children}</main>

      <footer className="p-6 border-t border-emerald-700/50 text-sm text-muted-foreground text-center">
        © {new Date().getFullYear()} Your Healthcare Platform
      </footer>
    </div>
  );
}
