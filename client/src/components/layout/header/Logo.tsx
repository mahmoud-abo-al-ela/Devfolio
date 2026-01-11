import { Link } from "wouter";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-xl md:text-2xl font-bold font-heading tracking-tight hover:scale-105 transition-transform"
    >
      Dev<span className="text-primary">Folio</span>
    </Link>
  );
}
