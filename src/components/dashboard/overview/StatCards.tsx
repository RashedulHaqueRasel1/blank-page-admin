import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Globe, FileText, Activity } from 'lucide-react';

export interface StatsData {
  totalVisitors: number;
  totalVisits: number;
  publishedPages: number;
  registeredAdmins: number;
}

interface StatCardsProps {
  data: StatsData;
}

export function StatCards({ data }: StatCardsProps) {
  const stats = [
    {
      title: "Total Unique Visitors",
      value: data.totalVisitors.toLocaleString(),
      change: "All time",
      trend: "neutral",
      icon: Globe,
      description: "across platform"
    },
    {
      title: "Published Pages",
      value: data.publishedPages.toLocaleString(),
      change: "Total active",
      trend: "neutral",
      icon: FileText,
      description: "across platform"
    },
    {
      title: "Total Page Views",
      value: data.totalVisits.toLocaleString(),
      change: "All time",
      trend: "neutral",
      icon: Activity,
      description: "across platform"
    },
    {
      title: "Registered Admins",
      value: data.registeredAdmins.toLocaleString(),
      change: "System Secure",
      trend: "neutral",
      icon: Users,
      description: "active accounts"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 shadow-sm hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {stat.title}
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className={stat.trend === 'up' ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}>
                {stat.change}
              </span>
              <span className="ml-1">{stat.description}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
