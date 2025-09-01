import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Plus, Calendar, TrendingUp, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: "revenue" | "leads" | "conversion" | "calls";
  target: number;
  current: number;
  period: "daily" | "weekly" | "monthly" | "quarterly";
  assignee: string;
  deadline: string;
  status: "active" | "completed" | "paused";
}

export function Goals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Meta de Receita Mensal",
      description: "Atingir R$ 100.000 em vendas no mês",
      type: "revenue",
      target: 100000,
      current: 78200,
      period: "monthly",
      assignee: "Equipe Comercial",
      deadline: "2024-03-31",
      status: "active"
    },
    {
      id: "2", 
      title: "Novos Leads",
      description: "Captar 50 novos leads qualificados",
      type: "leads",
      target: 50,
      current: 42,
      period: "monthly",
      assignee: "Ana Costa",
      deadline: "2024-03-31",
      status: "active"
    },
    {
      id: "3",
      title: "Taxa de Conversão",
      description: "Atingir 25% de conversão de leads",
      type: "conversion",
      target: 25,
      current: 23.5,
      period: "monthly",
      assignee: "Carlos Lima",
      deadline: "2024-03-31",
      status: "active"
    },
    {
      id: "4",
      title: "Ligações Semanais",
      description: "Realizar 100 ligações de prospecção",
      type: "calls",
      target: 100,
      current: 100,
      period: "weekly",
      assignee: "Beatriz Santos",
      deadline: "2024-03-15",
      status: "completed"
    }
  ]);

  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    type: "revenue" as Goal["type"],
    target: "",
    period: "monthly" as Goal["period"],
    assignee: "",
    deadline: ""
  });

  const getGoalIcon = (type: Goal["type"]) => {
    switch (type) {
      case "revenue": return <DollarSign className="h-5 w-5 text-success" />;
      case "leads": return <Users className="h-5 w-5 text-chart-primary" />;
      case "conversion": return <TrendingUp className="h-5 w-5 text-chart-secondary" />;
      case "calls": return <Target className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: Goal["status"]) => {
    switch (status) {
      case "active": return <Badge variant="default">Ativa</Badge>;
      case "completed": return <Badge className="bg-success text-success-foreground">Concluída</Badge>;
      case "paused": return <Badge variant="secondary">Pausada</Badge>;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.assignee || !newGoal.deadline) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      target: parseFloat(newGoal.target),
      current: 0,
      status: "active"
    };

    setGoals([goal, ...goals]);
    setNewGoal({
      title: "",
      description: "",
      type: "revenue",
      target: "",
      period: "monthly",
      assignee: "",
      deadline: ""
    });
    setShowNewGoalModal(false);

    toast({
      title: "Meta criada com sucesso!",
      description: `Meta "${goal.title}" foi adicionada.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Metas</h2>
          <p className="text-muted-foreground">Acompanhe o progresso das suas metas e objetivos</p>
        </div>
        <Dialog open={showNewGoalModal} onOpenChange={setShowNewGoalModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
              <DialogDescription>
                Defina uma nova meta para acompanhar o desempenho da equipe.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título*</Label>
                <Input
                  id="title"
                  placeholder="Ex: Meta de Vendas Mensais"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Descrição detalhada da meta"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo*</Label>
                  <Select value={newGoal.type} onValueChange={(value: Goal["type"]) => setNewGoal({ ...newGoal, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Receita</SelectItem>
                      <SelectItem value="leads">Leads</SelectItem>
                      <SelectItem value="conversion">Conversão</SelectItem>
                      <SelectItem value="calls">Ligações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Meta*</Label>
                  <Input
                    id="target"
                    type="number"
                    placeholder="100"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Período*</Label>
                  <Select value={newGoal.period} onValueChange={(value: Goal["period"]) => setNewGoal({ ...newGoal, period: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo*</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Responsável*</Label>
                <Select value={newGoal.assignee} onValueChange={(value) => setNewGoal({ ...newGoal, assignee: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                    <SelectItem value="Carlos Lima">Carlos Lima</SelectItem>
                    <SelectItem value="Beatriz Santos">Beatriz Santos</SelectItem>
                    <SelectItem value="Equipe Comercial">Equipe Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewGoalModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleCreateGoal} className="flex-1">
                  Criar Meta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          return (
            <Card key={goal.id} className="shadow-metric hover:shadow-hover transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getGoalIcon(goal.type)}
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span className="font-medium">
                      {goal.type === "revenue" 
                        ? `R$ ${goal.current.toLocaleString()} / R$ ${goal.target.toLocaleString()}`
                        : `${goal.current}${goal.type === "conversion" ? "%" : ""} / ${goal.target}${goal.type === "conversion" ? "%" : ""}`
                      }
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.toFixed(1)}% concluído</span>
                    <span>Prazo: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Responsável: {goal.assignee}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {goal.period === "daily" ? "Diário" : 
                     goal.period === "weekly" ? "Semanal" : 
                     goal.period === "monthly" ? "Mensal" : "Trimestral"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}