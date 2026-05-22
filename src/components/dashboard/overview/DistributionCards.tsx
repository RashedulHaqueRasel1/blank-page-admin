import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Monitor, Globe, MonitorSmartphone, PieChart } from 'lucide-react';

interface DistributionProps {
  devices: Record<string, number>;
  browsers: Record<string, number>;
  countries: Record<string, number>;
  os: Record<string, number>;
}

export function DistributionCards({ data }: { data: DistributionProps }) {
  const totalDevices = Object.values(data.devices).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Device Distribution */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <MonitorSmartphone className="w-4 h-4 text-primary" /> Device Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-2">
            {Object.entries(data.devices).map(([name, count]) => (
              <div key={name} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {name === 'Mobile' ? <Smartphone className="w-3 h-3 text-muted-foreground" /> : <Monitor className="w-3 h-3 text-muted-foreground" />}
                    {name}
                  </span>
                  <span className="text-muted-foreground">{count} ({totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0}%)</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${totalDevices > 0 ? (count / totalDevices) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Browser Distribution */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <PieChart className="w-4 h-4 text-blue-500" /> Browsers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mt-2">
            {Object.entries(data.browsers).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, count]) => (
              <div key={name} className="flex justify-between items-center text-sm p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <span className="font-medium">{name}</span>
                <span className="text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operating Systems */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Monitor className="w-4 h-4 text-emerald-500" /> Operating Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mt-2">
            {Object.entries(data.os).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, count]) => (
              <div key={name} className="flex justify-between items-center text-sm p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <span className="font-medium">{name}</span>
                <span className="text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Countries */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Globe className="w-4 h-4 text-rose-500" /> Top Regions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mt-2">
            {Object.entries(data.countries).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, count]) => (
              <div key={name} className="flex justify-between items-center text-sm p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <span className="font-medium truncate max-w-[120px]" title={name}>{name}</span>
                <span className="text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
