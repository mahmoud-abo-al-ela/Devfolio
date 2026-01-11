import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  name: string;
  views: number;
}

interface ProfileViewsChartProps {
  data: ChartDataPoint[];
}

export function ProfileViewsChart({ data }: ProfileViewsChartProps) {
  return (
    <Card className="lg:col-span-4 bg-card border-white/5">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Profile Views</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 pr-2 sm:pr-6">
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                cursor={{ fill: "hsl(var(--primary)/0.1)" }}
              />
              <Bar
                dataKey="views"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
