"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, XCircle, Globe, Smartphone, Monitor, Eye, Clock, Ban } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { deleteSubscriberAdmin, updateSubscriberAdmin } from '@/lib/actions';

interface SubscriberItem {
  id: string;
  email: string;
  isSubscribed: boolean;
  isVerified: boolean;
  isRegisteredUser: boolean;
  ip: string;
  userAgent: string;
  country: string;
  city: string;
  subscriptionStartDate: string;
  subscriptionEndDate?: string;
  unsubscribedAt?: string;
  createdAt: string;
}

interface SubscribersTableProps {
  subscribers: SubscriberItem[];
}

export function SubscribersTable({ subscribers }: SubscribersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSub, setSelectedSub] = useState<SubscriberItem | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(subscribers.length / ITEMS_PER_PAGE);
  const paginatedSubs = subscribers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this subscriber?")) return;
    setIsProcessing(id);
    try {
      await deleteSubscriberAdmin(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleVerify = async (id: string) => {
    if (!confirm("Are you sure you want to manually verify this subscriber?")) return;
    setIsProcessing(id);
    try {
      await updateSubscriberAdmin(id, { isVerified: true });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground/80">Subscriber Details</TableHead>
                <TableHead className="font-semibold text-foreground/80">Status</TableHead>
                <TableHead className="font-semibold text-foreground/80">Location</TableHead>
                <TableHead className="font-semibold text-foreground/80">Joined</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSubs.map((sub) => {
                const isMobile = sub.userAgent?.toLowerCase().includes('mobile');
                return (
                  <TableRow key={sub.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> {sub.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {sub.isSubscribed ? <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Active</Badge> : <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px]">Unsubscribed</Badge>}
                        {sub.isVerified && <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">Verified</Badge>}
                        {sub.isRegisteredUser && <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">Registered User</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{sub.city !== 'Unknown' && sub.city !== 'Localhost' ? sub.city : 'Unknown City'}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> {sub.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setSelectedSub(sub)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10" disabled={sub.isVerified || isProcessing === sub.id} onClick={() => handleVerify(sub.id)}>
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" disabled={isProcessing === sub.id} onClick={() => handleDelete(sub.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedSubs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No subscribers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-secondary/20">
          <span className="text-sm text-muted-foreground">Showing page {currentPage} of {totalPages || 1} ({subscribers.length} total)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      <Dialog open={!!selectedSub} onOpenChange={(open) => !open && setSelectedSub(null)}>
        <DialogContent className="w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl">Subscriber Profile</DialogTitle>
            <DialogDescription>Detailed information and lifecycle of this subscriber.</DialogDescription>
          </DialogHeader>
          
          {selectedSub && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Identity</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium text-lg truncate" title={selectedSub.email}>{selectedSub.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Subscribed:</div>
                    <div className="font-medium text-right text-emerald-500">{selectedSub.isSubscribed ? 'Yes' : 'No'}</div>
                    <div className="text-muted-foreground">Email Verified:</div>
                    <div className="font-medium text-right text-blue-500">{selectedSub.isVerified ? 'Yes' : 'No'}</div>
                    <div className="text-muted-foreground">Registered App User:</div>
                    <div className="font-medium text-right text-purple-500">{selectedSub.isRegisteredUser ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Lifecycle Timestamps</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Added to List</span>
                      <span className="font-medium">{new Date(selectedSub.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedSub.subscriptionEndDate && (
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> End Date</span>
                        <span className="font-medium">{new Date(selectedSub.subscriptionEndDate).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedSub.unsubscribedAt && (
                      <div className="flex justify-between items-center text-rose-500">
                        <span className="flex items-center gap-2"><Ban className="w-4 h-4" /> Unsubscribed</span>
                        <span className="font-medium">{new Date(selectedSub.unsubscribedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Technical Origin</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="text-muted-foreground">IP Address:</div>
                    <div className="font-mono text-right">{selectedSub.ip}</div>
                    <div className="text-muted-foreground">Country:</div>
                    <div className="font-medium text-right">{selectedSub.country}</div>
                    <div className="text-muted-foreground">City:</div>
                    <div className="font-medium text-right">{selectedSub.city}</div>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">User Agent String:</div>
                    <div className="text-xs font-mono bg-background p-2 rounded-lg border border-border/50 break-all">
                      {selectedSub.userAgent}
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
