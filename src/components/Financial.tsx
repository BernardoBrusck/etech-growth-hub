import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "pending" | "completed" | "cancelled";
  leadId?: string;
}

export function Financial() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      category: "Vendas",
      description: "Venda para Tech Solutions - João Silva",
      amount: 15000,
      date: "2024-03-10",
      status: "completed",
      leadId: "1"
    },
    {
      id: "2",
      type: "income", 
      category: "Vendas",
      description: "Venda para StartupX - Pedro Oliveira",
      amount: 30000,
      date: "2024-03-08",
      status: "completed",
      leadId: "3"
    },
    {
      id: "3",
      type: "expense",
      category: "Marketing",
      description: "Campanha Google Ads",
      amount: 2500,
      date: "2024-03-05",
      status: "completed"
    },
    {
      id: "4",
      type: "expense",
      category: "Operacional",
      description: "Software CRM - Licenças mensais",
      amount: 890,
      date: "2024-03-01",
      status: "completed"
    },
    {
      id: "5",
      type: "income",
      category: "Vendas",
      description: "Proposta Digital Corp - Maria Santos",
      amount: 25000,
      date: "2024-03-15",
      status: "pending",
      leadId: "2"
    }
  ]);

  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "income" as Transaction["type"],
    category: "",
    description: "",
    amount: "",
    date: "",
    status: "completed" as Transaction["status"]
  });

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingIncome = transactions
    .filter(t => t.type === "income" && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed": return <Badge className="bg-success text-success-foreground">Concluído</Badge>;
      case "pending": return <Badge variant="secondary">Pendente</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelado</Badge>;
    }
  };

  const handleCreateTransaction = () => {
    if (!newTransaction.category || !newTransaction.description || !newTransaction.amount || !newTransaction.date) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      type: "income",
      category: "",
      description: "",
      amount: "",
      date: "",
      status: "completed"
    });
    setShowNewTransactionModal(false);

    toast({
      title: "Transação criada com sucesso!",
      description: `${transaction.type === "income" ? "Receita" : "Despesa"} de R$ ${transaction.amount.toLocaleString()} adicionada.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Financeiro</h2>
          <p className="text-muted-foreground">Controle suas receitas, despesas e fluxo de caixa</p>
        </div>
        <Dialog open={showNewTransactionModal} onOpenChange={setShowNewTransactionModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Registre uma nova receita ou despesa.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo*</Label>
                <Select value={newTransaction.type} onValueChange={(value: Transaction["type"]) => setNewTransaction({ ...newTransaction, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria*</Label>
                <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {newTransaction.type === "income" ? (
                      <>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Serviços">Serviços</SelectItem>
                        <SelectItem value="Consultorias">Consultorias</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Operacional">Operacional</SelectItem>
                        <SelectItem value="Pessoal">Pessoal</SelectItem>
                        <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição*</Label>
                <Input
                  id="description"
                  placeholder="Descrição da transação"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor*</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data*</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewTransactionModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleCreateTransaction} className="flex-1">
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-metric hover:shadow-hover transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">R$ {totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-success" />
              +23% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-metric hover:shadow-hover transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">R$ {totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 text-destructive" />
              +8% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-metric hover:shadow-hover transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? "text-success" : "text-destructive"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-success" : "text-destructive"}`}>
              R$ {netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-success" />
              Margem: {((netProfit / totalIncome) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-metric hover:shadow-hover transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Pendente</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">R$ {pendingIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="shadow-metric">
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Histórico de receitas e despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                        {transaction.type === "income" ? (
                          <TrendingUp className={`h-4 w-4 text-success`} />
                        ) : (
                          <TrendingDown className={`h-4 w-4 text-destructive`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>
                          {transaction.type === "income" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="income" className="mt-4">
              <div className="space-y-4">
                {transactions.filter(t => t.type === "income").map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-success/10">
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-success">+R$ {transaction.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="expense" className="mt-4">
              <div className="space-y-4">
                {transactions.filter(t => t.type === "expense").map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-destructive">-R$ {transaction.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <div className="space-y-4">
                {transactions.filter(t => t.status === "pending").map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>
                          {transaction.type === "income" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}