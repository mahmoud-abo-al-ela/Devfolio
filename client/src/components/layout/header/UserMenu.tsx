import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  name?: string;
  avatar?: string;
}

interface UserMenuProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export function UserMenu({
  isAuthenticated,
  user,
  onLogout,
  onLoginClick,
}: UserMenuProps) {
  if (!isAuthenticated) {
    return null; // Hide login button - auto-redirect happens in ProtectedRoute
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-2 ring-primary/10 hover:ring-primary/30 transition-all p-0"
        >
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
