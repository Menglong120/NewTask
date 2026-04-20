'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  MoreHorizontal,
  Clock,
  Trash2,
  Layers,
  Activity,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Issue {
  id: number;
  name: string;
  description: string;
  start_date: string;
  due_date: string;
  progress: number;
  status: { id: number; name: string; title?: string };
  priority: { id: number; name: string; title?: string };
  tracker: { id: number; name: string; title?: string };
  label: { id: number; name: string; title?: string };
  assignee: {
    id: string;
    email: string;
    dis_name: string;
    status: number;
    user?: { id: string; display_name: string; avarta: string; email: string; }
  };
}

interface IssueKanbanBoardProps {
  issues: Issue[];
  statuses: any[];
  priorities: any[];
  onUpdateIssue: (issueId: number, field: string, valueId: string | number) => void;
  onDelete: (issueId: number) => void;
  onViewDetail: (issueId: number) => void;
}

const IssueKanbanBoard: React.FC<IssueKanbanBoardProps> = ({
  issues,
  statuses,
  priorities,
  onUpdateIssue,
  onDelete,
  onViewDetail
}) => {
  const [localIssues, setLocalIssues] = useState<Issue[]>(issues);

  useEffect(() => {
    setLocalIssues(issues);
  }, [issues]);

  const getPriorityColor = (priorityName: string) => {
    const name = priorityName.toLowerCase();
    if (name.includes('high') || name.includes('urgent')) return 'text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]';
    if (name.includes('normal') || name.includes('medium')) return 'text-sky-500 bg-sky-500/10 border-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.1)]';
    if (name.includes('low')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
    return 'text-muted-foreground bg-white/5 border-white/10';
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const issueId = parseInt(draggableId);
    const newStatusId = parseInt(destination.droppableId);

    // Optimistic Update
    const updatedIssues = localIssues.map((i: Issue) => {
      if (i.id === issueId) {
        const newStatus = statuses.find((s: any) => s.id === newStatusId);
        return { ...i, status: newStatus || i.status };
      }
      return i;
    });
    setLocalIssues(updatedIssues);

    if (source.droppableId !== destination.droppableId) {
      onUpdateIssue(issueId, 'status', newStatusId);
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-muted/20">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex p-4 gap-4 h-[calc(100vh-280px)] min-h-[600px]">
          {statuses.map((status: any) => {
            const statusIssues = localIssues.filter((i: Issue) => i.status.id === status.id);

            return (
              <div key={status.id} className="inline-flex flex-col w-72 shrink-0 group/column">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-3 h-10 shrink-0 bg-muted/50 border rounded-md relative overflow-hidden group/header w-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover/header:bg-primary transition-all duration-300" />
                  <div className="flex items-center gap-2 pl-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      statusIssues.length > 0 ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                    )} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {status.name || status.title}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-medium h-5 min-w-[20px] flex justify-center">
                    {statusIssues.length}
                  </Badge>
                </div>

                {/* Column Content */}
                <Droppable droppableId={String(status.id)}>
                  {(provided, snapshot) => (
                    <ScrollArea
                      className={cn(
                        "flex-1 pr-3 -mr-3 transition-colors duration-300",
                        snapshot.isDraggingOver ? "bg-accent/30" : ""
                      )}
                      {...provided.droppableProps}
                    >
                      <div ref={provided.innerRef} className="space-y-3 pb-8 min-h-[100px]">
                        {statusIssues.map((issue: Issue, index: number) => (
                          <Draggable key={issue.id} draggableId={String(issue.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "transition-transform duration-200",
                                  snapshot.isDragging ? "z-50 scale-[1.03]" : ""
                                )}
                              >
                                <Card
                                  className={cn(
                                    "group/card bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md relative overflow-hidden flex flex-col h-auto",
                                    snapshot.isDragging ? "shadow-lg border-primary" : ""
                                  )}
                                  onClick={() => onViewDetail(issue.id)}
                                >
                                  <CardHeader className="p-4 pb-0 space-y-3 relative z-10">
                                    <div className="flex justify-between items-start">
                                      <Badge variant="outline" className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0 border transition-all duration-300", getPriorityColor(issue.priority?.name || ''))}>
                                        {issue.priority?.name}
                                      </Badge>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Move to Status</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          {statuses.map(s => (
                                            <DropdownMenuItem key={s.id} onClick={(e) => { e.stopPropagation(); onUpdateIssue(issue.id, 'status', s.id); }} className="cursor-pointer">
                                              {s.name}
                                            </DropdownMenuItem>
                                          ))}
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(issue.id); }} className="gap-2 text-destructive focus:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" /> Delete Issue
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>

                                    <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">
                                      {issue.name}
                                    </CardTitle>
                                  </CardHeader>

                                  <CardContent className="p-4 pt-1 space-y-3 relative z-10 flex-1">
                                    <div className="flex justify-between items-center text-[10px] uppercase font-bold opacity-70">
                                      <span className="text-muted-foreground italic font-medium">{issue.tracker?.name || 'ISSUE'}</span>
                                      <span className="tabular-nums">{issue.progress || 0}%</span>
                                    </div>
                                    <Progress value={issue.progress || 0} className="h-1" />
                                  </CardContent>

                                  <CardFooter className="p-4 pt-2 border-t bg-muted/10 flex items-center justify-between text-[10px] mt-auto">
                                    <div className="flex -space-x-1">
                                      <Avatar className="h-6 w-6 ring-2 ring-background">
                                        <AvatarImage src={`/upload/${issue.assignee?.user?.avarta}`} className="object-cover" />
                                        <AvatarFallback className="text-[8px] font-bold">
                                          {(issue.assignee?.dis_name || issue.assignee?.email || 'A')[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-muted-foreground/60 font-medium">
                                      <Clock className="h-3.5 w-3.5 opacity-50" />
                                      {issue.due_date ? new Date(issue.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '--'}
                                    </div>
                                  </CardFooter>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        <Button
                          variant="ghost"
                          className="w-full h-16 border-2 border-dashed bg-transparent hover:bg-muted/50 border-muted-foreground/20 text-muted-foreground transition-all duration-300 rounded-lg"
                        >
                          <Target className="h-4 w-4 opacity-50" />
                        </Button>
                      </div>
                    </ScrollArea>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default IssueKanbanBoard;
