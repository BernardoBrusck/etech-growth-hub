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
    const leadId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case 'GET':
        if (leadId && leadId !== 'leads-api') {
          // Get single lead
          const { data: lead, error } = await supabase
            .from('leads')
            .select(`
              *,
              responsible:profiles(full_name)
            `)
            .eq('id', leadId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ data: lead }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all leads
          const { data: leads, error } = await supabase
            .from('leads')
            .select(`
              *,
              responsible:profiles(full_name)
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify({ data: leads }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        const leadData = await req.json();
        
        // Get user from auth header
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''));
        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: newLead, error } = await supabase
          .from('leads')
          .insert({
            ...leadData,
            responsible_id: user.id,
            days_in_stage: 0
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ data: newLead, message: 'Lead criado com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!leadId || leadId === 'leads-api') {
          return new Response(JSON.stringify({ error: 'Lead ID requerido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData = await req.json();
        const { data: updatedLead, error: updateError } = await supabase
          .from('leads')
          .update(updateData)
          .eq('id', leadId)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ data: updatedLead, message: 'Lead atualizado com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        if (!leadId || leadId === 'leads-api') {
          return new Response(JSON.stringify({ error: 'Lead ID requerido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: deleteError } = await supabase
          .from('leads')
          .delete()
          .eq('id', leadId);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ message: 'Lead removido com sucesso!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Método não permitido' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in leads-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});