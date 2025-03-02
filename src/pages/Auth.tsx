
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "login";
  
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  
  // Update isLogin state if the mode query param changes
  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, simulate successful auth
    // This would normally connect to an authentication service
    console.log("Auth data:", { email, password, name });
    
    navigate("/dashboard");
  };
  
  const toggleMode = () => {
    const newMode = isLogin ? "signup" : "login";
    navigate(`/auth?mode=${newMode}`);
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Log In" : "Sign Up"} | AI Promptify</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <header className="p-6">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-automation-text"
            >
              <span className="bg-automation-primary text-white rounded-lg p-1">AI</span>
              <span>Promptify</span>
            </Link>
            
            <Link
              to="/"
              className="text-automation-text hover:text-automation-primary transition-colors flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-automation-border animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-automation-text">
                  {isLogin ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-gray-500 mt-2">
                  {isLogin 
                    ? "Log in to access your AI-powered workflows" 
                    : "Start automating with AI in just a few steps"}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "••••••••" : "Create a password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Link 
                      to="/auth/forgot-password" 
                      className="text-sm text-automation-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-automation-primary hover:bg-automation-primary/90"
                >
                  {isLogin ? "Log in" : "Create account"}
                </Button>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="ml-1 text-automation-primary hover:underline"
                    >
                      {isLogin ? "Sign up" : "Log in"}
                    </button>
                  </p>
                </div>
              </form>
              
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <SocialButton provider="google" />
                  <SocialButton provider="github" />
                  <SocialButton provider="microsoft" />
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-6 text-center text-sm text-gray-500">
          <div className="container mx-auto">
            <p>© {new Date().getFullYear()} AI Promptify. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

interface SocialButtonProps {
  provider: "google" | "github" | "microsoft";
}

const SocialButton = ({ provider }: SocialButtonProps) => {
  const getProviderDetails = () => {
    switch (provider) {
      case "google":
        return { name: "Google", bg: "hover:bg-red-50" };
      case "github":
        return { name: "GitHub", bg: "hover:bg-gray-50" };
      case "microsoft":
        return { name: "Microsoft", bg: "hover:bg-blue-50" };
    }
  };
  
  const details = getProviderDetails();
  
  return (
    <button
      type="button"
      className={cn(
        "py-2.5 px-4 rounded-lg border border-gray-200 flex items-center justify-center",
        "text-gray-700 hover:shadow-sm transition-all",
        details.bg
      )}
    >
      <span className="sr-only">Sign in with {details.name}</span>
      <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
    </button>
  );
};

export default Auth;
