import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Crown,
  Shield,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "member";
  department: string;
  joinDate: string;
  status: "active" | "inactive";
  avatar?: string;
  lastLogin: string;
}

export function Members() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Ana Costa",
      email: "ana.costa@etech.com",
      phone: "(11) 99999-9999",
      role: "admin",
      department: "Vendas",
      joinDate: "2023-01-15",
      status: "active",
      lastLogin: "Online agora"
    },
    {
      id: "2",
      name: "Carlos Lima",
      email: "carlos.lima@etech.com", 
      phone: "(11) 88888-8888",
      role: "manager",
      department: "Comercial",
      joinDate: "2023-03-20",
      status: "active",
      lastLogin: "2 horas atrás"
    },
    {
      id: "3",
      name: "Beatriz Santos",
      email: "beatriz.santos@etech.com",
      phone: "(11) 77777-7777",
      role: "member",
      department: "Vendas",
      joinDate: "2023-06-10",
      status: "active",
      lastLogin: "1 dia atrás"
    },
    {
      id: "4",
      name: "Rafael Oliveira",
      email: "rafael.oliveira@etech.com",
      phone: "(11) 66666-6666",
      role: "member",
      department: "Comercial",
      joinDate: "2023-08-05",
      status: "inactive",
      lastLogin: "1 semana atrás"
    }
  ]);

  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member" as Member["role"],
    department: ""
  });

  const getRoleIcon = (role: Member["role"]) => {
    switch (role) {
      case "admin": return <Crown className="h-4 w-4 text-yellow-500" />;
      case "manager": return <Shield className="h-4 w-4 text-blue-500" />;
      case "member": return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: Member["role"]) => {
    switch (role) {
      case "admin": return <Badge className="bg-yellow-500 text-white">Administrador</Badge>;
      case "manager": return <Badge className="bg-blue-500 text-white">Gerente</Badge>;
      case "member": return <Badge variant="secondary">Membro</Badge>;
    }
  };

  const getStatusBadge = (status: Member["status"]) => {
    return status === "active" ? (
      <Badge className="bg-success text-success-foreground">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    );
  };

  const handleCreateMember = () => {
    if (!newMember.name || !newMember.email || !newMember.department) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const member: Member = {
      id: Date.now().toString(),
      ...newMember,
      joinDate: new Date().toISOString().split('T')[0],
      status: "active",
      lastLogin: "Nunca logou"
    };

    setMembers([member, ...members]);
    setNewMember({
      name: "",
      email: "",
      phone: "",
      role: "member",
      department: ""
    });
    setShowNewMemberModal(false);

    toast({
      title: "Membro adicionado!",
      description: `${member.name} foi adicionado à equipe.`,
    });
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      department: member.department
    });
    setShowNewMemberModal(true);
  };

  const handleUpdateMember = () => {
    if (!editingMember) return;

    setMembers(members.map(m => 
      m.id === editingMember.id 
        ? { ...m, ...newMember }
        : m
    ));

    setEditingMember(null);
    setNewMember({
      name: "",
      email: "",
      phone: "",
      role: "member",
      department: ""
    });
    setShowNewMemberModal(false);

    toast({
      title: "Membro atualizado!",
      description: "As informações foram salvas com sucesso.",
    });
  };

  const handleDeleteMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    setMembers(members.filter(m => m.id !== memberId));
    
    toast({
      title: "Membro removido",
      description: `${member?.name} foi removido da equipe.`,
    });
  };

  const handlePromoteMember = (memberId: string) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        const newRole = m.role === "member" ? "manager" : m.role === "manager" ? "admin" : "admin";
        return { ...m, role: newRole };
      }
      return m;
    }));

    toast({
      title: "Membro promovido!",
      description: "O nível de acesso foi atualizado.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Membros da Equipe</h2>
          <p className="text-muted-foreground">Gerencie os membros e suas permissões</p>
        </div>
        <Dialog open={showNewMemberModal} onOpenChange={setShowNewMemberModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Editar Membro" : "Adicionar Novo Membro"}
              </DialogTitle>
              <DialogDescription>
                {editingMember 
                  ? "Atualize as informações do membro." 
                  : "Adicione um novo membro à sua equipe."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo*</Label>
                <Input
                  id="name"
                  placeholder="João Silva"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@etech.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Função*</Label>
                  <Select value={newMember.role} onValueChange={(value: Member["role"]) => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Membro</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento*</Label>
                  <Select value={newMember.department} onValueChange={(value) => setNewMember({ ...newMember, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewMemberModal(false);
                    setEditingMember(null);
                    setNewMember({
                      name: "",
                      email: "",
                      phone: "",
                      role: "member",
                      department: ""
                    });
                  }} 
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={editingMember ? handleUpdateMember : handleCreateMember} 
                  className="flex-1"
                >
                  {editingMember ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-metric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-chart-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">
              {members.filter(m => m.status === "active").length} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-metric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.filter(m => m.role === "admin").length}
            </div>
            <p className="text-xs text-muted-foreground">Acesso total</p>
          </CardContent>
        </Card>

        <Card className="shadow-metric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.filter(m => m.role === "manager").length}
            </div>
            <p className="text-xs text-muted-foreground">Gestão de equipe</p>
          </CardContent>
        </Card>

        <Card className="shadow-metric">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.filter(m => m.role === "member").length}
            </div>
            <p className="text-xs text-muted-foreground">Operacionais</p>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <Card className="shadow-metric">
        <CardHeader>
          <CardTitle>Lista de Membros</CardTitle>
          <CardDescription>Gerencie informações e permissões dos membros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {getRoleIcon(member.role)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{member.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Último acesso: {member.lastLogin}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {member.role !== "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePromoteMember(member.id)}
                      >
                        <Crown className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover Membro</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover {member.name} da equipe? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteMember(member.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}