import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Car } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  onClose: () => void;
  onAuthenticated: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData extends LoginFormData {
  firstName: string;
  lastName: string;
}

export const AuthForm = ({ onClose, onAuthenticated }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const { error, success } = await login(email, password);
      
      if (success) {
        toast.success("Successfully logged in!");
        onAuthenticated();
        onClose();
      } else {
        toast.error(error?.message || "Failed to login. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("signupEmail") as string;
    const password = formData.get("signupPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    
    try {
      const { error, success } = await signup(email, password);
      
      if (success) {
        toast.success("Account created successfully!");
        onAuthenticated();
        onClose();
      } else {
        toast.error(error?.message || "Failed to create account. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center mb-2">
          <Car className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to ParkEase</h2>
        <p className="text-gray-500">Sign in to book your parking spots</p>
      </div>
      
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signupEmail">Email</Label>
              <Input id="signupEmail" name="signupEmail" type="email" placeholder="name@example.com" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signupPassword">Password</Label>
              <Input id="signupPassword" name="signupPassword" type="password" required />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
