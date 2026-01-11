import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  mobileMenuOpen: boolean;
  onClick: () => void;
}

export function MobileMenuButton({
  mobileMenuOpen,
  onClick,
}: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      className="md:hidden"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      {mobileMenuOpen ? <X size={36} /> : <Menu size={36} />}
    </Button>
  );
}
