import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 border-r border-r-foreground/10 p-4">
            <div className="flex flex-col gap-6">
              <h1 className="text-xl font-bold px-4">Expense Tracker</h1>
              <nav className="flex flex-col gap-2">
                <Link 
                  href="/" 
                  className="p-4 hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/budgets" 
                  className="p-4 hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  Budgets
                </Link>
                <Link 
                  href="/income" 
                  className="p-4 hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  Income
                </Link>
                <Link 
                  href="/expenses" 
                  className="p-4 hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  Expenses
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content area */}
          <div className="flex-1 p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
