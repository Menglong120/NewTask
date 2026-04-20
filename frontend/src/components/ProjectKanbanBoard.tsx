'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  MoreVertical,
  Calendar,
  Layers,
  Edit2,
  CheckCircle2,
  Trash2,
  Clock,
  ArrowRight,
  Target,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Project {
  id: number;
  name: string;
  description: string;
  start_date?: string;
  end_date?: string;
  status: { id: number; title: string; };
  members: Array<{ user: { id: string; display_name?: string; dis_name?: string; avarta: string; }; }>;
}

interface ProjectProgress { id: number; progress: number; issue: { total: string }; }

interface ProjectKanbanBoardProps {
  projects: Project[];
  progressData: ProjectProgress[];
  statuses: any[];
  onEdit: (project: Project) => void;
  onUpdateStatus: (project: Project) => void;
  onStatusChange: (projectId: number, newStatusId: string) => void;
  onDelete: (id: number) => void;
  onAddProject: (statusId: string) => void;
}

const ProjectKanbanBoard: React.FC<ProjectKanbanBoardProps> = ({
  projects,
  progressData,
  statuses,
  onEdit,
  onUpdateStatus,
  onStatusChange,
  onDelete,
  onAddProject
}) => {
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);

  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const getStatusColor = (statusTitle: string) => {
    const title = statusTitle.toLowerCase();
    if (title.includes('done') || title.includes('complete')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
    if (title.includes('progress')) return 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.1)]';
    if (title.includes('start') || title.includes('new')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const projectId = parseInt(draggableId);
    const newStatusId = parseInt(destination.droppableId);

    // Optimistic Update
    const updatedProjects = localProjects.map((p: Project) => {
      if (p.id === projectId) {
        const newStatus = statuses.find((s: any) => s.id === newStatusId);
        return { ...p, status: newStatus || p.status };
      }
      return p;
    });
    setLocalProjects(updatedProjects);

    // Backend Sync
    onStatusChange(projectId, String(newStatusId));
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-muted/20">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex p-4 gap-4 h-[calc(100vh-280px)] min-h-[650px]">
          {statuses.map((status: any) => {
            const statusProjects = localProjects.filter((p: Project) => p.status.id === status.id);

            return (
              <div key={status.id} className="flex flex-col w-72 shrink-0 group/column">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-3 h-10 shrink-0 bg-muted/50 border rounded-md relative overflow-hidden group/header w-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover/header:bg-primary transition-all duration-300" />
                  <div className="flex items-center gap-2 pl-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      statusProjects.length > 0 ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                    )} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {status.title}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-medium h-5 min-w-[20px] flex justify-center">
                    {statusProjects.length}
                  </Badge>
                </div>

                {/* Column Content */}
                <Droppable droppableId={String(status.id)}>
                  {(provided, snapshot) => (
                    <ScrollArea
                      className={cn(
                        "flex-1 pr-2 -mr-2 transition-colors duration-300",
                        snapshot.isDraggingOver ? "bg-accent/30" : ""
                      )}
                      {...provided.droppableProps}
                    >
                      <div ref={provided.innerRef} className="space-y-3 pb-10 min-h-[100px]">
                        {statusProjects.map((project: Project, index: number) => {
                          const progInfo = progressData.find((pd: ProjectProgress) => pd.id === project.id);
                          const progress = progInfo?.progress || 0;
                          const issuesCount = progInfo?.issue.total || '0';
                          const endDate = project.end_date ? new Date(project.end_date) : null;
                          const daysRemaining = endDate ? Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

                          return (
                            <Draggable key={project.id} draggableId={String(project.id)} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "transition-transform duration-200",
                                    snapshot.isDragging ? "z-50 scale-[1.02]" : ""
                                  )}
                                >
                                  <Card
                                    className={cn(
                                      "group/card bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md relative overflow-hidden flex flex-col h-auto w-full",
                                      snapshot.isDragging ? "shadow-lg border-primary" : ""
                                    )}
                                    onClick={() => window.location.href = `/projects/${project.id}`}
                                  >
                                    <CardHeader className="p-4 pb-0 space-y-3 relative z-10">
                                      <div className="flex justify-between items-start">
                                        <Badge variant="outline" className={cn('px-2 py-0 text-[10px] font-semibold uppercase tracking-wider', getStatusColor(project.status.title))}>
                                          {project.status.title}
                                        </Badge>

                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild onClick={(e) => { e.stopPropagation(); }}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                              <MoreVertical className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="gap-2">
                                              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" /> Edit Project
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUpdateStatus(project); }} className="gap-2">
                                              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" /> Update Status
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} className="gap-2 text-destructive focus:bg-destructive/10">
                                              <Trash2 className="h-3.5 w-3.5" /> Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>

                                      <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">
                                        {project.name}
                                      </CardTitle>
                                    </CardHeader>

                                    <CardContent className="p-4 pt-1 space-y-3 relative z-10 flex-1">
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {project.description || 'No description available.'}
                                      </p>

                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <div className="flex -space-x-1.5">
                                            {project.members.slice(0, 3).map((m: any, i: number) => (
                                              <Avatar key={i} className="h-6 w-6 ring-2 ring-background">
                                                <AvatarImage src={`/upload/${m.user?.avarta}`} className="object-cover" />
                                                <AvatarFallback className="text-[8px] font-bold">
                                                  {(m.user?.display_name || m.user?.dis_name || 'U')[0]}
                                                </AvatarFallback>
                                              </Avatar>
                                            ))}
                                            {project.members.length > 3 && (
                                              <div className="h-6 w-6 rounded-full bg-muted border flex items-center justify-center text-[8px] font-bold ring-2 ring-background">
                                                +{project.members.length - 3}
                                              </div>
                                            )}
                                          </div>
                                          <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                                            {Math.round(progress)}%
                                          </span>
                                        </div>
                                        <Progress value={progress} className="h-1" />
                                      </div>
                                    </CardContent>

                                    <CardFooter className="p-4 pt-2 border-t bg-muted/10 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                                      <div className={cn(
                                        "flex items-center gap-1.5",
                                        daysRemaining < 0 ? "text-destructive" : daysRemaining <= 3 ? "text-amber-600" : ""
                                      )}>
                                        <Clock className="h-3.5 w-3.5" />
                                        {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : daysRemaining === 0 ? 'Due today' : `${daysRemaining}d left`}
                                      </div>
                                      <div className="flex items-center gap-1.5 opacity-70">
                                        <Layers className="h-3.5 w-3.5" /> {issuesCount}
                                      </div>
                                    </CardFooter>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}

                        <Button
                          variant="ghost"
                          className="w-full h-16 border-2 border-dashed bg-transparent hover:bg-muted/50 border-muted-foreground/20 text-muted-foreground transition-all duration-300"
                          onClick={() => onAddProject(String(status.id))}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          <span className="text-xs font-semibold uppercase tracking-wider">New Project</span>
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

export default ProjectKanbanBoard;
