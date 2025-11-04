import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";

// Candidate Pages
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import EditCandidateProfile from "./pages/EditCandidateProfile";
import CandidateSwipe from "./pages/CandidateSwipe";
import CandidateJobDetails from "./pages/CandidateJobDetails";
import CandidateJobApplication from "./pages/CandidateJobApplication";
import CandidateMyApplications from "./pages/CandidateMyApplications";
import CandidateSettings from "./pages/CandidateSettings";
import CandidateAccount from "./pages/CandidateAccount";
import CandidateChangeEmail from "./pages/CandidateChangeEmail";
import CandidateChangePassword from "./pages/CandidateChangePassword";
import CandidateDeactivateAccount from "./pages/CandidateDeactivateAccount";
import CandidateDeleteAccount from "./pages/CandidateDeleteAccount";
import CandidateSupport from "./pages/CandidateSupport";
import CandidateAbout from "./pages/CandidateAbout";
import CandidateCommunityRules from "./pages/CandidateCommunityRules";
import CandidateContractAcceptance from "./pages/CandidateContractAcceptance";
import MatchesCandidate from "./pages/MatchesCandidate";
import TermsCandidate from "./pages/TermsCandidate";
import CommunityRules from "./pages/CommunityRules";

// Company Pages
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import EditCompanyProfile from "./pages/EditCompanyProfile";
import CompanyPublicProfile from "./pages/CompanyPublicProfile";
import CompanySwipe from "./pages/CompanySwipe";
import CompanyJobs from "./pages/CompanyJobs";
import CompanyCreateJob from "./pages/CompanyCreateJob";
import EditCompanyJob from "./pages/EditCompanyJob";
import CreateJob from "./pages/CreateJob";
import CompanyJobDetails from "./pages/CompanyJobDetails";
import CompanyJobCandidates from "./pages/CompanyJobCandidates";
import CompanyViewCandidateProfile from "./pages/CompanyViewCandidateProfile";
import CompanyViewCandidateProfileAlias from "./pages/CompanyViewCandidateProfileAlias";
import CompanySettings from "./pages/CompanySettings";
import CompanyAccount from "./pages/CompanyAccount";
import CompanySupport from "./pages/CompanySupport";
import CompanyAbout from "./pages/CompanyAbout";
import CompanyCommunityRules from "./pages/CompanyCommunityRules";
import CompanyTestimonials from "./pages/CompanyTestimonials";
import CompanyChangeEmail from "./pages/CompanyChangeEmail";
import CompanyChangePassword from "./pages/CompanyChangePassword";
import CompanyDeactivateAccount from "./pages/CompanyDeactivateAccount";
import CompanyDeleteAccount from "./pages/CompanyDeleteAccount";
import MatchesCompany from "./pages/MatchesCompany";
import TermsCompany from "./pages/TermsCompany";
import Matches from "./pages/Matches";
import Company from "./pages/Company";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminCandidates from "./pages/AdminCandidates";
import AdminCompanies from "./pages/AdminCompanies";
import AdminJobs from "./pages/AdminJobs";
import AdminApplications from "./pages/AdminApplications";
import InitAdmin from "./pages/InitAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/init-admin" element={<InitAdmin />} />
            <Route path="/" element={<Index />} />
            
            {/* Candidate Routes */}
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate-profile" element={<CandidateProfile />} />
            <Route path="/edit-candidate-profile" element={<EditCandidateProfile />} />
            <Route path="/candidate-swipe" element={<CandidateSwipe />} />
            <Route path="/candidate-job-details/:id" element={<CandidateJobDetails />} />
            <Route path="/candidate-job-application/:id" element={<CandidateJobApplication />} />
            <Route path="/candidate-my-applications" element={<CandidateMyApplications />} />
            <Route path="/my-applications" element={<CandidateMyApplications />} />
            <Route path="/candidate-settings" element={<CandidateSettings />} />
            <Route path="/candidate-account" element={<CandidateAccount />} />
            <Route path="/candidate-change-email" element={<CandidateChangeEmail />} />
            <Route path="/candidate-change-password" element={<CandidateChangePassword />} />
            <Route path="/candidate-deactivate-account" element={<CandidateDeactivateAccount />} />
            <Route path="/candidate-delete-account" element={<CandidateDeleteAccount />} />
            <Route path="/candidate-support" element={<CandidateSupport />} />
            <Route path="/candidate-about" element={<CandidateAbout />} />
            <Route path="/candidate-community-rules" element={<CandidateCommunityRules />} />
            <Route path="/candidate-contract-acceptance" element={<CandidateContractAcceptance />} />
            <Route path="/matches-candidate" element={<MatchesCandidate />} />
            <Route path="/terms-candidate" element={<TermsCandidate />} />
            <Route path="/community-rules" element={<CommunityRules />} />
            
            {/* Company Routes */}
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
            <Route path="/edit-company-profile" element={<EditCompanyProfile />} />
            <Route path="/company-public-profile/:id" element={<CompanyPublicProfile />} />
            <Route path="/company-swipe" element={<CompanySwipe />} />
            <Route path="/company-jobs" element={<CompanyJobs />} />
            <Route path="/company-create-job" element={<CompanyCreateJob />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/edit-company-job/:id" element={<EditCompanyJob />} />
            <Route path="/company-job-details/:id" element={<CompanyJobDetails />} />
            <Route path="/company-job-candidates/:id" element={<CompanyJobCandidates />} />
            <Route path="/company-view-candidate-profile/:id" element={<CompanyViewCandidateProfile />} />
            <Route path="/company-view-candidate-profile-alias/:alias" element={<CompanyViewCandidateProfileAlias />} />
            <Route path="/company-settings" element={<CompanySettings />} />
            <Route path="/company-account" element={<CompanyAccount />} />
            <Route path="/company-change-email" element={<CompanyChangeEmail />} />
            <Route path="/company-change-password" element={<CompanyChangePassword />} />
            <Route path="/company-deactivate-account" element={<CompanyDeactivateAccount />} />
            <Route path="/company-delete-account" element={<CompanyDeleteAccount />} />
            <Route path="/company-support" element={<CompanySupport />} />
            <Route path="/company-about" element={<CompanyAbout />} />
            <Route path="/company-community-rules" element={<CompanyCommunityRules />} />
            <Route path="/company-testimonials" element={<CompanyTestimonials />} />
            <Route path="/matches-company" element={<MatchesCompany />} />
            <Route path="/terms-company" element={<TermsCompany />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/company" element={<Company />} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-candidates" element={<AdminCandidates />} />
            <Route path="/admin-companies" element={<AdminCompanies />} />
            <Route path="/admin-jobs" element={<AdminJobs />} />
            <Route path="/admin-applications" element={<AdminApplications />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App; 
// Exporta o componente App para ser usado em main.tsx (ponto de entrada da aplicação)
