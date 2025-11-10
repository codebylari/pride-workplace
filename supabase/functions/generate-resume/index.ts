import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fullName, aboutMe, experience, education, journey } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    // Create prompt for AI to generate resume content
    const prompt = `Crie um currículo profissional e bem formatado em HTML para a seguinte pessoa:

Nome: ${fullName}

${aboutMe ? `Sobre: ${aboutMe}\n` : ''}
${experience ? `Experiências: ${experience}\n` : ''}
${education ? `Formação: ${education}\n` : ''}
${journey ? `Jornada: ${journey}\n` : ''}

O currículo deve:
- Ser profissional e bem estruturado
- Usar HTML com CSS inline para formatação elegante
- Incluir todas as seções relevantes
- Ter um design limpo e moderno
- Ser adequado para impressão
- Use cores sutis e profissionais
- Organize as informações de forma clara e hierárquica

Retorne APENAS o HTML completo, sem explicações adicionais.`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criação de currículos profissionais. Crie currículos bem formatados em HTML com CSS inline e encoding UTF-8 correto.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error('Erro ao gerar currículo com IA');
    }

    const aiData = await aiResponse.json();
    let htmlContent = aiData.choices[0].message.content;
    
    // Ensure HTML has proper UTF-8 meta tag if not present
    if (!htmlContent.includes('charset') && !htmlContent.includes('UTF-8')) {
      htmlContent = htmlContent.replace(
        /<head>/i,
        '<head>\n    <meta charset="UTF-8">'
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Convert HTML to PDF-ready format (you could use a PDF library here, but for now we'll save as HTML)
    // In production, consider using a PDF generation service
    const fileName = `resume-${user.id}-${Date.now()}.html`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Supabase Storage with UTF-8 encoding
    const encoder = new TextEncoder();
    const htmlBytes = encoder.encode(htmlContent);
    
    const { error: uploadError } = await supabaseClient.storage
      .from('profile-photos')
      .upload(filePath, htmlBytes, {
        contentType: 'text/html; charset=utf-8',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Erro ao salvar currículo');
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({ 
        resumeUrl: urlData.publicUrl,
        message: 'Currículo gerado com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in generate-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro ao gerar currículo',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
