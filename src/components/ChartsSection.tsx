import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { TrendingUp, Target, Users, DollarSign } from "lucide-react";

const performanceData = [
  { name: 'Jan', meta: 100000, realizado: 85000 },
  { name: 'Fev', meta: 110000, realizado: 95000 },
  { name: 'Mar', meta: 120000, realizado: 118000 },
  { name: 'Abr', meta: 115000, realizado: 108000 },
  { name: 'Mai', meta: 125000, realizado: 132000 },
  { name: 'Jun', meta: 130000, realizado: 125000 },
];

const funnelData = [
  { name: 'Prospecção', value: 450, conversion: 100 },
  { name: 'Qualificado', value: 189, conversion: 42 },
  { name: 'Proposta', value: 126, conversion: 28 },
  { name: 'Negociação', value: 81, conversion: 18 },
  { name: 'Fechado', value: 54, conversion: 12 },
];

const sourceData = [
  { name: 'Website', value: 35, color: '#3b82f6' },
  { name: 'Indicação', value: 28, color: '#06d6a0' },
  { name: 'Redes Sociais', value: 20, color: '#f72585' },
  { name: 'Eventos', value: 12, color: '#fb8500' },
  { name: 'Outbound', value: 5, color: '#8338ec' },
];

const activityData = [
  { day: 'Seg', calls: 15, meetings: 8, emails: 25 },
  { day: 'Ter', calls: 18, meetings: 12, emails: 30 },
  { day: 'Qua', calls: 22, meetings: 10, emails: 28 },
  { day: 'Qui', calls: 20, meetings: 15, emails: 35 },
  { day: 'Sex', calls: 25, meetings: 18, emails: 40 },
  { day: 'Sáb', calls: 8, meetings: 5, emails: 15 },
  { day: 'Dom', calls: 5, meetings: 2, emails: 10 },
];

export function ChartsSection() {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Chart */}
      <Card className="shadow-card hover:shadow-metric transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-primary" />
                Performance de Vendas
              </CardTitle>
              <CardDescription>Meta vs Realizado (últimos 6 meses)</CardDescription>
            </div>
            <Badge variant="outline">Mensal</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: any) => [`R$ ${value.toLocaleString()}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="hsl(var(--chart-secondary))" 
                strokeWidth={2}
                name="Meta"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="realizado" 
                stroke="hsl(var(--chart-primary))" 
                strokeWidth={3}
                name="Realizado"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Funil de Conversão */}
      <Card className="shadow-card hover:shadow-metric transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-chart-secondary" />
                Funil de Conversão
              </CardTitle>
              <CardDescription>Taxa de conversão por etapa</CardDescription>
            </div>
            <Badge variant="outline">Este mês</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ 
                      backgroundColor: `hsl(var(--chart-primary))`,
                      opacity: 1 - (index * 0.15)
                    }}
                  />
                  <span className="font-medium">{stage.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">{stage.value}</span>
                  <Badge 
                    variant={stage.conversion >= 20 ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {stage.conversion}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fontes de Leads */}
      <Card className="shadow-card hover:shadow-metric transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-success" />
                Fontes de Leads
              </CardTitle>
              <CardDescription>Distribuição por canal de aquisição</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Ver detalhes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="outside"
                  formatter={(value: any) => `${value}%`}
                />
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: any, name: any) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {sourceData.map((source) => (
              <div key={source.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-sm text-muted-foreground">{source.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividade da Equipe */}
      <Card className="shadow-card hover:shadow-metric transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-warning" />
                Atividade da Equipe
              </CardTitle>
              <CardDescription>Ligações, reuniões e emails por dia</CardDescription>
            </div>
            <Badge variant="outline">Esta semana</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="calls" fill="hsl(var(--chart-primary))" name="Ligações" />
              <Bar dataKey="meetings" fill="hsl(var(--chart-secondary))" name="Reuniões" />
              <Bar dataKey="emails" fill="hsl(var(--success))" name="Emails" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}