import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchAnalytics, fetchDailyViews } from "@/lib/api";
import { DashboardStats } from "@/components/dashboard/home/DashboardStats";
import { ProfileViewsChart } from "@/components/dashboard/home/ProfileViewsChart";
import { RecentProjects } from "@/components/dashboard/home/RecentProjects";

export default function DashboardHome() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
  });

  const { data: dailyViews = [] } = useQuery({
    queryKey: ["daily-views"],
    queryFn: () => fetchDailyViews(7),
  });

  // Transform daily views data for the chart
  const chartData =
    dailyViews.length > 0
      ? dailyViews.map((day: any) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          return {
            name: dayName,
            views: day.views,
          };
        })
      : [
          { name: "Mon", views: 0 },
          { name: "Tue", views: 0 },
          { name: "Wed", views: 0 },
          { name: "Thu", views: 0 },
          { name: "Fri", views: 0 },
          { name: "Sat", views: 0 },
          { name: "Sun", views: 0 },
        ];

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number): string => {
    if (!current && !previous) return "0%";
    if (!previous || previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
  };

  const stats = [
    {
      label: "Total Views",
      value: analytics?.totalViews.toLocaleString() || "0",
      change: analytics
        ? calculateChange(
            analytics.totalViews,
            analytics.previousMonthViews || 0
          )
        : "0%",
      isPositive: analytics
        ? analytics.totalViews >= (analytics.previousMonthViews || 0)
        : true,
    },
    {
      label: "Project Clicks",
      value: analytics?.projectClicks.toLocaleString() || "0",
      change: analytics
        ? calculateChange(
            analytics.projectClicks,
            analytics.previousMonthClicks || 0
          )
        : "0%",
      isPositive: analytics
        ? analytics.projectClicks >= (analytics.previousMonthClicks || 0)
        : true,
    },
    {
      label: "Contact Inquiries",
      value: analytics?.contactInquiries.toLocaleString() || "0",
      change: analytics
        ? calculateChange(
            analytics.contactInquiries,
            analytics.previousMonthInquiries || 0
          )
        : "0%",
      isPositive: analytics
        ? analytics.contactInquiries >= (analytics.previousMonthInquiries || 0)
        : true,
    },
    {
      label: "Active Projects",
      value: projects.length.toString(),
      change: "0%",
      isPositive: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading">
          Dashboard Overview
        </h2>
        <span className="text-muted-foreground text-xs sm:text-sm">
          Last updated: Just now
        </span>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <ProfileViewsChart data={chartData} />
        <RecentProjects projects={projects} />
      </div>
    </DashboardLayout>
  );
}
