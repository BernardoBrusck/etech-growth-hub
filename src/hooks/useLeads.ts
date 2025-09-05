import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  status: 'novo' | 'contato' | 'negociacao' | 'fechado' | 'perdido';
  stage: 'prospeccao' | 'diagnostico' | 'negociacao' | 'fechamento' | 'c7';
  value: number;
  responsible_id?: string;
  source?: string;
  notes?: string;
  days_in_stage: number;
  created_at: string;
  updated_at: string;
  responsible?: { full_name: string };
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          responsible:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os leads.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'days_in_stage' | 'responsible'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('leads')
        .insert({
          ...leadData,
          responsible_id: user.id,
          days_in_stage: 0
        });

      if (error) throw error;

      toast({
        title: "Lead criado!",
        description: "O lead foi adicionado com sucesso.",
      });

      loadLeads();
      return { success: true };
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o lead.",
      });
      return { success: false, error };
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Lead atualizado!",
        description: "As alterações foram salvas.",
      });

      loadLeads();
      return { success: true };
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o lead.",
      });
      return { success: false, error };
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Lead removido!",
        description: "O lead foi excluído com sucesso.",
      });

      loadLeads();
      return { success: true };
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o lead.",
      });
      return { success: false, error };
    }
  };

  return {
    leads,
    loading,
    loadLeads,
    createLead,
    updateLead,
    deleteLead,
  };
}