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
  Calendar as CalendarIcon,
  BarChart3,
  List,
  Grid,
  UserCheck
} from "lucide-react";
import { Header } from "./Header";
import { ChartsSection } from "./ChartsSection";
import { ActivityFeed } from "./ActivityFeed";
import { LeadModal } from "./LeadModal";
import { LeadsTable } from "./LeadsTable";
import { KanbanView } from "./KanbanView";
import { Goals } from "./Goals";
import { Financial } from "./Financial";
import { Reports } from "./Reports";
import { Settings as SettingsPage } from "./Settings";
import { Profile } from "./Profile";
import { Members } from "./Members";
import { Calendar } from "./Calendar";
import { Login } from "./Login";
import { MobileNavigation } from "./MobileNavigation";

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

export function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "leads" | "kanban" | "goals" | "financial" | "reports" | "settings" | "profile" | "members" | "calendar">("dashboard");
  const [leadsView, setLeadsView] = useState<"table" | "kanban">("table");
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
      lastUpdate: "2 horas atrás",
      daysInStage: 5
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
      lastUpdate: "1 dia atrás",
      daysInStage: 12
    },
    {
      id: "3",
      name: "Pedro Oliveira",
      company: "StartupX",
      email: "pedro@startupx.com",
      phone: "(11) 7777-7777",
      status: "fechado",
      stage: "c7",
      value: 30000,
      responsible: "Ana Costa",
      lastUpdate: "3 dias atrás",
      daysInStage: 2
    },
    {
      id: "4",
      name: "Fernanda Costa",
      company: "Inovação Tech",
      email: "fernanda@inovacaotech.com",
      phone: "(11) 6666-6666",
      status: "novo",
      stage: "prospeccao",
      value: 18000,
      responsible: "Beatriz Santos",
      lastUpdate: "1 hora atrás",
      daysInStage: 1
    },
    {
      id: "5",
      name: "Roberto Lima",
      company: "Future Systems",
      email: "roberto@futuresystems.com",
      phone: "(11) 5555-5555",
      status: "contato",
      stage: "diagnostico",
      value: 22000,
      responsible: "Rafael Oliveira",
      lastUpdate: "6 horas atrás",
      daysInStage: 8
    }
  ]);

  const metrics = {
    totalLeads: leads.length,
    conversionRate: 23.5,
    monthlyRevenue: 85000,
    goalProgress: 78.2
  };

  const addLead = (leadData: Omit<Lead, "id" | "lastUpdate" | "daysInStage">) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      lastUpdate: "Agora",
      daysInStage: 0
    };
    setLeads([newLead, ...leads]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case "goals": return <Goals />;
      case "financial": return <Financial />;
      case "reports": return <Reports />;
      case "settings": return <SettingsPage />;
      case "profile": return <Profile />;
      case "members": return <Members />;
      case "calendar": return <Calendar />;
      case "kanban": return <KanbanView leads={leads} setLeads={setLeads} onNewLead={() => setShowLeadModal(true)} />;
      case "leads": return (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Leads</h2>
              <p className="text-muted-foreground">Gerencie todos os seus leads e oportunidades</p>
            </div>
          </div>
          <LeadsTable leads={leads} setLeads={setLeads} onNewLead={() => setShowLeadModal(true)} />
        </div>
      );
      default: return (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground">Visão geral das suas vendas e metas</p>
            </div>
          </div>
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
          <ChartsSection />
          <ActivityFeed />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg pb-16 md:pb-0">
      <Header onNewLead={() => setShowLeadModal(true)} />
      
      <div className="flex">
        <aside className="hidden md:block w-64 bg-dashboard-sidebar border-r border-border min-h-[calc(100vh-80px)] p-4">
          <nav className="space-y-2">
            <Button variant={activeView === "dashboard" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("dashboard")}>
              <TrendingUp className="mr-2 h-4 w-4" />Dashboard
            </Button>
            <Button variant={activeView === "leads" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("leads")}>
              <Users className="mr-2 h-4 w-4" />Leads
            </Button>
            <Button variant={activeView === "kanban" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("kanban")}>
              <Grid className="mr-2 h-4 w-4" />Pipeline
            </Button>
            <Button variant={activeView === "goals" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("goals")}>
              <Target className="mr-2 h-4 w-4" />Metas
            </Button>
            <Button variant={activeView === "financial" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("financial")}>
              <DollarSign className="mr-2 h-4 w-4" />Financeiro
            </Button>
            <Button variant={activeView === "reports" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("reports")}>
              <BarChart3 className="mr-2 h-4 w-4" />Relatórios
            </Button>
            <Button variant={activeView === "members" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("members")}>
              <UserCheck className="mr-2 h-4 w-4" />Membros
            </Button>
            <Button variant={activeView === "calendar" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("calendar")}>
              <CalendarIcon className="mr-2 h-4 w-4" />Calendário
            </Button>
            <Button variant={activeView === "settings" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveView("settings")}>
              <Settings className="mr-2 h-4 w-4" />Configurações
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          {renderContent()}
        </main>
      </div>

      <MobileNavigation activeView={activeView} onViewChange={setActiveView} />

      <LeadModal 
        open={showLeadModal} 
        onOpenChange={setShowLeadModal}
        onSubmit={addLead}
      />
    </div>
  );
}