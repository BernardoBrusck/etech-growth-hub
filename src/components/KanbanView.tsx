import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "novo" | "contato" | "negociacao" | "fechado";
  stage: "prospeccao" | "diagnostico" | "negociacao" | "fechamento" | "c7";
  value: number;
  responsible: string;
  lastUpdate: string;
  daysInStage: number;
}

interface KanbanViewProps {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  onNewLead: () => void;
}

const stageColumns = {
  prospeccao: { title: "Prospecção", color: "bg-muted", limit: null },
  diagnostico: { title: "Diagnóstico", color: "bg-chart-secondary/10", limit: 15 },
  negociacao: { title: "Negociação", color: "bg-warning/10", limit: 10 },
  fechamento: { title: "Fechamento", color: "bg-success/10", limit: 8 },
  c7: { title: "C7 - Fechado", color: "bg-chart-primary/10", limit: null }
};

export function KanbanView({ leads, setLeads, onNewLead }: KanbanViewProps) {
  const { toast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) return;

    const leadId = result.draggableId;
    const newStage = destination.droppableId as Lead["stage"];
    
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            stage: newStage,
            lastUpdate: "Agora",
            daysInStage: 0,
            status: newStage === "c7" ? "fechado" as const : lead.status
          }
        : lead
    ));

    toast({
      title: "Lead movido",
      description: `Lead movido para ${stageColumns[newStage].title}`,
    });
  };

  const getLeadsByStage = (stage: string) => {
    return leads.filter(lead => lead.stage === stage);
  };

  const getStageValue = (stage: string) => {
    return getLeadsByStage(stage).reduce((sum, lead) => sum + lead.value, 0);
  };

  const getCardPriorityColor = (daysInStage: number) => {
    if (daysInStage >= 14) return "border-l-destructive";
    if (daysInStage >= 7) return "border-l-warning";
    return "border-l-chart-primary";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Pipeline de Vendas</h2>
          <p className="text-muted-foreground">Visão Kanban do funil de leads</p>
        </div>
        <Button onClick={onNewLead} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(stageColumns).map(([stageKey, stage]) => {
          const stageLeads = getLeadsByStage(stageKey);
          const stageValue = getStageValue(stageKey);
          
          return (
            <Card key={stageKey} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{stage.title}</h3>
                  <Badge variant="outline">{stageLeads.length}</Badge>
                </div>
                <p className="text-2xl font-bold">R$ {stageValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  Valor total da etapa
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-4 min-h-[600px]">
          {Object.entries(stageColumns).map(([stageKey, stage]) => {
            const stageLeads = getLeadsByStage(stageKey);
            
            return (
              <div key={stageKey} className="flex flex-col">
                <div className={`${stage.color} rounded-t-lg p-4 border-b border-border`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{stage.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{stageLeads.length}</Badge>
                      {stage.limit && stageLeads.length > stage.limit && (
                        <Badge variant="destructive" className="text-xs">
                          WIP!
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Droppable droppableId={stageKey}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 space-y-3 bg-muted/20 rounded-b-lg min-h-[500px] ${
                        snapshot.isDraggingOver ? 'bg-accent/20' : ''
                      }`}
                    >
                      {stageLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`shadow-card hover:shadow-metric transition-all duration-200 cursor-grab active:cursor-grabbing border-l-4 ${getCardPriorityColor(lead.daysInStage)} ${
                                snapshot.isDragging ? 'rotate-2 shadow-hover' : ''
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs">
                                        {lead.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-sm">{lead.name}</p>
                                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-success">
                                      R$ {lead.value.toLocaleString()}
                                    </span>
                                    <Badge 
                                      variant={lead.status === "fechado" ? "default" : "outline"}
                                      className="text-xs"
                                    >
                                      {lead.status}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {lead.daysInStage} dias na etapa
                                  </div>

                                  <div className="text-xs text-muted-foreground">
                                    Responsável: {lead.responsible}
                                  </div>

                                  <div className="flex justify-between items-center pt-2 border-t border-border">
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Phone className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Mail className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Calendar className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {lead.lastUpdate}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {stageLeads.length === 0 && (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg">
                          <p className="text-muted-foreground text-sm">
                            Nenhum lead nesta etapa
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Pipeline Legend */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Legenda do Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-l-chart-primary bg-card"></div>
              <span>0-6 dias na etapa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-l-warning bg-card"></div>
              <span>7-13 dias na etapa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-l-destructive bg-card"></div>
              <span>14+ dias na etapa</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}