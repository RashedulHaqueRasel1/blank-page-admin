import { AdminLayout } from '@/components/dashboard/layout/AdminLayout';
import { StatCards } from '@/components/dashboard/overview/StatCards';
import { DistributionCards } from '@/components/dashboard/overview/DistributionCards';
import { RecentActivity } from '@/components/dashboard/overview/RecentActivity';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getAdminStats, getAdminPages, getAdminUsers } from '@/lib/api-admin';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch data concurrently for dashboard
  const [statsData, pages, users] = await Promise.all([
    getAdminStats(),
    getAdminPages(),
    getAdminUsers()
  ]);

  const stats = {
    totalVisitors: statsData?.totalVisitors || 0,
    totalVisits: statsData?.totalVisits || 0,
    publishedPages: pages?.length || 0,
    registeredAdmins: users?.length || 0,
  };

  const distribution = {
    devices: statsData?.deviceDistribution || {},
    browsers: statsData?.browserDistribution || {},
    countries: statsData?.countryDistribution || {},
    os: statsData?.osDistribution || {}
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time statistics and analytics for Blank Page infrastructure.</p>
        </div>
        <Button className="shadow-md shadow-primary/20">
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <StatCards data={stats} />

      <div className="mt-6">
        <DistributionCards data={distribution} />
      </div>

      <div className="mt-6">
        <RecentActivity />
      </div>
    </AdminLayout>
  );
}
