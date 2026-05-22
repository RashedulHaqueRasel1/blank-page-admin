"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Ban, MapPin, Monitor, Smartphone, Globe, Calendar, Clock, Laptop } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { deleteVisitorAdmin } from '@/lib/actions';

interface VisitorItem {
  id: string;
  ip: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  country?: string;
  city?: string;
  visitCount?: number;
  firstVisit?: string;
  lastVisit?: string;
  createdAt?: string;
}

interface VisitorsTableProps {
  visitors: VisitorItem[];
}

export function VisitorsTable({ visitors }: VisitorsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(visitors.length / ITEMS_PER_PAGE);
  const paginatedVisitors = visitors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this visitor record?")) return;
    setIsDeleting(id);
    try {
      await deleteVisitorAdmin(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground/80">IP Address</TableHead>
                <TableHead className="font-semibold text-foreground/80">Location</TableHead>
                <TableHead className="font-semibold text-foreground/80">Device Info</TableHead>
                <TableHead className="font-semibold text-foreground/80">Visits</TableHead>
                <TableHead className="font-semibold text-foreground/80">Last Seen</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVisitors.map((visitor) => (
                <TableRow key={visitor.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{visitor.ip}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-muted-foreground" /> {visitor.city || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> {visitor.country || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1">
                        {visitor.deviceType === 'Mobile' ? <Smartphone className="w-3 h-3 text-muted-foreground" /> : <Monitor className="w-3 h-3 text-muted-foreground" />}
                        {visitor.deviceType || 'Desktop'}
                      </span>
                      <span className="text-xs text-muted-foreground">{visitor.os} • {visitor.browser}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50">{visitor.visitCount || 1}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(visitor.lastVisit || Date.now()).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setSelectedVisitor(visitor)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" disabled={isDeleting === visitor.id} onClick={() => handleDelete(visitor.id)}>
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedVisitors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No visitors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-secondary/20">
          <span className="text-sm text-muted-foreground">Showing page {currentPage} of {totalPages || 1} ({visitors.length} total)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      <Dialog open={!!selectedVisitor} onOpenChange={(open) => !open && setSelectedVisitor(null)}>
        <DialogContent className="w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl">Visitor Details</DialogTitle>
            <DialogDescription>Comprehensive activity log for this visitor.</DialogDescription>
          </DialogHeader>
          
          {selectedVisitor && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Network</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="font-mono text-lg">{selectedVisitor.ip}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                    <div className="text-muted-foreground">Country:</div>
                    <div className="font-medium text-right">{selectedVisitor.country}</div>
                    <div className="text-muted-foreground">City:</div>
                    <div className="font-medium text-right">{selectedVisitor.city}</div>
                    <div className="text-muted-foreground">Referrer:</div>
                    <div className="font-medium text-right truncate" title={selectedVisitor.referrer}>{selectedVisitor.referrer || 'Direct Traffic'}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Device Profile</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Platform:</div>
                    <div className="font-medium text-right flex items-center justify-end gap-2">
                      {selectedVisitor.deviceType === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                      {selectedVisitor.deviceType || 'Desktop'}
                    </div>
                    <div className="text-muted-foreground">OS:</div>
                    <div className="font-medium text-right">{selectedVisitor.os}</div>
                    <div className="text-muted-foreground">Browser:</div>
                    <div className="font-medium text-right">{selectedVisitor.browser}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Raw User Agent:</div>
                    <div className="text-xs font-mono bg-background p-2 rounded-lg border border-border/50 break-all">
                      {selectedVisitor.userAgent}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Engagement Tracking</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Total Visits</span>
                    <Badge variant="default" className="text-lg px-3 py-1 shadow-md">{selectedVisitor.visitCount}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4" /> First Visit:</div>
                    <div className="font-medium text-right">{new Date(selectedVisitor.firstVisit || selectedVisitor.createdAt || Date.now()).toLocaleString()}</div>
                    <div className="text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4" /> Last Seen:</div>
                    <div className="font-medium text-right text-emerald-500">{new Date(selectedVisitor.lastVisit || Date.now()).toLocaleString()}</div>
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
