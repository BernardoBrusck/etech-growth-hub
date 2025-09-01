import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  ArrowUpRight, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare,
  UserPlus,
  TrendingUp,
  DollarSign,
  Target
} from "lucide-react";

interface Activity {
  id: string;
  type: "lead_created" | "stage_changed" | "interaction_added" | "task_completed" | "sale_closed" | "meeting_scheduled";
  title: string;
  description: string;
  user: string;
  timestamp: string;
  entity?: string;
  value?: number;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "sale_closed",
    title: "Venda Fechada",
    description: "Pedro Oliveira - StartupX convertido com sucesso",
    user: "Ana Costa",
    timestamp: "5 min atrás",
    entity: "Pedro Oliveira",
    value: 30000
  },
  {
    id: "2",
    type: "lead_created",
    title: "Novo Lead",
    description: "Fernanda Santos adicionada via website",
    user: "Sistema",
    timestamp: "12 min atrás",
    entity: "Fernanda Santos"
  },
  {
    id: "3",
    type: "stage_changed",
    title: "Etapa Avançada",
    description: "João Silva movido para Negociação",
    user: "Carlos Lima",
    timestamp: "25 min atrás",
    entity: "João Silva"
  },
  {
    id: "4",
    type: "interaction_added",
    title: "Reunião Realizada",
    description: "Reunião de diagnóstico com Maria Santos",
    user: "Ana Costa",
    timestamp: "1 hora atrás",
    entity: "Maria Santos"
  },
  {
    id: "5",
    type: "meeting_scheduled",
    title: "Reunião Agendada",
    description: "Follow-up com Tech Solutions para amanhã às 14h",
    user: "Beatriz Santos",
    timestamp: "2 horas atrás",
    entity: "Tech Solutions"
  },
  {
    id: "6",
    type: "task_completed",
    title: "Proposta Enviada",
    description: "Proposta comercial enviada para Digital Corp",
    user: "Rafael Oliveira",
    timestamp: "3 horas atrás",
    entity: "Digital Corp"
  },
  {
    id: "7",
    type: "lead_created",
    title: "Novo Lead",
    description: "Roberto Lima adicionado via indicação",
    user: "Carlos Lima",
    timestamp: "4 horas atrás",
    entity: "Roberto Lima"
  },
  {
    id: "8",
    type: "interaction_added",
    title: "Ligação Realizada",
    description: "Primeira abordagem com Inovação Tech",
    user: "Ana Costa",
    timestamp: "5 horas atrás",
    entity: "Inovação Tech"
  }
];

export function ActivityFeed() {
  const [showAll, setShowAll] = useState(false);
  const displayActivities = showAll ? activities : activities.slice(0, 6);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sale_closed": return <DollarSign className="h-4 w-4 text-success" />;
      case "lead_created": return <UserPlus className="h-4 w-4 text-chart-primary" />;
      case "stage_changed": return <TrendingUp className="h-4 w-4 text-chart-secondary" />;
      case "interaction_added": return <MessageSquare className="h-4 w-4 text-warning" />;
      case "task_completed": return <Target className="h-4 w-4 text-success" />;
      case "meeting_scheduled": return <Calendar className="h-4 w-4 text-chart-secondary" />;
      default: return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "sale_closed": return "border-success";
      case "lead_created": return "border-chart-primary";
      case "stage_changed": return "border-chart-secondary";
      case "interaction_added": return "border-warning";
      case "task_completed": return "border-success";
      case "meeting_scheduled": return "border-chart-secondary";
      default: return "border-border";
    }
  };

  const formatActivityType = (type: string) => {
    switch (type) {
      case "sale_closed": return "Venda";
      case "lead_created": return "Lead";
      case "stage_changed": return "Pipeline";
      case "interaction_added": return "Interação";
      case "task_completed": return "Tarefa";
      case "meeting_scheduled": return "Reunião";
      default: return "Atividade";
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-chart-primary" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>Últimas atualizações do sistema</CardDescription>
          </div>
          <Badge variant="outline">{activities.length} atividades</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full bg-background border-2 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                {index < displayActivities.length - 1 && (
                  <div className="w-px h-12 bg-border mt-2" />
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {formatActivityType(activity.type)}
                      </Badge>
                      <span className="text-sm font-medium">{activity.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {activity.user}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp}
                      </div>
                      {activity.value && (
                        <div className="flex items-center gap-1 text-success">
                          <DollarSign className="h-3 w-3" />
                          R$ {activity.value.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {activity.entity && (
                    <Button variant="ghost" size="sm" className="text-xs">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAll && activities.length > 6 && (
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowAll(true)}
              className="text-sm"
            >
              Ver mais atividades ({activities.length - 6} restantes)
            </Button>
          </div>
        )}

        {showAll && (
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowAll(false)}
              className="text-sm"
            >
              Mostrar menos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}