import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings as SettingsIcon, Bell, Shield, Database, Users, Moon, Sun } from "lucide-react";

export function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      lead_updates: true,
      deal_closed: true,
    },
    theme: "system",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
  });
  
  const [profile, setProfile] = useState({
    role: "",
    full_name: "",
    email: ""
  });
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleChangePassword = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return;

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o email de redefinição.",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Configurações</h2>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações do sistema</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          {profile.role === 'admin' ? 'Administrador' : 'Usuário'}
        </Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configure suas preferências básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Claro
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Escuro
                        </div>
                      </SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-4)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure quando e como receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notificações por Email</Label>
                    <div className="text-sm text-muted-foreground">
                      Receba atualizações importantes por email
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notificações Push</Label>
                    <div className="text-sm text-muted-foreground">
                      Receba notificações em tempo real no navegador
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, push: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Atualizações de Leads</Label>
                    <div className="text-sm text-muted-foreground">
                      Notificar quando houver mudanças nos leads
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.lead_updates}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, lead_updates: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Vendas Fechadas</Label>
                    <div className="text-sm text-muted-foreground">
                      Notificar quando uma venda for concluída
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.deal_closed}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, deal_closed: checked }
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings}>
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>
                Gerencie suas configurações de segurança e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Informações da Conta</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{profile.full_name}</div>
                        <div className="text-sm text-muted-foreground">{profile.email}</div>
                      </div>
                      <Badge variant="outline">{profile.role}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Alterar Senha</Label>
                  <div className="text-sm text-muted-foreground mb-2">
                    Clique no botão abaixo para receber um link de redefinição de senha por email
                  </div>
                  <Button variant="outline" onClick={handleChangePassword}>
                    Enviar Link de Redefinição
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Sessões Ativas</Label>
                  <div className="text-sm text-muted-foreground mb-2">
                    Gerencie onde você está conectado
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Navegador Atual</div>
                        <div className="text-sm text-muted-foreground">Última atividade: agora</div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ativo
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações Avançadas
              </CardTitle>
              <CardDescription>
                Configurações para usuários avançados e administradores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.role === 'admin' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <Label className="text-base font-medium text-blue-900">Configurações de Administrador</Label>
                    </div>
                    <div className="text-sm text-blue-700 mb-3">
                      Como administrador, você tem acesso a configurações especiais do sistema
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        Gerenciar Usuários
                      </Button>
                      <Button variant="outline" size="sm">
                        Configurações do Sistema
                      </Button>
                      <Button variant="outline" size="sm">
                        Logs de Auditoria
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-base">Exportar Dados</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Baixe uma cópia dos seus dados pessoais
                </div>
                <Button variant="outline">
                  Solicitar Exportação
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-base text-red-600">Zona de Perigo</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Ações irreversíveis que afetam sua conta
                </div>
                <Button variant="destructive" disabled>
                  Excluir Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}