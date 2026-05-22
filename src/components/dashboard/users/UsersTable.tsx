"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCircle, Shield, Eye, Clock, Calendar, LogIn } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  loginCount: number;
  lastLogin: string;
  firstLogin: string;
  createdAt: string;
}

interface UsersTableProps {
  users: UserItem[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground/80">User Details</TableHead>
                <TableHead className="font-semibold text-foreground/80">Role</TableHead>
                <TableHead className="font-semibold text-foreground/80">Status</TableHead>
                <TableHead className="font-semibold text-foreground/80">Engagement</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserCircle className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary'}>
                      {user.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px]">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground"><LogIn className="w-3 h-3" /> {user.loginCount} Logins</span>
                      <span>Last: {new Date(user.lastLogin).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setSelectedUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-secondary/20">
          <span className="text-sm text-muted-foreground">Showing page {currentPage} of {totalPages || 1} ({users.length} total)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl">User Profile</DialogTitle>
            <DialogDescription>Administrative overview of user activity and access.</DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserCircle className="w-10 h-10" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <span className="text-muted-foreground">{selectedUser.email}</span>
                </div>
                <Badge variant="outline" className={`text-sm px-3 py-1 ${selectedUser.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : ''}`}>
                  {selectedUser.role}
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Access & Activity</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1"><LogIn className="w-4 h-4" /> Total Logins</span>
                      <span className="text-2xl font-bold text-primary">{selectedUser.loginCount}</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-border/50">
                      <span className="text-muted-foreground">Account Status</span>
                      <span className={`text-lg font-bold ${selectedUser.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mt-4 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Account Created</span>
                      <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> First Login</span>
                      <span className="font-medium">{new Date(selectedUser.firstLogin).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-500">
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Last Login</span>
                      <span className="font-medium">{new Date(selectedUser.lastLogin).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
