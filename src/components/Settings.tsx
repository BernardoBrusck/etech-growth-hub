import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  Upload,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "ETECH Jr.",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    currency: "BRL",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    leadAlerts: true,
    goalAlerts: false,
    
    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: "30",
    dataRetention: "365",
    
    // System
    theme: "system",
    autoSave: true,
    backupFrequency: "daily"
  });

  const handleSave = (section: string) => {
    toast({
      title: "Configurações salvas!",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados estão sendo preparados para download.",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Importação iniciada", 
      description: "Seus dados estão sendo processados.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Configurações</h2>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações do sistema</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="data">Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-metric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configurações básicas da sua organização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("gerais")} className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-metric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações importantes por email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações no navegador</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Relatórios Semanais</Label>
                    <p className="text-sm text-muted-foreground">Resumo semanal de atividades por email</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Leads</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre novos leads e mudanças</p>
                  </div>
                  <Switch
                    checked={settings.leadAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, leadAlerts: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Metas</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre progresso das metas</p>
                  </div>
                  <Switch
                    checked={settings.goalAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, goalAlerts: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("notificações")} className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-metric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança e Privacidade
              </CardTitle>
              <CardDescription>
                Configure as opções de segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                    />
                    {settings.twoFactorAuth && <Badge className="bg-success text-success-foreground">Ativo</Badge>}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Select value={settings.sessionTimeout} onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
                  <Select value={settings.dataRetention} onValueChange={(value) => setSettings({ ...settings, dataRetention: value })}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="180">180 dias</SelectItem>
                      <SelectItem value="365">1 ano</SelectItem>
                      <SelectItem value="1095">3 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h4 className="font-semibold text-destructive mb-2">Zona de Perigo</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Ações irreversíveis que afetam permanentemente sua conta.
                </p>
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm">
                    Resetar Configurações
                  </Button>
                  <Button variant="outline" size="sm" className="border-destructive text-destructive">
                    Excluir Conta
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("segurança")} className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="shadow-metric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Sistema e Aparência
              </CardTitle>
              <CardDescription>
                Configure a aparência e comportamento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-salvamento</Label>
                    <p className="text-sm text-muted-foreground">Salvar automaticamente alterações</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Frequência de Backup</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("sistema")} className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="shadow-metric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gerenciamento de Dados
              </CardTitle>
              <CardDescription>
                Importe, exporte e gerencie seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Exportar Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Faça download de todos os seus dados em formato CSV
                  </p>
                  <div className="space-y-2">
                    <Button onClick={handleExportData} className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Exportar Leads
                    </Button>
                    <Button onClick={handleExportData} variant="outline" className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Exportar Transações
                    </Button>
                    <Button onClick={handleExportData} variant="outline" className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Exportar Relatórios
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Importar Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Faça upload de dados de outras plataformas
                  </p>
                  <div className="space-y-2">
                    <Button onClick={handleImportData} variant="outline" className="w-full gap-2">
                      <Upload className="h-4 w-4" />
                      Importar Leads (CSV)
                    </Button>
                    <Button onClick={handleImportData} variant="outline" className="w-full gap-2">
                      <Upload className="h-4 w-4" />
                      Importar Contatos
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Estatísticas de Dados</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-chart-primary">234</div>
                    <div className="text-sm text-muted-foreground">Leads</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-chart-secondary">45</div>
                    <div className="text-sm text-muted-foreground">Transações</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-success">12</div>
                    <div className="text-sm text-muted-foreground">Usuários</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-warning">2.3 GB</div>
                    <div className="text-sm text-muted-foreground">Armazenamento</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}