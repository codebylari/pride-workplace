import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function generateImageWithRetry(prompt: string, maxRetries = 3): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to generate image`);
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          modalities: ["image", "text"]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI gateway error (attempt ${attempt}):`, response.status, errorText);
        
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        
        if (response.status === 402) {
          throw new Error("Payment required. Please add credits to your workspace.");
        }

        // Se for 503 e ainda temos tentativas, aguardar e tentar novamente
        if (response.status === 503 && attempt < maxRetries) {
          const waitTime = attempt * 2000; // Esperar 2s, 4s, 6s...
          console.log(`Service unavailable, waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        throw new Error(`AI gateway returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        console.error("No image URL in response:", JSON.stringify(data));
        throw new Error("No image generated in response");
      }

      console.log("Image generated successfully");
      return imageUrl;
      
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error);
      
      // Se não for 503 ou se acabaram as tentativas, lançar o erro
      if (attempt === maxRetries || !(error instanceof Error && error.message.includes("503"))) {
        throw error;
      }
      
      // Aguardar antes da próxima tentativa
      const waitTime = attempt * 2000;
      console.log(`Waiting ${waitTime}ms before next retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw new Error("Failed to generate image after all retries");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type } = await req.json();
    console.log(`Generating ${type} image with prompt:`, prompt);

    const imageUrl = await generateImageWithRetry(prompt);

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-profile-image:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred while generating image" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
