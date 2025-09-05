import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Edit, Save, X } from "lucide-react";

export function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    avatar_url: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
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
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar o perfil.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          department: profile.department,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: "bg-red-500",
      manager: "bg-blue-500",
      sales: "bg-green-500",
      user: "bg-gray-500"
    };
    
    const roleNames = {
      admin: "Administrador",
      manager: "Gerente",
      sales: "Vendas",
      user: "Usuário"
    };

    return (
      <Badge className={`${roleColors[role as keyof typeof roleColors]} text-white`}>
        {roleNames[role as keyof typeof roleNames] || role}
      </Badge>
    );
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
          <h2 className="text-3xl font-bold text-foreground">Perfil</h2>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                loadProfile();
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{profile.full_name}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
            <div className="flex justify-center mt-2">
              {getRoleBadge(profile.role)}
            </div>
          </CardHeader>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações de contato e trabalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={profile.department || ""}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Ex: Vendas, Marketing"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Input
                id="role"
                value={profile.role}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Sua função é definida pelo administrador do sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Atividade</CardTitle>
          <CardDescription>
            Resumo da sua atividade no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-chart-primary">15</div>
              <div className="text-sm text-muted-foreground">Leads Criados</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-success">8</div>
              <div className="text-sm text-muted-foreground">Vendas Fechadas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-warning">3</div>
              <div className="text-sm text-muted-foreground">Metas Ativas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-chart-secondary">85%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}