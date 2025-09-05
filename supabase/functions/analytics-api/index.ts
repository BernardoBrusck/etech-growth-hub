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

    const url = new URL(req.url);
    const type = url.searchParams.get('type');

    switch (type) {
      case 'metrics':
        // Dashboard metrics
        const [
          { count: totalLeads },
          { data: closedDeals },
          { data: monthlyRevenue },
          { data: goals }
        ] = await Promise.all([
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('deals').select('*').eq('status', 'closed'),
          supabase.from('financial_transactions').select('amount').eq('type', 'revenue'),
          supabase.from('goals').select('current_value, target_value')
        ]);

        const conversionRate = totalLeads ? Math.round((closedDeals?.length || 0) / totalLeads * 100) : 0;
        const totalRevenue = monthlyRevenue?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
        
        let goalProgress = 0;
        if (goals && goals.length > 0) {
          const totalCurrent = goals.reduce((sum, g) => sum + Number(g.current_value || 0), 0);
          const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_value || 0), 0);
          goalProgress = totalTarget ? Math.round(totalCurrent / totalTarget * 100) : 0;
        }

        return new Response(JSON.stringify({
          data: {
            totalLeads: totalLeads || 0,
            conversionRate,
            monthlyRevenue: totalRevenue,
            goalProgress
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'sales-chart':
        // Sales performance chart data
        const { data: salesData } = await supabase
          .from('deals')
          .select('value, actual_close_date, created_at')
          .eq('status', 'closed')
          .order('actual_close_date', { ascending: true });

        const chartData = salesData?.map(deal => ({
          date: deal.actual_close_date || deal.created_at,
          value: Number(deal.value),
          month: new Date(deal.actual_close_date || deal.created_at).toLocaleDateString('pt-BR', { month: 'short' })
        })) || [];

        return new Response(JSON.stringify({ data: chartData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'pipeline':
        // Pipeline analysis
        const { data: pipelineData } = await supabase
          .from('leads')
          .select('stage, status, value')
          .order('stage');

        const pipeline = pipelineData?.reduce((acc, lead) => {
          const stage = lead.stage;
          if (!acc[stage]) {
            acc[stage] = { count: 0, value: 0 };
          }
          acc[stage].count++;
          acc[stage].value += Number(lead.value || 0);
          return acc;
        }, {} as Record<string, { count: number; value: number }>) || {};

        return new Response(JSON.stringify({ data: pipeline }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'activities':
        // Recent activities
        const { data: activities } = await supabase
          .from('activities')
          .select(`
            *,
            lead:leads(name),
            deal:deals(title)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        return new Response(JSON.stringify({ data: activities }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Tipo de analítica não especificado' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in analytics-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});