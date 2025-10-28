import { Toaster } from "@/components/ui/toaster"; 
// Importa o componente de notificações (toasts) padrão da interface

import { Toaster as Sonner } from "@/components/ui/sonner"; 
// Importa outro tipo de sistema de notificações, renomeado como "Sonner" para evitar conflito de nome

import { TooltipProvider } from "@/components/ui/tooltip"; 
// Fornece contexto para tooltips (dicas exibidas ao passar o mouse em elementos)

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
// Importa o React Query, que gerencia requisições e cache de dados da API

import { BrowserRouter, Routes, Route } from "react-router-dom"; 
// Importa o sistema de rotas do React (navegação entre páginas)

import { ThemeProvider } from "./contexts/ThemeContext";
// Importa o provedor de tema para dark mode global

import Index from "./pages/Index"; 
// Página principal (rota "/")

import Auth from "./pages/Auth";
// Página de autenticação (login)

import Register from "./pages/Register";
// Página de cadastro

import CompanyDashboard from "./pages/CompanyDashboard";
// Dashboard da empresa

import CandidateDashboard from "./pages/CandidateDashboard";
// Dashboard do candidato

import CandidateProfile from "./pages/CandidateProfile";
// Perfil do candidato

import CompanyProfile from "./pages/CompanyProfile";
// Perfil da empresa

import AboutUs from "./pages/AboutUs";
// Página Quem Somos (redireciona baseado no tipo de usuário)

import CompanyAbout from "./pages/CompanyAbout";
// Página Quem Somos - Empresa

import CandidateAbout from "./pages/CandidateAbout";
// Página Quem Somos - Candidato

import Support from "./pages/Support";
// Página de Suporte (redireciona baseado no tipo de usuário)

import CompanySupport from "./pages/CompanySupport";
// Página de Suporte - Empresa

import CandidateSupport from "./pages/CandidateSupport";
// Página de Suporte - Candidato

import TermsCandidate from "./pages/TermsCandidate";
// Termos de Uso - Candidatos

import TermsCompany from "./pages/TermsCompany";
// Termos de Uso - Empresas

import Settings from "./pages/Settings";
// Página de Configurações
import CompanySettings from "./pages/CompanySettings";
import CandidateSettings from "./pages/CandidateSettings";

import Account from "./pages/Account";
// Página de Conta

import ChangePassword from "./pages/ChangePassword";
// Página de Alterar Senha

import ChangeEmail from "./pages/ChangeEmail";
// Página de Alterar Email

import DeactivateAccount from "./pages/DeactivateAccount";
// Página de Desativar Conta

import DeleteAccount from "./pages/DeleteAccount";
// Página de Deletar Conta

import EditCandidateProfile from "./pages/EditCandidateProfile";
// Página de Editar Perfil do Candidato

import EditCompanyProfile from "./pages/EditCompanyProfile";
// Página de Editar Perfil da Empresa

import CreateJob from "./pages/CreateJob";
// Página de Cadastrar Vagas

import CompanyJobs from "./pages/CompanyJobs";
// Página de Minhas Vagas (Empresa)

import CompanyJobDetails from "./pages/CompanyJobDetails";
// Página de Detalhes da Vaga (Empresa)

import JobCandidates from "./pages/JobCandidates";
// Página de Candidatos da Vaga

import JobDetails from "./pages/JobDetails";
// Página de Detalhes da Vaga

import JobApplication from "./pages/JobApplication";
// Página de Candidatura à Vaga

import MyApplications from "./pages/MyApplications";
// Página de Minhas Candidaturas

import CompanyPublicProfile from "./pages/CompanyPublicProfile";
// Página pública do Perfil da Empresa (visualização)

import ForgotPassword from "./pages/ForgotPassword";
// Página de Recuperar Senha

import NotFound from "./pages/NotFound";
// Página exibida quando a rota não existe (erro 404)

const queryClient = new QueryClient(); 
// Cria uma instância do cliente React Query (gerencia cache e estado das requisições)

const App = () => (
  // Componente principal da aplicação
  <QueryClientProvider client={queryClient}>
    {/* Fornece o contexto do React Query para toda a aplicação */}
    <ThemeProvider>
      {/* Fornece o contexto de tema (dark mode) para toda a aplicação */}
      <TooltipProvider>
        {/* Fornece o contexto para tooltips (dicas de interface) */}
        <Toaster />
        {/* Componente de notificações padrão */}
        <Sonner />
        {/* Outro sistema de notificações (personalizado) */}
        <BrowserRouter>
          {/* Habilita o roteamento baseado em URLs */}
          <Routes>
            {/* Define as rotas da aplicação */}
            <Route path="/auth" element={<Auth />} />
            {/* Página de login */}
            
            <Route path="/register" element={<Register />} />
            {/* Página de cadastro */}
            
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            {/* Dashboard da empresa */}
            
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
            {/* Dashboard do candidato */}
            
            <Route path="/candidate-profile" element={<CandidateProfile />} />
            {/* Perfil do candidato */}
            
            <Route path="/company-profile" element={<CompanyProfile />} />
            {/* Perfil da empresa */}
            
            <Route path="/about" element={<AboutUs />} />
            {/* Página Quem Somos (redireciona baseado no tipo de usuário) */}
            
            <Route path="/company-about" element={<CompanyAbout />} />
            {/* Página Quem Somos - Empresa */}
            
            <Route path="/candidate-about" element={<CandidateAbout />} />
            {/* Página Quem Somos - Candidato */}
            
            <Route path="/support" element={<Support />} />
            {/* Página de Suporte (redireciona baseado no tipo de usuário) */}
            
            <Route path="/company-support" element={<CompanySupport />} />
            {/* Página de Suporte - Empresa */}
            
            <Route path="/candidate-support" element={<CandidateSupport />} />
            {/* Página de Suporte - Candidato */}
            
            <Route path="/terms-candidate" element={<TermsCandidate />} />
            {/* Termos de Uso - Candidatos */}
            
            <Route path="/terms-company" element={<TermsCompany />} />
            {/* Termos de Uso - Empresas */}
            
            <Route path="/settings" element={<Settings />} />
            {/* Página de Configurações (redireciona baseado no tipo de usuário) */}
            
            <Route path="/company-settings" element={<CompanySettings />} />
            {/* Página de Configurações da Empresa */}
            
            <Route path="/candidate-settings" element={<CandidateSettings />} />
            {/* Página de Configurações do Candidato */}
            
            <Route path="/account" element={<Account />} />
            {/* Página de Conta */}
            
            <Route path="/change-password" element={<ChangePassword />} />
            {/* Página de Alterar Senha */}
            
            <Route path="/change-email" element={<ChangeEmail />} />
            {/* Página de Alterar Email */}
            
            <Route path="/deactivate-account" element={<DeactivateAccount />} />
            {/* Página de Desativar Conta */}
            
            <Route path="/delete-account" element={<DeleteAccount />} />
            {/* Página de Deletar Conta */}
            
            <Route path="/edit-candidate-profile" element={<EditCandidateProfile />} />
            {/* Página de Editar Perfil do Candidato */}
            
            <Route path="/edit-company-profile" element={<EditCompanyProfile />} />
            {/* Página de Editar Perfil da Empresa */}
            
            <Route path="/create-job" element={<CreateJob />} />
            {/* Página de Cadastrar Vagas */}
            
            <Route path="/company-jobs" element={<CompanyJobs />} />
            {/* Página de Minhas Vagas (Empresa) */}
            
            <Route path="/company-job/:jobId" element={<CompanyJobDetails />} />
            {/* Página de Detalhes da Vaga (Empresa) */}
            
            <Route path="/job-candidates/:jobId" element={<JobCandidates />} />
            {/* Página de Candidatos da Vaga */}
            
            <Route path="/job/:id" element={<JobDetails />} />
            {/* Página de Detalhes da Vaga */}
            
            <Route path="/job/:id/apply" element={<JobApplication />} />
            {/* Página de Candidatura à Vaga */}
            
            <Route path="/my-applications" element={<MyApplications />} />
            {/* Página de Minhas Candidaturas */}
            
            <Route path="/company/:id/profile" element={<CompanyPublicProfile />} />
            {/* Página pública do Perfil da Empresa (visualização) */}
            
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Página de Recuperar Senha */}
            
            <Route path="/" element={<Index />} />
            {/* Página inicial (protegida) */}
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            {/* Comentário lembrando que novas rotas devem vir antes da rota coringa */}
            
            <Route path="*" element={<NotFound />} />
            {/* Rota coringa ("*") para páginas não encontradas */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App; 
// Exporta o componente App para ser usado em main.tsx (ponto de entrada da aplicação)
