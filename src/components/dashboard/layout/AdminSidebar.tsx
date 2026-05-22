'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Globe,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutModal } from '../auth/LogoutModal';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Published Pages', path: '/pages', icon: FileText },
  { name: 'Visitors Log', path: '/visitors', icon: Globe },

  { name: 'Users', path: '/users', icon: Users },
  { name: 'Subscribers', path: '/subscribers', icon: Mail },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <>
      <LogoutModal isOpen={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen} />
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-xl border-r border-border hidden md:flex flex-col transition-all duration-300">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/50">
          <ShieldCheck className="w-6 h-6 text-primary mr-3" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            AdminPro
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer group">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@blankpage.com</p>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
