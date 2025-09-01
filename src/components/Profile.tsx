import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building,
  Edit,
  Save,
  Camera,
  Shield,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Ana Costa",
    email: "ana.costa@etech.com",
    phone: "(11) 99999-9999",
    position: "Gerente Comercial",
    department: "Vendas",
    location: "São Paulo, SP",
    joinDate: "2023-01-15",
    bio: "Especialista em gestão comercial com mais de 8 anos de experiência em vendas B2B e liderança de equipes.",
    skills: ["Gestão de Vendas", "CRM", "Liderança", "Negociação", "Análise de Dados"]
  });

  const activities = [
    {
      id: "1",
      type: "lead_created",
      description: "Criou lead para Tech Solutions",
      time: "2 horas atrás",
      icon: "👤"
    },
    {
      id: "2", 
      type: "goal_achieved",
      description: "Atingiu meta mensal de vendas",
      time: "1 dia atrás",
      icon: "🎯"
    },
    {
      id: "3",
      type: "meeting",
      description: "Reunião com Maria Santos concluída",
      time: "2 dias atrás", 
      icon: "📅"
    },
    {
      id: "4",
      type: "sale_closed",
      description: "Fechou venda de R$ 30.000",
      time: "3 dias atrás",
      icon: "💰"
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleImageUpload = () => {
    toast({
      title: "Upload de imagem",
      description: "Funcionalidade disponível em breve.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Meu Perfil</h2>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Salvar
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Editar
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="shadow-metric">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">AC</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full"
                onClick={handleImageUpload}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <CardDescription>{profile.position}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{profile.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Desde {new Date(profile.joinDate).toLocaleDateString()}</span>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Habilidades</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="activity">Atividades</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <Card className="shadow-metric">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        value={profile.position}
                        onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      disabled={!isEditing}
                      className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50"
                      placeholder="Conte um pouco sobre você..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="shadow-metric">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Atividades Recentes
                  </CardTitle>
                  <CardDescription>Suas últimas ações no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="text-2xl">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-metric">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance do Mês</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Leads Criados</span>
                      <span className="font-semibold">42</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Vendas Fechadas</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                      <span className="font-semibold">19.0%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Receita Gerada</span>
                      <span className="font-semibold text-success">R$ 125.000</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-metric">
                  <CardHeader>
                    <CardTitle className="text-lg">Conquistas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        🏆
                      </div>
                      <div>
                        <p className="font-medium text-sm">Top Vendedor</p>
                        <p className="text-xs text-muted-foreground">Março 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        🎯
                      </div>
                      <div>
                        <p className="font-medium text-sm">Meta Atingida</p>
                        <p className="text-xs text-muted-foreground">120% da meta</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        ⭐
                      </div>
                      <div>
                        <p className="font-medium text-sm">Excelência</p>
                        <p className="text-xs text-muted-foreground">Avaliação 5 estrelas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}