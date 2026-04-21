import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import SelectRole from "./pages/SelectRole";
import ChoosePlan from "./pages/ChoosePlan";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import { DashboardLayout } from "./features/DashboardLayout";
import { RequireRole } from "./features/RequireRole";
import { RequireSubscription } from "./components/RequireSubscription";
import BudgetPage from "./features/budget/BudgetPage";
import AnalyticsPage from "./features/analytics/AnalyticsPage";
import ContractsPage from "./features/contract/ContractsPage";
import NotificationsPage from "./features/notification/NotificationsPage";
import AccountPage from "./features/Account/AccountPage";
import ProjectsListPage from "./features/dashboard/projects/ProjectsListPage";
import ProjectCreatePage from "./features/dashboard/projects/ProjectCreatePage";
import ProjectViewPage from "./features/dashboard/projects/ProjectViewPage";
import ProjectEditPage from "./features/dashboard/projects/ProjectEditPage";
import { DashboardSectionLayout } from "./features/dashboard/DashboardSectionLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
            <Route path="/otp-verification" element={<PublicOnlyRoute><OtpVerification /></PublicOnlyRoute>} />
            <Route path="/reset-password" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
            <Route path="/select-role" element={<PublicOnlyRoute><SelectRole /></PublicOnlyRoute>} />
            <Route path="/choose-plan" element={<ProtectedRoute><ChoosePlan /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RequireRole allowed={["user", "contractor", "admin"]}>
                    <RequireSubscription>
                      <DashboardLayout />
                    </RequireSubscription>
                  </RequireRole>
                </ProtectedRoute>
              }
            >
            <Route index element={<Navigate to="projects" replace />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="analytics" element={<RequireRole allowed={["contractor", "admin"]}><AnalyticsPage /></RequireRole>} />
            <Route path="contracts" element={<RequireRole allowed={["contractor", "admin"]}><ContractsPage /></RequireRole>} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route element={<DashboardSectionLayout />}>
              <Route path="projects" element={<ProjectsListPage />} />
              <Route path="projects/new" element={<ProjectCreatePage />} />
              <Route path="projects/:id" element={<ProjectViewPage />} />
              <Route path="projects/:id/edit" element={<ProjectEditPage />} />
            </Route>
            <Route path="account" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
