import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LogOut, 
  Menu, 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  PieChart 
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Find Schemes", href: "/schemes", icon: FileText },
    { label: "My Applications", href: "/applications", icon: ClipboardCheck },
    { label: "Awareness Survey", href: "/survey", icon: PieChart },
  ];

  if (user?.email?.includes("admin")) {
    navItems.push({ label: "Admin Analytics", href: "/admin", icon: PieChart });
  }

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold font-display text-lg">G</span>
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-primary hidden sm:inline-block">
              GovScheme<span className="text-foreground">Connect</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`text-sm font-medium transition-colors hover:text-primary ${location === item.href ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logout()}
                className="gap-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Link href="/api/login">
                <Button size="sm" className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Login with Replit
                </Button>
              </Link>
            )}
            
            <button 
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${location === item.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2024 AI-Driven Government Scheme System. Empowering Citizens.</p>
        </div>
      </footer>
    </div>
  );
}
