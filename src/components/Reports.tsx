import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  FileDown, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Download,
  Filter
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { name: 'Jan', vendas: 65000, meta: 70000 },
  { name: 'Fev', vendas: 78000, meta: 80000 },
  { name: 'Mar', vendas: 82000, meta: 85000 },
  { name: 'Abr', vendas: 91000, meta: 90000 },
  { name: 'Mai', vendas: 87000, meta: 95000 },
  { name: 'Jun', vendas: 105000, meta: 100000 },
];

const funnelData = [
  { name: 'Prospecção', value: 100, count: 234 },
  { name: 'Qualificado', value: 65, count: 152 },
  { name: 'Proposta', value: 35, count: 82 },
  { name: 'Negociação', value: 20, count: 47 },
  { name: 'Fechado', value: 12, count: 28 },
];

const teamPerformance = [
  { name: 'Ana Costa', vendas: 25000, leads: 45, conversao: 24.5 },
  { name: 'Carlos Lima', vendas: 32000, leads: 38, conversao: 28.2 },
  { name: 'Beatriz Santos', vendas: 18000, leads: 52, conversao: 19.8 },
  { name: 'Rafael Oliveira', vendas: 27000, leads: 41, conversao: 25.6 },
];

const sourceData = [
  { name: 'Site', value: 35, color: '#3B82F6' },
  { name: 'Indicação', value: 28, color: '#10B981' },
  { name: 'Redes Sociais', value: 20, color: '#F59E0B' },
  { name: 'Eventos', value: 12, color: '#EF4444' },
  { name: 'Outros', value: 5, color: '#8B5CF6' },
];

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("last30days");
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");

  const exportReport = (format: string, reportType: string) => {
    // Mock export functionality
    const fileName = `relatorio-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exportando relatório: ${fileName}`);
    // In a real app, this would trigger actual file download
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Relatórios</h2>
          <p className="text-muted-foreground">Análise detalhada de performance e resultados</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Últimos 7 dias</SelectItem>
              <SelectItem value="last30days">Últimos 30 dias</SelectItem>
              <SelectItem value="last90days">Últimos 90 dias</SelectItem>
              <SelectItem value="thisyear">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="funnel">Funil</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="sources">Fontes</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-metric">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Performance de Vendas</CardTitle>
                  <CardDescription>Vendas vs Meta por mês</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportReport('pdf', 'vendas')}>
                  <FileDown className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value).toLocaleString()}`, 
                        name === 'vendas' ? 'Vendas' : 'Meta'
                      ]}
                    />
                    <Bar dataKey="meta" fill="hsl(var(--muted))" name="meta" />
                    <Bar dataKey="vendas" fill="hsl(var(--chart-primary))" name="vendas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-metric">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo do Período</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total de Vendas</span>
                    <span className="font-semibold text-success">R$ 508.000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Meta Total</span>
                    <span className="font-semibold">R$ 520.000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Atingimento</span>
                    <Badge className="bg-warning text-warning-foreground">97.7%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Crescimento</span>
                    <span className="font-semibold text-success">+23.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-metric">
                <CardHeader>
                  <CardTitle className="text-lg">Próximas Metas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-chart-primary" />
                    <span className="text-sm">Julho: R$ 110.000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-chart-secondary" />
                    <span className="text-sm">Q3: R$ 320.000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm">Ano: R$ 1.2M</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-metric">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Funil de Conversão</CardTitle>
                  <CardDescription>Taxa de conversão por etapa</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportReport('csv', 'funil')}>
                  <FileDown className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => (
                    <div key={stage.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stage.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{stage.count} leads</span>
                          <Badge variant="outline">{stage.value}%</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-chart-primary' :
                            index === 1 ? 'bg-chart-secondary' :
                            index === 2 ? 'bg-success' :
                            index === 3 ? 'bg-warning' : 'bg-destructive'
                          }`}
                          style={{ width: `${stage.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-metric">
              <CardHeader>
                <CardTitle>Análise de Conversão</CardTitle>
                <CardDescription>Insights do funil de vendas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Taxa de Conversão Geral</h4>
                  <div className="text-2xl font-bold text-chart-primary">12%</div>
                  <p className="text-xs text-muted-foreground">28 vendas de 234 leads</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Melhor Etapa</span>
                    <Badge className="bg-success text-success-foreground">Qualificação (65%)</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gargalo Principal</span>
                    <Badge variant="destructive">Negociação (20%)</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tempo Médio</span>
                    <span className="text-sm font-medium">24 dias</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h5 className="font-medium text-sm mb-2">Recomendações</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Melhorar processo de negociação</li>
                    <li>• Reduzir tempo na etapa de proposta</li>
                    <li>• Aumentar qualificação de leads</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-metric">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Performance da Equipe</CardTitle>
                  <CardDescription>Vendas e conversão por vendedor</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportReport('xlsx', 'equipe')}>
                  <FileDown className="h-4 w-4 mr-1" />
                  Excel
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformance.map((member, index) => (
                    <div key={member.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          index === 0 ? 'bg-chart-primary' :
                          index === 1 ? 'bg-chart-secondary' :
                          index === 2 ? 'bg-success' : 'bg-warning'
                        }`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.leads} leads</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-semibold">R$ {member.vendas.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Vendas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{member.conversao}%</p>
                          <p className="text-sm text-muted-foreground">Conversão</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-metric">
              <CardHeader>
                <CardTitle className="text-lg">Ranking do Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {teamPerformance
                    .sort((a, b) => b.vendas - a.vendas)
                    .map((member, index) => (
                      <div key={member.name} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-amber-600' : 'bg-muted'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">R$ {member.vendas.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-metric">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Fontes de Leads</CardTitle>
                  <CardDescription>Distribuição por canal de aquisição</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportReport('pdf', 'fontes')}>
                  <FileDown className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-metric">
              <CardHeader>
                <CardTitle className="text-lg">Análise por Fonte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sourceData.map((source, index) => (
                  <div key={source.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="font-medium">{source.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{source.value}%</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(source.value * 2.34)} leads
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-border">
                  <h5 className="font-medium text-sm mb-2">Insights</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Site é a principal fonte (35%)</li>
                    <li>• Indicações têm maior conversão</li>
                    <li>• Redes sociais crescendo 15%</li>
                    <li>• Investir mais em eventos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}