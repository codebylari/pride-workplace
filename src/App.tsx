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

import NotFound from "./pages/NotFound";
// Página exibida quando a rota não existe (erro 404)

const queryClient = new QueryClient(); 
// Cria uma instância do cliente React Query (gerencia cache e estado das requisições)

const App = () => (
  // Componente principal da aplicação
  <QueryClientProvider client={queryClient}>
    {/* Fornece o contexto do React Query para toda a aplicação */}
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
          
          <Route path="/" element={<Index />} />
          {/* Página inicial (protegida) */}
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* Comentário lembrando que novas rotas devem vir antes da rota coringa */}
          
          <Route path="*" element={<NotFound />} />
          {/* Rota coringa ("*") para páginas não encontradas */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; 
// Exporta o componente App para ser usado em main.tsx (ponto de entrada da aplicação)
