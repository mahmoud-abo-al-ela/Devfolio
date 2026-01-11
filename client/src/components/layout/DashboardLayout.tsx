import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Menu,
  Home,
  Code,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FolderKanban, label: "Projects", href: "/dashboard/projects" },
    { icon: Code, label: "Skills", href: "/dashboard/skills" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const Sidebar = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className={cn("p-6 transition-all", isCollapsed && "px-3")}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">DF</span>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold font-heading tracking-tight text-sidebar-foreground">
              Dev<span className="text-primary">Folio</span>
            </h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1">
              Admin Dashboard
            </p>
          </>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "p-4 mt-auto border-t border-sidebar-border",
          isCollapsed && "px-2"
        )}
      >
        <Link href="/">
          <Button
            variant="outline"
            className={cn(
              "w-full gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed ? "justify-center px-0" : "justify-start"
            )}
            title={isCollapsed ? "Back to Site" : undefined}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Back to Site</span>}
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:block fixed h-full z-30 transition-all duration-300",
            collapsed ? "w-20" : "w-64"
          )}
        >
          <Sidebar isCollapsed={collapsed} />

          {/* Collapse Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "cursor-pointer absolute -right-3 top-6 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar hover:bg-sidebar-accent shadow-md transition-all",
              "hidden md:flex items-center justify-center"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden bg-sidebar/95 backdrop-blur-sm border border-sidebar-border hover:bg-sidebar-accent shadow-lg touch-manipulation"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-64 border-r border-sidebar-border bg-sidebar"
          >
            <Sidebar isCollapsed={false} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 min-h-screen overflow-y-auto transition-all duration-300",
            collapsed ? "md:ml-20" : "md:ml-64"
          )}
        >
          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8 pt-16 md:pt-8">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
