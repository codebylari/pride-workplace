import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const accounts = [];
    
    // Timestamp único para evitar conflitos
    const timestamp = Date.now();

    // Criar 10 candidatos
    const candidateNames = [
      "Ana Silva", "Bruno Costa", "Carla Souza", "Daniel Lima", "Elisa Martins",
      "Felipe Santos", "Gabriela Rocha", "Henrique Alves", "Isabela Ferreira", "João Oliveira"
    ];

    const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"];
    const states = ["SP", "RJ", "MG", "PR", "RS"];
    const areas = ["Desenvolvimento Web", "UI/UX Design", "Marketing Digital", "Data Science", "Mobile"];
    
    // Opções de qualificação
    const specializationOptions = [
      ["Desenvolvimento de Software", "Inteligência Artificial"],
      ["Ciências de Dados", "Análise de Dados"],
      ["Testes", "Cibersegurança"],
      ["Infraestrutura", "Nuvens"],
      ["Desing", "Arquitetura"],
      ["Blockchain", "Engenharia de Dados"],
      ["Suporte Técnico", "Desenvolvimento de Software"],
      ["Inteligência Artificial", "Ciências de Dados"],
      ["Desenvolvimento de Software", "Testes"],
      ["Análise de Dados", "Infraestrutura"]
    ];
    
    const experienceLevels = ["Júnior", "Pleno", "Sênior", "Especialista"];
    const githubLevels = ["Nenhum conhecimento", "Básico", "Intermediário", "Avançado"];
    const opportunityTypes = [
      ["CLT", "Freelancer"],
      ["Estágio", "CLT"],
      ["CLT"],
      ["Freelancer", "Temporário"],
      ["CLT", "Trainee"],
      ["Aprendiz", "Estágio"],
      ["CLT", "Freelancer"],
      ["Freelancer"],
      ["CLT", "Temporário"],
      ["Estágio", "CLT"]
    ];
    const remotePreferences = ["sim", "talvez", "nao"];

    for (let i = 0; i < 10; i++) {
      const email = `candidato${i + 1}.${timestamp}@teste.com`;
      const password = `Teste@${i + 1}23`;
      const cityIndex = i % cities.length;

      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "candidate", full_name: candidateNames[i] },
      });

      if (userError) {
        console.error(`Error creating candidate ${i + 1}:`, userError);
        continue; // Skip this user and continue with the next
      }

      await supabaseAdmin.from("user_roles").insert({
        user_id: userData.user.id,
        role: "candidate",
      });

      await supabaseAdmin.from("profiles").upsert({
        id: userData.user.id,
        full_name: candidateNames[i],
        city: cities[cityIndex],
        state: states[cityIndex],
        gender: i % 2 === 0 ? "masculino" : "feminino",
        about_me: `Profissional de ${areas[i % areas.length]} com experiência em projetos diversos.`,
        experience: `${3 + i} anos de experiência em ${areas[i % areas.length]}. Trabalhei em empresas de tecnologia desenvolvendo soluções inovadoras.`,
        education: "Graduação em Ciência da Computação - Universidade Federal",
        journey: "Iniciei minha carreira como estagiário e cresci profissionalmente através de dedicação e aprendizado contínuo.",
        linkedin_url: `https://linkedin.com/in/candidato${i + 1}`,
        specialization_areas: specializationOptions[i],
        work_area: areas[i % areas.length],
        experience_level: experienceLevels[i % experienceLevels.length],
        opportunity_type: opportunityTypes[i],
        github_level: githubLevels[i % githubLevels.length],
        remote_preference: remotePreferences[i % remotePreferences.length],
        is_lgbt: i % 3 === 0,
        is_pcd: i % 4 === 0,
        pcd_type: i % 4 === 0 ? "Física" : null,
      });

      accounts.push({ tipo: "Candidato", nome: candidateNames[i], email, senha: password });
    }

    // Criar 10 empresas
    const companyNames = [
      "TechNova", "InnovaCorp", "DataSolutions", "WebMasters", "DesignPro",
      "CodeFactory", "CloudServices", "AppCreators", "DigitalHub", "FutureTech"
    ];

    for (let i = 0; i < 10; i++) {
      const email = `empresa${i + 1}.${timestamp}@teste.com`;
      const password = `Empresa@${i + 1}23`;
      const cityIndex = i % cities.length;

      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "company" },
      });

      if (userError) {
        console.error(`Error creating company ${i + 1}:`, userError);
        continue; // Skip this company and continue with the next
      }

      await supabaseAdmin.from("user_roles").insert({
        user_id: userData.user.id,
        role: "company",
      });

      await supabaseAdmin.from("company_profiles").insert({
        user_id: userData.user.id,
        fantasy_name: companyNames[i],
        cnpj: `${10000000 + i}000001${i}`,
        city: cities[cityIndex],
        state: states[cityIndex],
        sector: areas[i % areas.length],
        about: `${companyNames[i]} é uma empresa líder em tecnologia, focada em inovação e qualidade.`,
        description: `Somos uma empresa moderna que busca talentos para projetos desafiadores e ambiente colaborativo.`,
      });

      // Criar 3-5 vagas por empresa
      const numJobs = 3 + (i % 3);
      const jobTitles = [
        "Desenvolvedor Frontend", "Desenvolvedor Backend", "Designer UI/UX", 
        "Analista de Dados", "Gerente de Projetos", "Desenvolvedor Mobile"
      ];

      for (let j = 0; j < numJobs; j++) {
        const jobArea = areas[j % areas.length];
        const isRemote = j % 3 === 0;
        const requiredLevel = experienceLevels[(i + j) % experienceLevels.length];
        const requiredGithub = githubLevels[(i + j) % githubLevels.length];
        
        await supabaseAdmin.from("jobs").insert({
          company_id: userData.user.id,
          title: jobTitles[j % jobTitles.length],
          description: `Área: ${jobArea}\n\nBenefícios: Vale alimentação, Vale transporte, Plano de saúde, Home office flexível\n\nExperiência Necessária: ${2 + j} anos de experiência em ${jobArea}\n\nPeríodo de Contratação: Imediato`,
          job_type: isRemote ? "Remoto" : j % 2 === 1 ? "Presencial" : "Híbrido",
          location: isRemote ? "Remoto" : cities[cityIndex],
          salary: `R$ ${3000 + (j * 1000)} - R$ ${5000 + (j * 1500)}`,
          requirements: `${requiredLevel} com conhecimento em GitHub ${requiredGithub}. Experiência em ${jobArea}.`,
          required_experience_level: requiredLevel,
          required_github_level: requiredGithub,
          required_specialization_areas: specializationOptions[(i + j) % specializationOptions.length],
          is_remote: isRemote,
        });
      }

      accounts.push({ tipo: "Empresa", nome: companyNames[i], email, senha: password });
    }

    // Buscar todos os candidatos e vagas para criar inscrições
    const { data: profiles } = await supabaseAdmin.from("profiles").select("id");
    const { data: jobs } = await supabaseAdmin.from("jobs").select("id, requirements");

    // Cada candidato se inscreve em 3-5 vagas aleatórias compatíveis
    if (profiles && jobs) {
      for (const profile of profiles) {
        const numApplications = 3 + Math.floor(Math.random() * 3);
        const shuffledJobs = jobs.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < Math.min(numApplications, shuffledJobs.length); i++) {
          await supabaseAdmin.from("applications").insert({
            candidate_id: profile.id,
            job_id: shuffledJobs[i].id,
            status: "pending",
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Dados de teste criados com sucesso!",
        accounts 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
