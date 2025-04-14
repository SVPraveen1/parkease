
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "@/context/AuthContext";

export const AppLayout = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  
  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };
  
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  
  const handleAuthenticated = () => {
    // Fixed the error by removing the login() call without parameters
    // This function is called when authentication is successful
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogin={handleOpenAuthModal}
        onLogout={logout}
      />
      
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      
      <Footer />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
};

export default AppLayout;
