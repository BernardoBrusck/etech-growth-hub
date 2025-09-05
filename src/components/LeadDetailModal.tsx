import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  Building,
  Calendar,
  User,
  DollarSign,
  MessageSquare,
  Plus,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "novo" | "contato" | "negociacao" | "fechado" | "perdido";
  stage: "prospeccao" | "diagnostico" | "negociacao" | "fechamento" | "c7";
  value: number;
  responsible: string;
  lastUpdate: string;
  daysInStage: number;
}

interface Interaction {
  id: string;
  type: "reuniao" | "ligacao" | "nota" | "email";
  description: string;
  date: string;
  responsible: string;
}

interface LeadDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export function LeadDetailModal({ open, onOpenChange, lead }: LeadDetailModalProps) {
  const { toast } = useToast();
  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: "1",
      type: "ligacao",
      description: "Primeira ligação de apresentação da empresa. Cliente demonstrou interesse nos serviços de consultoria.",
      date: "2024-01-15 14:30",
      responsible: "Ana Costa"
    },
    {
      id: "2",
      type: "reuniao",
      description: "Reunião de diagnóstico. Identificamos necessidades específicas em automação de processos.",
      date: "2024-01-18 10:00",
      responsible: "Ana Costa"
    },
    {
      id: "3",
      type: "nota",
      description: "Cliente solicitou proposta customizada. Prazo de resposta: até sexta-feira.",
      date: "2024-01-20 16:45",
      responsible: "Ana Costa"
    }
  ]);

  const [newInteraction, setNewInteraction] = useState({
    type: "nota" as const,
    description: ""
  });

  const addInteraction = () => {
    if (!newInteraction.description.trim()) {
      toast({
        title: "Erro",
        description: "Adicione uma descrição para a interação",
        variant: "destructive",
      });
      return;
    }

    const interaction: Interaction = {
      id: Date.now().toString(),
      type: newInteraction.type,
      description: newInteraction.description,
      date: new Date().toLocaleString('pt-BR'),
      responsible: "Ana Costa"
    };

    setInteractions([interaction, ...interactions]);
    setNewInteraction({ type: "nota", description: "" });
    
    toast({
      title: "Sucesso",
      description: "Interação adicionada com sucesso!",
    });
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "reuniao": return <Calendar className="h-4 w-4" />;
      case "ligacao": return <Phone className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case "reuniao": return "text-chart-secondary";
      case "ligacao": return "text-success";
      case "email": return "text-warning";
      default: return "text-chart-primary";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "fechado": return "default";
      case "negociacao": return "secondary";
      case "contato": return "outline";
      default: return "outline";
    }
  };

  const getStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case "c7": return "default";
      case "fechamento": return "secondary";
      case "negociacao": return "outline";
      default: return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {lead.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{lead.name}</h3>
              <p className="text-muted-foreground">{lead.company}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do lead e histórico de interações
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{lead.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Empresa</p>
                    <p className="text-sm text-muted-foreground">{lead.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Valor Estimado</p>
                    <p className="text-sm text-muted-foreground">R$ {lead.value.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={getStatusBadgeVariant(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Etapa do Funil</p>
                  <Badge variant={getStageBadgeVariant(lead.stage)}>
                    {lead.stage}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Responsável</p>
                  <p className="text-sm text-muted-foreground">{lead.responsible}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Última Atualização</p>
                  <p className="text-sm text-muted-foreground">{lead.lastUpdate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Ligar para {lead.name.split(' ')[0]}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Reunião
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Interactions and Timeline */}
          <div className="lg:col-span-2 space-y-4">
            {/* Add New Interaction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nova Interação</CardTitle>
                <CardDescription>Adicione uma nova interação ao histórico do lead</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select 
                      value={newInteraction.type} 
                      onValueChange={(value: any) => setNewInteraction({ ...newInteraction, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nota">Nota</SelectItem>
                        <SelectItem value="ligacao">Ligação</SelectItem>
                        <SelectItem value="reuniao">Reunião</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Descrição</Label>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Descreva a interação..."
                        value={newInteraction.description}
                        onChange={(e) => setNewInteraction({ ...newInteraction, description: e.target.value })}
                        className="min-h-[40px]"
                      />
                      <Button onClick={addInteraction} size="icon" className="shrink-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactions Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Interações</CardTitle>
                <CardDescription>Timeline completo de todas as interações com este lead</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactions.map((interaction, index) => (
                    <div key={interaction.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full bg-background border-2 border-border ${getInteractionColor(interaction.type)}`}>
                          {getInteractionIcon(interaction.type)}
                        </div>
                        {index < interactions.length - 1 && (
                          <div className="w-px h-12 bg-border mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {interaction.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              por {interaction.responsible}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {interaction.date}
                          </div>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {interaction.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {interactions.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Nenhuma interação registrada ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}