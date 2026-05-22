import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileEdit, Eye, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

const activities = [
  { id: 1, action: 'New One-Time View page published', subject: 'IP: 192.168.1.104', time: '10 mins ago', icon: FileEdit, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 2, action: 'Visitor accessed pinned page', subject: '/welcome', time: '1 hour ago', icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 3, action: 'Page soft-deleted by system (Expired)', subject: '/temp-note-99', time: '2 hours ago', icon: Trash2, color: 'text-destructive', bg: 'bg-destructive/10' },
  { id: 4, action: 'Admin user logged in', subject: 'admin@blankpage.com', time: '4 hours ago', icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/10' },
];

export function RecentActivity() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Activity Feed</CardTitle>
        <CardDescription>Latest events happening across the Blank Page platform.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {activities.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{item.action}</p>
                <p className="text-sm text-muted-foreground">{item.subject}</p>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {item.time}
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-6 group">
          View Full Log
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
