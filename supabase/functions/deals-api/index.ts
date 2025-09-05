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
    const dealId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case 'GET':
        if (dealId && dealId !== 'deals-api') {
          // Get single deal
          const { data: deal, error } = await supabase
            .from('deals')
            .select(`
              *,
              lead:leads(name, email, company_name),
              responsible:profiles(full_name),
              company:companies(name)
            `)
            .eq('id', dealId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ data: deal }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all deals
          const { data: deals, error } = await supabase
            .from('deals')
            .select(`
              *,
              lead:leads(name, email, company_name),
              responsible:profiles(full_name),
              company:companies(name)
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify({ data: deals }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        const dealData = await req.json();
        
        // Get user from auth header
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''));
        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: newDeal, error } = await supabase
          .from('deals')
          .insert({
            ...dealData,
            responsible_id: dealData.responsible_id || user.id
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ data: newDeal, message: 'Deal criado com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!dealId || dealId === 'deals-api') {
          return new Response(JSON.stringify({ error: 'Deal ID requerido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData = await req.json();
        const { data: updatedDeal, error: updateError } = await supabase
          .from('deals')
          .update(updateData)
          .eq('id', dealId)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ data: updatedDeal, message: 'Deal atualizado com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        if (!dealId || dealId === 'deals-api') {
          return new Response(JSON.stringify({ error: 'Deal ID requerido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: deleteError } = await supabase
          .from('deals')
          .delete()
          .eq('id', dealId);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ message: 'Deal removido com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Método não permitido' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in deals-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});