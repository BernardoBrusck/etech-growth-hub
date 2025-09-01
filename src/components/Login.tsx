import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
}

// Demo user credentials
const DEMO_USERS = [
  {
    email: "admin@etech.com",
    password: "admin123",
    name: "Ana Costa",
    role: "Administrador"
  },
  {
    email: "gerente@etech.com", 
    password: "gerente123",
    name: "Carlos Lima",
    role: "Gerente Comercial"
  },
  {
    email: "vendedor@etech.com",
    password: "vendedor123", 
    name: "Beatriz Santos",
    role: "Vendedor"
  }
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user.name}`,
      });
      onLogin(user);
    } else {
      setError("Email ou senha incorretos. Tente as credenciais de demonstração.");
    }
    
    setLoading(false);
  };

  const fillDemoCredentials = (userType: string) => {
    const user = DEMO_USERS.find(u => u.role === userType);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-metric animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">E</span>
          </div>
          <div>
            <CardTitle className="text-2xl">ETECH Jr. CRM</CardTitle>
            <CardDescription>
              Entre na sua conta para acessar o dashboard
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="space-y-3">
            <div className="text-center text-sm text-muted-foreground">
              Credenciais de demonstração:
            </div>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("Administrador")}
                className="text-xs"
              >
                Admin: admin@etech.com / admin123
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("Gerente Comercial")}
                className="text-xs"
              >
                Gerente: gerente@etech.com / gerente123
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("Vendedor")}
                className="text-xs"
              >
                Vendedor: vendedor@etech.com / vendedor123
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}