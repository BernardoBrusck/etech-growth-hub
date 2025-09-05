import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, User, Users, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import etechLogo from "@/assets/etech-logo.png";

interface LoginProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Demo users data
  const demoUsers = [
    { email: "admin@etechjr.com", password: "admin123", role: "Admin", icon: UserCheck },
    { email: "manager@etechjr.com", password: "manager123", role: "Gerente", icon: Users },
    { email: "user@etechjr.com", password: "user123", role: "Vendedor", icon: User },
  ];

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          onLogin({
            name: profile.full_name,
            email: profile.email,
            role: profile.role
          });
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          onLogin({
            name: profile.full_name,
            email: profile.email,
            role: profile.role
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [onLogin]);

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (error) {
        // If user doesn't exist, create them
        if (error.message.includes('Invalid login credentials')) {
          await createDemoUser(demoEmail, demoPassword);
          return;
        }
        throw error;
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao sistema!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoUser = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: getDemoUserName(email),
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Usuário demo criado!",
        description: "Fazendo login automaticamente...",
      });

      // Auto login after creation
      setTimeout(() => {
        handleDemoLogin(email, password);
      }, 1000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário demo",
        description: error.message,
      });
    }
  };

  const getDemoUserName = (email: string) => {
    if (email.includes('admin')) return 'Administrador do Sistema';
    if (email.includes('manager')) return 'Gerente de Vendas';
    return 'Vendedor';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "Erro no cadastro",
            description: error.message,
          });
        } else {
          toast({
            title: "Cadastro realizado!",
            description: "Verifique seu email para confirmar a conta.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: error.message,
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={etechLogo} 
              alt="ETECH Jr." 
              className="h-16 w-auto filter brightness-0 invert"
            />
          </div>
          <CardTitle className="text-white text-2xl font-bold">
            {isSignUp ? "Criar Conta" : "Portal de Vendas & Financeiro"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Users Quick Access */}
          {!isSignUp && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-300">Acesso Rápido - Contas Demo:</Label>
              <div className="grid gap-2">
                {demoUsers.map((user) => {
                  const IconComponent = user.icon;
                  return (
                    <Button 
                      key={user.email}
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDemoLogin(user.email, user.password)}
                      disabled={loading}
                      className="w-full justify-start text-xs border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                      <IconComponent className="mr-2 h-3 w-3" />
                      {user.role} ({user.email})
                    </Button>
                  );
                })}
              </div>
              <Separator className="bg-slate-600" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="fullName" className="text-white">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? "Carregando..." : (isSignUp ? "Criar Conta" : "Entrar")}
            </Button>
          </form>
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-slate-300 hover:text-white"
            >
              {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Cadastre-se"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}