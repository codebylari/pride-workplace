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

import CompanyAbout from "./pages/CompanyAbout";
// Página Quem Somos - Empresa

import CandidateAbout from "./pages/CandidateAbout";
// Página Quem Somos - Candidato

import CompanySupport from "./pages/CompanySupport";
// Página de Suporte - Empresa

import CandidateSupport from "./pages/CandidateSupport";
// Página de Suporte - Candidato

import TermsCandidate from "./pages/TermsCandidate";
// Termos de Uso - Candidatos

import TermsCompany from "./pages/TermsCompany";
// Termos de Uso - Empresas

import CompanySettings from "./pages/CompanySettings";
// Página de Configurações - Empresa

import CandidateSettings from "./pages/CandidateSettings";
// Página de Configurações - Candidato

import CandidateAccount from "./pages/CandidateAccount";
// Página de Conta - Candidato

import CompanyAccount from "./pages/CompanyAccount";
// Página de Conta - Empresa

import CandidateChangePassword from "./pages/CandidateChangePassword";
// Página de Alterar Senha - Candidato

import CandidateChangeEmail from "./pages/CandidateChangeEmail";
// Página de Alterar Email - Candidato

import CandidateDeactivateAccount from "./pages/CandidateDeactivateAccount";
// Página de Desativar Conta - Candidato

import CandidateDeleteAccount from "./pages/CandidateDeleteAccount";
// Página de Deletar Conta - Candidato

import EditCandidateProfile from "./pages/EditCandidateProfile";
// Página de Editar Perfil do Candidato

import EditCompanyProfile from "./pages/EditCompanyProfile";
// Página de Editar Perfil da Empresa

import CompanyCreateJob from "./pages/CompanyCreateJob";
// Página de Cadastrar Vagas

import CompanyJobs from "./pages/CompanyJobs";
// Página de Minhas Vagas (Empresa)

import EditCompanyJob from "./pages/EditCompanyJob";
// Página de Editar Vaga (Empresa)

import CompanyJobDetails from "./pages/CompanyJobDetails";
// Página de Detalhes da Vaga (Empresa)

import CompanyJobCandidates from "./pages/CompanyJobCandidates";
// Página de Candidatos da Vaga

import CompanyViewCandidateProfile from "./pages/CompanyViewCandidateProfile";
// Página de Visualização de Perfil do Candidato pela Empresa
import CompanyViewCandidateProfileAlias from "./pages/CompanyViewCandidateProfileAlias";
// Alias legado para acessos diretos

import CandidateJobDetails from "./pages/CandidateJobDetails";
// Página de Detalhes da Vaga - Candidato

import CandidateJobApplication from "./pages/CandidateJobApplication";
// Página de Candidatura à Vaga

import CandidateMyApplications from "./pages/CandidateMyApplications";
// Página de Minhas Candidaturas

import CandidateContractAcceptance from "./pages/CandidateContractAcceptance";
// Página de Aceitação de Contrato

import CompanyPublicProfile from "./pages/CompanyPublicProfile";
// Página pública do Perfil da Empresa (visualização)

import ForgotPassword from "./pages/ForgotPassword";
// Página de Recuperar Senha

import NotFound from "./pages/NotFound";
// Página exibida quando a rota não existe (erro 404)

import CandidateCommunityRules from "./pages/CandidateCommunityRules";
// Página de Regras da Comunidade - Candidato

import CompanyCommunityRules from "./pages/CompanyCommunityRules";
// Página de Regras da Comunidade - Empresa

import AdminDashboard from "./pages/AdminDashboard";
// Dashboard Administrativo

import AdminCandidates from "./pages/AdminCandidates";
// Página de Gerenciamento de Candidatos - Admin

import AdminCompanies from "./pages/AdminCompanies";
// Página de Gerenciamento de Empresas - Admin

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
            <Route path="/" element={<Auth />} />
            {/* Página de login inicial */}
            <Route path="/auth" element={<Auth />} />
            {/* Alias para login */}
            
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
            
            <Route path="/company-about" element={<CompanyAbout />} />
            {/* Página Quem Somos - Empresa */}
            
            <Route path="/candidate-about" element={<CandidateAbout />} />
            {/* Página Quem Somos - Candidato */}
            
            <Route path="/company-support" element={<CompanySupport />} />
            {/* Página de Suporte - Empresa */}
            
            <Route path="/candidate-support" element={<CandidateSupport />} />
            {/* Página de Suporte - Candidato */}
            
            <Route path="/terms-candidate" element={<TermsCandidate />} />
            {/* Termos de Uso - Candidatos */}
            
            <Route path="/terms-company" element={<TermsCompany />} />
            {/* Termos de Uso - Empresas */}
            
            <Route path="/company-settings" element={<CompanySettings />} />
            {/* Página de Configurações da Empresa */}
            
            <Route path="/candidate-settings" element={<CandidateSettings />} />
            {/* Página de Configurações do Candidato */}
            
            <Route path="/account" element={<CandidateAccount />} />
            <Route path="/company-account" element={<CompanyAccount />} />
            
            <Route path="/change-password" element={<CandidateChangePassword />} />
            <Route path="/company-change-password" element={<CandidateChangePassword />} />
            
            <Route path="/change-email" element={<CandidateChangeEmail />} />
            <Route path="/company-change-email" element={<CandidateChangeEmail />} />
            
            <Route path="/deactivate-account" element={<CandidateDeactivateAccount />} />
            <Route path="/company-deactivate-account" element={<CandidateDeactivateAccount />} />
            
            <Route path="/delete-account" element={<CandidateDeleteAccount />} />
            <Route path="/company-delete-account" element={<CandidateDeleteAccount />} />
            
            <Route path="/edit-candidate-profile" element={<EditCandidateProfile />} />
            {/* Página de Editar Perfil do Candidato */}
            
            <Route path="/edit-company-profile" element={<EditCompanyProfile />} />
            {/* Página de Editar Perfil da Empresa */}
            
            <Route path="/create-job" element={<CompanyCreateJob />} />
            {/* Página de Cadastrar Vagas */}
            
            <Route path="/company-jobs" element={<CompanyJobs />} />
            {/* Página de Minhas Vagas (Empresa) */}
            
            <Route path="/edit-job/:jobId" element={<EditCompanyJob />} />
            {/* Página de Editar Vaga (Empresa) */}
            
            <Route path="/company-job/:jobId" element={<CompanyJobDetails />} />
            {/* Página de Detalhes da Vaga (Empresa) */}
            
            <Route path="/job-candidates/:jobId" element={<CompanyJobCandidates />} />
            {/* Página de Candidatos da Vaga */}
            
            <Route path="/candidate-profile/:candidateId" element={<CompanyViewCandidateProfile />} />
            {/* Página de Visualização de Perfil do Candidato pela Empresa */}
            <Route path="/CompanyViewCandidateProfile" element={<CompanyViewCandidateProfileAlias />} />
            {/* Alias para antigas rotas diretas, suporta ?id= */}
            
            <Route path="/job/:id" element={<CandidateJobDetails />} />
            {/* Página de Detalhes da Vaga */}
            
            <Route path="/job/:id/apply" element={<CandidateJobApplication />} />
            {/* Página de Candidatura à Vaga */}
            
            <Route path="/my-applications" element={<CandidateMyApplications />} />
            {/* Página de Minhas Candidaturas */}
            
            <Route path="/contract/:applicationId" element={<CandidateContractAcceptance />} />
            {/* Página de Aceitação de Contrato */}
            
            <Route path="/company/:id/profile" element={<CompanyPublicProfile />} />
            {/* Página pública do Perfil da Empresa (visualização) */}
            
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Página de Recuperar Senha */}
            
            <Route path="/candidate-community-rules" element={<CandidateCommunityRules />} />
            {/* Página de Regras da Comunidade - Candidato */}
            
            <Route path="/rules" element={<CandidateCommunityRules />} />
            {/* Rota simplificada para Regras da Comunidade - Candidato */}
            
            <Route path="/company-community-rules" element={<CompanyCommunityRules />} />
            {/* Página de Regras da Comunidade - Empresa */}
            
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Dashboard Administrativo */}
            
            <Route path="/admin/candidates" element={<AdminCandidates />} />
            {/* Página de Gerenciamento de Candidatos - Admin */}
            
            <Route path="/admin/companies" element={<AdminCompanies />} />
            {/* Página de Gerenciamento de Empresas - Admin */}
            
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
