import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get the user from the authorization header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;

    // First, get user role to determine what data to delete
    const { data: userRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    // Delete all related data using admin client (bypasses RLS)
    if (userRole?.role === 'company') {
      // Delete company-specific data
      await supabaseAdmin.from('jobs').delete().eq('company_id', userId);
      await supabaseAdmin.from('company_profiles').delete().eq('user_id', userId);
      await supabaseAdmin.from('matches').delete().eq('company_id', userId);
      await supabaseAdmin.from('testimonials').delete().eq('company_id', userId);
      await supabaseAdmin.from('ratings').delete().eq('rater_id', userId);
      await supabaseAdmin.from('ratings').delete().eq('rated_user_id', userId);
    } else {
      // Delete candidate-specific data
      await supabaseAdmin.from('applications').delete().eq('candidate_id', userId);
      await supabaseAdmin.from('profiles').delete().eq('id', userId);
      await supabaseAdmin.from('matches').delete().eq('candidate_id', userId);
      await supabaseAdmin.from('testimonials').delete().eq('candidate_id', userId);
      await supabaseAdmin.from('ratings').delete().eq('rater_id', userId);
      await supabaseAdmin.from('ratings').delete().eq('rated_user_id', userId);
    }

    // Delete common data
    await supabaseAdmin.from('swipes').delete().eq('user_id', userId);
    await supabaseAdmin.from('notifications').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_roles').delete().eq('user_id', userId);

    // Finally, delete user from auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});