import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { email } = await req.json();
    
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract domain from email
    const domain = email.split('@')[1];
    
    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Email inválido', valid: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if domain has MX records using Deno's native resolveDns
    try {
      const mxRecords = await Deno.resolveDns(domain, "MX");
      
      if (!mxRecords || mxRecords.length === 0) {
        console.log(`Domain ${domain} has no MX records`);
        return new Response(
          JSON.stringify({ 
            error: 'Este domínio de email não existe ou não pode receber emails',
            valid: false 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Domain ${domain} verified with ${mxRecords.length} MX records`);
      return new Response(
        JSON.stringify({ valid: true, mxRecords: mxRecords.length }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (dnsError) {
      console.error(`DNS lookup failed for ${domain}:`, dnsError);
      return new Response(
        JSON.stringify({ 
          error: 'Não foi possível verificar este domínio de email. Verifique se está correto.',
          valid: false 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error verifying email domain:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao verificar email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
