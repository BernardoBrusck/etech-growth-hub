import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  status: "novo" | "contato" | "negociacao" | "fechado" | "perdido";
  stage: "prospeccao" | "diagnostico" | "negociacao" | "fechamento" | "c7";
  value: number;
  responsible: string;
  lastUpdate: string;
  daysInStage: number;
}

export function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "leads" | "kanban" | "goals" | "financial" | "reports" | "settings" | "profile" | "members" | "calendar">("dashboard");
  const [leadsView, setLeadsView] = useState<"table" | "kanban">("table");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setCurrentUser({
            name: profile.full_name,
            email: profile.email,
            role: profile.role
          });
          setIsLoggedIn(true);
          loadLeads();
        }
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setLeads([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          responsible:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLeads: Lead[] = data?.map(lead => ({
        id: lead.id,
        name: lead.name,
        company: lead.company_name || 'Sem empresa',
        email: lead.email,
        phone: lead.phone || '',
        status: lead.status as "novo" | "contato" | "negociacao" | "fechado" | "perdido",
        stage: lead.stage as "prospeccao" | "diagnostico" | "negociacao" | "fechamento" | "c7",
        value: Number(lead.value),
        responsible: lead.responsible?.full_name || 'Não atribuído',
        lastUpdate: new Date(lead.updated_at).toLocaleDateString('pt-BR'),
        daysInStage: lead.days_in_stage
      })) || [];

      setLeads(formattedLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os leads.",
      });
    }
  };

  const metrics = {
    totalLeads: leads.length,
    conversionRate: 23.5,
    monthlyRevenue: 85000,
    goalProgress: 78.2
  };

  const addLead = async (leadData: Omit<Lead, "id" | "lastUpdate" | "daysInStage">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('leads')
        .insert({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          company_name: leadData.company,
          status: leadData.status,
          stage: leadData.stage,
          value: leadData.value,
          responsible_id: user.id,
          days_in_stage: 0
        });

      if (error) throw error;

      toast({
        title: "Lead criado!",
        description: "O lead foi adicionado com sucesso.",
      });

      loadLeads(); // Reload leads
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o lead.",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground mb-4">ETECH Jr.</div>
          <div className="text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); loadLeads(); }} />;
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
      <Header 
        onNewLead={() => setShowLeadModal(true)} 
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onLogout={handleLogout}
      />
      
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

      <MobileNavigation activeView={activeView} onViewChange={(view) => setActiveView(view as typeof activeView)} />

      <LeadModal 
        open={showLeadModal} 
        onOpenChange={setShowLeadModal}
        onSubmit={addLead}
      />
    </div>
  );
}