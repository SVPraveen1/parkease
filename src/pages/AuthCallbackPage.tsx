
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AuthCallbackPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        // Get session from URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          toast.success("Successfully authenticated!");
        } else {
          // This shouldn't happen if the auth flow worked correctly
          toast.warning("Authentication process completed, but no session was created");
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Authentication failed");
        toast.error(err.message || "Authentication failed");
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-parkblue-500 mb-4" />
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
        <p className="text-gray-500 mt-2">Please wait while we set up your account.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-300 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-800">Authentication Error</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.href = "/"} 
            className="mt-4 px-4 py-2 bg-parkblue-500 text-white rounded hover:bg-parkblue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Redirect to home page or parking page
  return <Navigate to="/parking" replace />;
};

export default AuthCallbackPage;
