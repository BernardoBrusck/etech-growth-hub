import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const transactionId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case 'GET':
        if (transactionId && transactionId !== 'financial-api') {
          // Get single transaction
          const { data: transaction, error } = await supabase
            .from('financial_transactions')
            .select(`
              *,
              deal:deals(title)
            `)
            .eq('id', transactionId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ data: transaction }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all transactions with filters
          const type = url.searchParams.get('type');
          const category = url.searchParams.get('category');
          const startDate = url.searchParams.get('start_date');
          const endDate = url.searchParams.get('end_date');

          let query = supabase
            .from('financial_transactions')
            .select(`
              *,
              deal:deals(title)
            `)
            .order('transaction_date', { ascending: false });

          if (type) query = query.eq('type', type);
          if (category) query = query.eq('category', category);
          if (startDate) query = query.gte('transaction_date', startDate);
          if (endDate) query = query.lte('transaction_date', endDate);

          const { data: transactions, error } = await query;

          if (error) throw error;

          return new Response(JSON.stringify({ data: transactions }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        const transactionData = await req.json();
        
        // Get user from auth header
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''));
        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: newTransaction, error } = await supabase
          .from('financial_transactions')
          .insert({
            ...transactionData,
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ data: newTransaction, message: 'Transação criada com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!transactionId || transactionId === 'financial-api') {
          return new Response(JSON.stringify({ error: 'Transaction ID requerido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData = await req.json();
        const { data: updatedTransaction, error: updateError } = await supabase
          .from('financial_transactions')
          .update(updateData)
          .eq('id', transactionId)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ data: updatedTransaction, message: 'Transação atualizada com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        if (!transactionId || transactionId === 'financial-api') {
          return new Response(JSON.stringify({ error: 'Transaction ID requerido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: deleteError } = await supabase
          .from('financial_transactions')
          .delete()
          .eq('id', transactionId);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ message: 'Transação removida com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Método não permitido' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in financial-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});