import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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
    )

    const testUsers = [
      { email: 'candidato1@teste.com', password: 'Senha123!', role: 'candidate' },
      { email: 'candidato2@teste.com', password: 'Senha123!', role: 'candidate' },
      { email: 'candidato3@teste.com', password: 'Senha123!', role: 'candidate' },
      { email: 'candidato4@teste.com', password: 'Senha123!', role: 'candidate' },
      { email: 'candidato5@teste.com', password: 'Senha123!', role: 'candidate' },
      { email: 'empresa1@teste.com', password: 'Senha123!', role: 'company' },
      { email: 'empresa2@teste.com', password: 'Senha123!', role: 'company' },
      { email: 'empresa3@teste.com', password: 'Senha123!', role: 'company' },
      { email: 'empresa4@teste.com', password: 'Senha123!', role: 'company' },
      { email: 'empresa5@teste.com', password: 'Senha123!', role: 'company' },
      { email: 'admin@teste.com', password: 'Senha123!', role: 'admin' },
    ]

    const results = []

    for (const user of testUsers) {
      try {
        // Create user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            role: user.role,
            full_name: user.role === 'candidate' ? `Candidato ${user.email.split('@')[0]}` : 
                       user.role === 'company' ? `Empresa ${user.email.split('@')[0]}` : 'Admin'
          }
        })

        if (authError) {
          results.push({ email: user.email, success: false, error: authError.message })
          continue
        }

        // Insert user role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: user.role
          })

        if (roleError) {
          results.push({ email: user.email, success: false, error: roleError.message })
          continue
        }

        results.push({ email: user.email, success: true, userId: authData.user.id })
      } catch (err) {
        results.push({ email: user.email, success: false, error: String(err) })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Criados ${results.filter(r => r.success).length} de ${testUsers.length} usuários`,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
