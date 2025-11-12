import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

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

        if (response.status === 503 && attempt < maxRetries) {
          const waitTime = attempt * 2000;
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

      return imageUrl;
      
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error);
      
      if (attempt === maxRetries || !(error instanceof Error && error.message.includes("503"))) {
        throw error;
      }
      
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = {
      candidatesProcessed: 0,
      candidatesSuccess: 0,
      candidatesFailed: 0,
      companiesProcessed: 0,
      companiesSuccess: 0,
      companiesFailed: 0,
      errors: [] as string[]
    };

    // Process candidates without photos
    console.log("Fetching candidates without photos...");
    const { data: candidates, error: candidatesError } = await supabase
      .from("profiles")
      .select("id, full_name, gender")
      .is("photo_url", null)
      .eq("is_active", true);

    if (candidatesError) {
      console.error("Error fetching candidates:", candidatesError);
      results.errors.push(`Error fetching candidates: ${candidatesError.message}`);
    } else if (candidates && candidates.length > 0) {
      console.log(`Found ${candidates.length} candidates without photos`);
      
      for (const candidate of candidates) {
        results.candidatesProcessed++;
        try {
          const prompt = `Generate a professional headshot photo of a ${candidate.gender === 'Masculino' ? 'male' : 'female'} person, photorealistic, neutral background, professional attire, front facing, suitable for job application profile picture`;
          
          console.log(`Generating photo for candidate ${candidate.full_name}`);
          const imageUrl = await generateImageWithRetry(prompt);
          
          // Convert base64 to blob
          const base64Data = imageUrl.split(",")[1];
          const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          
          // Upload to storage
          const fileName = `${candidate.id}-${Date.now()}.png`;
          const { error: uploadError } = await supabase.storage
            .from("profile-photos")
            .upload(fileName, binaryData, {
              contentType: "image/png",
              upsert: false
            });

          if (uploadError) {
            console.error(`Upload error for candidate ${candidate.full_name}:`, uploadError);
            results.candidatesFailed++;
            results.errors.push(`Upload failed for ${candidate.full_name}: ${uploadError.message}`);
            continue;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("profile-photos")
            .getPublicUrl(fileName);

          // Update profile
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ photo_url: publicUrl })
            .eq("id", candidate.id);

          if (updateError) {
            console.error(`Update error for candidate ${candidate.full_name}:`, updateError);
            results.candidatesFailed++;
            results.errors.push(`Update failed for ${candidate.full_name}: ${updateError.message}`);
          } else {
            results.candidatesSuccess++;
            console.log(`Successfully generated photo for ${candidate.full_name}`);
          }

          // Add delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`Error processing candidate ${candidate.full_name}:`, error);
          results.candidatesFailed++;
          results.errors.push(`Failed for ${candidate.full_name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Process companies without logos
    console.log("Fetching companies without logos...");
    const { data: companies, error: companiesError } = await supabase
      .from("company_profiles")
      .select("user_id, fantasy_name")
      .is("logo_url", null)
      .eq("is_active", true);

    if (companiesError) {
      console.error("Error fetching companies:", companiesError);
      results.errors.push(`Error fetching companies: ${companiesError.message}`);
    } else if (companies && companies.length > 0) {
      console.log(`Found ${companies.length} companies without logos`);
      
      for (const company of companies) {
        results.companiesProcessed++;
        try {
          const prompt = `Generate a modern, professional company logo for "${company.fantasy_name}", clean design, minimalist, suitable for tech/business company, square format`;
          
          console.log(`Generating logo for company ${company.fantasy_name}`);
          const imageUrl = await generateImageWithRetry(prompt);
          
          // Convert base64 to blob
          const base64Data = imageUrl.split(",")[1];
          const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          
          // Upload to storage
          const fileName = `company-${company.user_id}-${Date.now()}.png`;
          const { error: uploadError } = await supabase.storage
            .from("profile-photos")
            .upload(fileName, binaryData, {
              contentType: "image/png",
              upsert: false
            });

          if (uploadError) {
            console.error(`Upload error for company ${company.fantasy_name}:`, uploadError);
            results.companiesFailed++;
            results.errors.push(`Upload failed for ${company.fantasy_name}: ${uploadError.message}`);
            continue;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("profile-photos")
            .getPublicUrl(fileName);

          // Update company profile
          const { error: updateError } = await supabase
            .from("company_profiles")
            .update({ logo_url: publicUrl })
            .eq("user_id", company.user_id);

          if (updateError) {
            console.error(`Update error for company ${company.fantasy_name}:`, updateError);
            results.companiesFailed++;
            results.errors.push(`Update failed for ${company.fantasy_name}: ${updateError.message}`);
          } else {
            results.companiesSuccess++;
            console.log(`Successfully generated logo for ${company.fantasy_name}`);
          }

          // Add delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`Error processing company ${company.fantasy_name}:`, error);
          results.companiesFailed++;
          results.errors.push(`Failed for ${company.fantasy_name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    console.log("Auto-generation completed:", results);

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in auto-generate-profile-images:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
