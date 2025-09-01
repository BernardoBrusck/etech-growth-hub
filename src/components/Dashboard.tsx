import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Search,
  Bell,
  Settings,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { LeadModal } from "./LeadModal";
import { LeadsTable } from "./LeadsTable";

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
}

export function Dashboard() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "leads">("dashboard");
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "João Silva",
      company: "Tech Solutions",
      email: "joao@techsolutions.com",
      phone: "(11) 9999-9999",
      status: "negociacao",
      stage: "negociacao",
      value: 15000,
      responsible: "Ana Costa",
      lastUpdate: "2 horas atrás"
    },
    {
      id: "2",
      name: "Maria Santos",
      company: "Digital Corp",
      email: "maria@digitalcorp.com",
      phone: "(11) 8888-8888",
      status: "contato",
      stage: "diagnostico",
      value: 25000,
      responsible: "Carlos Lima",
      lastUpdate: "1 dia atrás"
    },
    {
      id: "3",
      name: "Pedro Oliveira",
      company: "StartupX",
      email: "pedro@startupx.com",
      phone: "(11) 7777-7777",
      status: "fechado",
      stage: "fechamento",
      value: 30000,
      responsible: "Ana Costa",
      lastUpdate: "3 dias atrás"
    }
  ]);

  const metrics = {
    totalLeads: leads.length,
    conversionRate: 23.5,
    monthlyRevenue: 85000,
    goalProgress: 78.2
  };

  const addLead = (leadData: Omit<Lead, "id" | "lastUpdate">) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      lastUpdate: "Agora"
    };
    setLeads([newLead, ...leads]);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">ETECH Jr. CRM</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dashboard-sidebar border-r border-border min-h-[calc(100vh-80px)] p-4">
          <nav className="space-y-2">
            <Button 
              variant={activeView === "dashboard" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveView("dashboard")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeView === "leads" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveView("leads")}
            >
              <Users className="mr-2 h-4 w-4" />
              Leads
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Target className="mr-2 h-4 w-4" />
              Metas
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Financeiro
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeView === "dashboard" ? (
            <div className="space-y-6 animate-fade-in">
              {/* Header Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
                  <p className="text-muted-foreground">Visão geral das suas vendas e metas</p>
                </div>
                <Button onClick={() => setShowLeadModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Lead
                </Button>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-metric hover:shadow-hover transition-all duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                    <Users className="h-4 w-4 text-chart-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalLeads}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3 text-success" />
                      +12% desde o mês passado
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-metric hover:shadow-hover transition-all duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                    <Target className="h-4 w-4 text-chart-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3 text-success" />
                      +2.3% desde o mês passado
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-metric hover:shadow-hover transition-all duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                    <DollarSign className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {metrics.monthlyRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3 text-success" />
                      +18% desde o mês passado
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-metric hover:shadow-hover transition-all duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Progresso da Meta</CardTitle>
                    <TrendingUp className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.goalProgress}%</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowDownRight className="h-3 w-3 text-warning" />
                      -5% abaixo da meta
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Leads */}
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Leads Recentes</CardTitle>
                      <CardDescription>Últimas atualizações nos seus leads</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setActiveView("leads")}>
                      Ver Todos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            lead.status === "fechado" ? "default" :
                            lead.status === "negociacao" ? "secondary" :
                            "outline"
                          }>
                            {lead.status}
                          </Badge>
                          <p className="text-sm font-medium">R$ {lead.value.toLocaleString()}</p>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <LeadsTable leads={leads} setLeads={setLeads} onNewLead={() => setShowLeadModal(true)} />
          )}
        </main>
      </div>

      {/* Lead Modal */}
      <LeadModal 
        open={showLeadModal} 
        onOpenChange={setShowLeadModal}
        onSubmit={addLead}
      />
    </div>
  );
}