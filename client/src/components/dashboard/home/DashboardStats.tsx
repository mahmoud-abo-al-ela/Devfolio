import { StatCard } from "./StatCard";
import {
  Eye,
  MousePointerClick,
  MessageSquare,
  Briefcase,
  LucideIcon,
} from "lucide-react";

interface Stat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface DashboardStatsProps {
  stats: Stat[];
}

const icons: Record<string, LucideIcon> = {
  "Total Views": Eye,
  "Project Clicks": MousePointerClick,
  "Contact Inquiries": MessageSquare,
  "Active Projects": Briefcase,
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = icons[stat.label] || Eye;
        return (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={Icon}
          />
        );
      })}
    </div>
  );
}
