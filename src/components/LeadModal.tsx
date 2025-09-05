import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (leadData: {
    name: string;
    company: string;
    email: string;
    phone: string;
    status: "novo" | "contato" | "negociacao" | "fechado" | "perdido";
    stage: "prospeccao" | "diagnostico" | "negociacao" | "fechamento" | "c7";
    value: number;
    responsible: string;
  }) => void;
}

export function LeadModal({ open, onOpenChange, onSubmit }: LeadModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "novo" as const,
    stage: "prospeccao" as const,
    value: "",
    responsible: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.company || !formData.email || !formData.phone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      stage: formData.stage,
      value: parseFloat(formData.value) || 0,
      responsible: formData.responsible || "Ana Costa"
    });

    toast({
      title: "Sucesso",
      description: "Lead criado com sucesso!",
      variant: "default",
    });

    // Reset form
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "novo",
      stage: "prospeccao",
      value: "",
      responsible: "",
      notes: ""
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
          <DialogDescription>
            Adicione um novo lead ao seu pipeline de vendas
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="João Silva"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Empresa *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Tech Solutions"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@empresa.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="contato">Em Contato</SelectItem>
                  <SelectItem value="negociacao">Negociação</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Etapa do Funil</Label>
              <Select value={formData.stage} onValueChange={(value: any) => setFormData({ ...formData, stage: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospeccao">Prospecção</SelectItem>
                  <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                  <SelectItem value="negociacao">Negociação</SelectItem>
                  <SelectItem value="fechamento">Fechamento</SelectItem>
                  <SelectItem value="c7">C7</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor Estimado</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="15000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Select value={formData.responsible} onValueChange={(value) => setFormData({ ...formData, responsible: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                <SelectItem value="Carlos Lima">Carlos Lima</SelectItem>
                <SelectItem value="Beatriz Santos">Beatriz Santos</SelectItem>
                <SelectItem value="Rafael Oliveira">Rafael Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas adicionais sobre o lead..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}