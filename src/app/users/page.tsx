import { AdminLayout } from '@/components/dashboard/layout/AdminLayout';
import { UsersTable } from '@/components/dashboard/users/UsersTable';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getAdminUsers } from '@/lib/api-admin';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login');
  }

  const users = await getAdminUsers();

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
          <p className="text-muted-foreground mt-1">Manage system administrators and their access levels.</p>
        </div>
        <Button className="shadow-md shadow-primary/20">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <UsersTable users={users} />
    </AdminLayout>
  );
}
