'use client';

import { useEffect, useState } from 'react';
import { Search, Bell, Menu, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogoutModal } from '../auth/LogoutModal';

export function AdminHeader() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <>
      <LogoutModal isOpen={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen} />
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300">
      <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-muted-foreground md:hidden hover:bg-secondary">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-border/50 md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Search</label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground" aria-hidden="true" />
          <Input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-10 pr-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 sm:text-sm"
            placeholder="Search across Blank Page..."
            type="search"
            name="search"
          />
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative group">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background"></span>
          </Button>

          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground group">
              <span className="sr-only">Toggle theme</span>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 transition-transform group-hover:rotate-45" />
              ) : (
                <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
              )}
            </Button>
          )}

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border/50" aria-hidden="true" />

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">AD</AvatarFallback>
                </Avatar>
              </Button>
            } />
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Super Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@blankpage.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">System Logs</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    </>
  );
}
