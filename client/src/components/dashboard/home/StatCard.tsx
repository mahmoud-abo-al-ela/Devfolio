import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export function StatCard({
  label,
  value,
  change,
  isPositive,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card
      className="bg-card border-white/5 hover:border-white/10 transition-colors"
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div
          className="text-xl sm:text-2xl font-bold font-heading"
          data-testid={`stat-value-${label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {value}
        </div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          <span
            className={`flex items-center mr-1 ${
              isPositive ? "text-emerald-500" : "text-red-500"
            }`}
          >
            <ArrowUp
              className={`w-3 h-3 mr-0.5 ${!isPositive ? "rotate-180" : ""}`}
            />
            {change}
          </span>
          <span className="hidden sm:inline">from last month</span>
          <span className="sm:hidden">vs last month</span>
        </p>
      </CardContent>
    </Card>
  );
}
