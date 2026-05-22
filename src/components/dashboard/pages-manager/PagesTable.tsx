"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Trash2, Clock, Eye, Edit2, ShieldAlert, FileText, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { deletePageAdmin } from '@/lib/actions';

interface PageItem {
  id: string;
  title: string;
  content: string;
  customUrl: string;
  oneTimeView: boolean;
  isEditable: boolean;
  password?: string | null;
  pinned: boolean;
  authorIp: string;
  authorId: string;
  authorVisits: number;
  viewerLog: { ip: string, visitCount: number, lastVisit: string }[];
  editorLog: { 
    ip: string, 
    visitCount: number,
    edits?: { added: string, removed: string, editedAt: string }[]
  }[];
  authorEditsLog: {
    editedAt: string,
    ip: string,
    diff?: { added: string, removed: string },
    contentLength?: number
  }[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
  isDeleted: boolean;
}

interface PagesTableProps {
  pages: PageItem[];
}

export function PagesTable({ pages }: PagesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState<PageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(pages.length / ITEMS_PER_PAGE);
  const paginatedPages = pages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = async (customUrl: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    setIsDeleting(customUrl);
    try {
      await deletePageAdmin(customUrl);
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
                <TableHead className="font-semibold text-foreground/80">Page Details</TableHead>
                <TableHead className="font-semibold text-foreground/80">Configuration</TableHead>
                <TableHead className="font-semibold text-foreground/80">Engagement</TableHead>
                <TableHead className="font-semibold text-foreground/80">Timestamps</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPages.map((page) => {
                const totalViews = (page.viewerLog || []).reduce((acc, log) => acc + (log.visitCount || 0), 0) + (page.authorVisits || 0);
                const totalEditors = (page.editorLog || []).length;
                
                return (
                  <TableRow key={page.id} className={`hover:bg-muted/50 transition-colors ${page.isDeleted ? 'opacity-50 grayscale' : ''}`}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{page.title || 'Untitled'}</span>
                        <a href={`/${page.customUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">/{page.customUrl}</a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {page.oneTimeView && <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">One-Time</Badge>}
                        {page.pinned && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">Pinned</Badge>}
                        {page.password && <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px]">Password</Badge>}
                        {page.isEditable ? <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">Editable</Badge> : <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20 text-[10px]">Locked</Badge>}
                        {page.isDeleted && <Badge variant="destructive" className="text-[10px]">Deleted</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-foreground"><Eye className="w-3 h-3" /> {totalViews} Views</span>
                        <span className="flex items-center gap-1"><Edit2 className="w-3 h-3" /> {totalEditors} Editors</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground gap-1">
                        <span>Created: {new Date(page.createdAt).toLocaleDateString()}</span>
                        {page.expiresAt && <span className="flex items-center gap-1 text-amber-500/80"><Clock className="w-3 h-3" /> {new Date(page.expiresAt).toLocaleDateString()}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setSelectedPage(page)}>
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" disabled={page.isDeleted || isDeleting === page.customUrl} onClick={() => handleDelete(page.customUrl)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedPages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No pages found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-secondary/20">
          <span className="text-sm text-muted-foreground">Showing page {currentPage} of {totalPages || 1} ({pages.length} total)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      <Dialog open={!!selectedPage} onOpenChange={(open) => !open && setSelectedPage(null)}>
        <DialogContent className="w-full sm:max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl">Page Details</DialogTitle>
            <DialogDescription>Advanced configuration, content preview, and detailed logs.</DialogDescription>
          </DialogHeader>
          
          {selectedPage && (
            <div className="space-y-6">
              
              {/* Content Preview */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><FileText className="w-4 h-4" /> Content Preview</h4>
                <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 max-h-60 overflow-y-auto prose prose-sm dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: selectedPage.content || '<span class="text-muted-foreground italic">No content</span>' }} />
                </div>
              </div>

              {/* Author & Core Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Core Info</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-muted-foreground">Author ID:</div>
                    <div className="font-medium text-right truncate" title={selectedPage.authorId}>{selectedPage.authorId}</div>
                    
                    <div className="text-muted-foreground">User ID:</div>
                    <div className="font-medium text-right truncate" title={selectedPage.userId}>{selectedPage.userId || 'N/A'}</div>

                    <div className="text-muted-foreground">Author IP:</div>
                    <div className="font-mono text-right">{selectedPage.authorIp}</div>
                    
                    <div className="text-muted-foreground">Author Visits:</div>
                    <div className="font-medium text-right">{selectedPage.authorVisits || 0}</div>
                    
                    <div className="text-muted-foreground">Created At:</div>
                    <div className="font-medium text-right">{new Date(selectedPage.createdAt).toLocaleString()}</div>
                    
                    <div className="text-muted-foreground">Updated At:</div>
                    <div className="font-medium text-right">{new Date(selectedPage.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Configuration</h4>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="flex flex-col gap-3">
                    {selectedPage.password && (
                      <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-sm font-medium">Protected by Password: <span className="font-mono ml-2 opacity-80">{selectedPage.password}</span></span>
                      </div>
                    )}
                    {selectedPage.oneTimeView && (
                      <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">One-Time View Enabled (Self-Destructs)</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div className="text-muted-foreground">Pinned:</div>
                      <div className="font-medium text-right">{selectedPage.pinned ? 'Yes' : 'No'}</div>
                      <div className="text-muted-foreground">Editable by Public:</div>
                      <div className="font-medium text-right">{selectedPage.isEditable ? 'Yes' : 'No'}</div>
                      {selectedPage.expiresAt && (
                        <>
                          <div className="text-muted-foreground">Expires At:</div>
                          <div className="font-medium text-right text-amber-500">{new Date(selectedPage.expiresAt).toLocaleString()}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Viewer Logs */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Viewer Logs (Top 5)</h4>
                <div className="bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
                  {(selectedPage.viewerLog || []).slice(0, 5).map((log, i) => (
                    <div key={i} className={`p-3 text-sm flex flex-col gap-2 ${i > 0 ? 'border-t border-border/50' : ''}`}>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xs break-all max-w-[70%] text-muted-foreground">{log.ip}</span>
                        <Badge variant="secondary" className="px-2 shrink-0">{log.visitCount} views</Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground/70">Last Visit: {new Date(log.lastVisit).toLocaleString()}</div>
                    </div>
                  ))}
                  {(!selectedPage.viewerLog || selectedPage.viewerLog.length === 0) && (
                    <div className="p-4 text-center text-sm text-muted-foreground">No viewer logs available.</div>
                  )}
                </div>
              </div>

              {/* Author Edits Log */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><History className="w-4 h-4" /> Author Edits Log</h4>
                <div className="bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
                  {(selectedPage.authorEditsLog || []).map((log, i) => (
                    <div key={i} className={`p-3 text-sm flex flex-col gap-2 ${i > 0 ? 'border-t border-border/50' : ''}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">{new Date(log.editedAt).toLocaleString()}</span>
                        <span className="font-mono text-xs text-muted-foreground">{log.ip}</span>
                      </div>
                      {log.contentLength !== undefined && (
                         <div className="text-xs text-muted-foreground">Content Length: {log.contentLength} chars</div>
                      )}
                      {log.diff && (log.diff.added || log.diff.removed) && (
                        <div className="mt-2 bg-background/50 rounded p-2 text-xs font-mono break-words">
                          {log.diff.added && <div className="text-emerald-500 mb-1">+ {log.diff.added}</div>}
                          {log.diff.removed && <div className="text-rose-500">- {log.diff.removed}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!selectedPage.authorEditsLog || selectedPage.authorEditsLog.length === 0) && (
                    <div className="p-4 text-center text-sm text-muted-foreground">No author edits recorded.</div>
                  )}
                </div>
              </div>

              {/* Public Editor Logs */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Public Editor Logs</h4>
                <div className="bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
                  {(selectedPage.editorLog || []).map((log, i) => (
                    <div key={i} className={`p-3 text-sm flex flex-col gap-3 ${i > 0 ? 'border-t border-border/50' : ''}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs break-all text-muted-foreground max-w-[70%]">{log.ip}</span>
                        <Badge variant="outline" className="px-2 shrink-0">{log.visitCount} edits</Badge>
                      </div>
                      
                      {log.edits && log.edits.length > 0 && (
                        <div className="flex flex-col gap-2 mt-1">
                          {log.edits.map((edit, j) => (
                            <div key={j} className="bg-background/50 rounded-md p-2 text-xs border border-border/30">
                               <div className="text-[10px] text-muted-foreground mb-1">{new Date(edit.editedAt).toLocaleString()}</div>
                               <div className="font-mono break-words max-h-32 overflow-y-auto">
                                 {edit.added && <div className="text-emerald-500 mb-1">+ {edit.added}</div>}
                                 {edit.removed && <div className="text-rose-500">- {edit.removed}</div>}
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!selectedPage.editorLog || selectedPage.editorLog.length === 0) && (
                    <div className="p-4 text-center text-sm text-muted-foreground">No public editor logs available.</div>
                  )}
                </div>
              </div>
              
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
