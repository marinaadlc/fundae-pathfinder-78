import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import FormativeActions from "./pages/FormativeActions";
import CreateAction from "./pages/CreateAction";
import CustomFormationCreator from "./pages/CustomFormationCreator";
import ActionDetail from "./pages/ActionDetail";
import EditAction from "./pages/EditAction";
import Catalog from "./pages/Catalog";
import FormationDetail from "./pages/FormationDetail";
import Students from "./pages/Students";
import Settings from "./pages/Settings";
import CreditWallet from "./pages/CreditWallet";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<FormativeActions />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/course/:id" element={<FormationDetail />} />
                <Route path="/action/:id" element={<ActionDetail />} />
                <Route path="/action/:id/edit" element={<EditAction />} />
                <Route path="/create-action" element={<CreateAction />} />
                <Route path="/custom-formation" element={<CustomFormationCreator />} />
                <Route path="/students" element={<Students />} />
                <Route path="/credit-wallet" element={<CreditWallet />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
