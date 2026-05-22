import { AdminLayout } from '@/components/dashboard/layout/AdminLayout';
import { VisitorsTable } from '@/components/dashboard/visitors/VisitorsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Search, Filter } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getAdminVisitors } from '@/lib/api-admin';

export default async function VisitorsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login');
  }

  const visitorsResponse = await getAdminVisitors();
  const visitors = visitorsResponse.data || [];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitors Log</h1>
          <p className="text-muted-foreground mt-1">Track unique visitors, IPs, and device information.</p>
        </div>
        <Button className="shadow-md shadow-primary/20">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search IP or Location..." className="pl-9 bg-card/50 border-border/50" />
        </div>
        <Button variant="outline" className="bg-card/50 border-border/50">
          <Filter className="mr-2 h-4 w-4" />
          All Time
        </Button>
      </div>

      <VisitorsTable visitors={visitors} />
    </AdminLayout>
  );
}
