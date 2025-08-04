import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular activación de cuenta exitosa
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
      {/* Logo BonificaPro */}
      <div className="mb-12 flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center">
          <span className="text-slate-900 font-bold text-lg">+</span>
        </div>
        <h1 className="text-white text-4xl font-bold tracking-wide">
          BonificaPro
        </h1>
      </div>

      {/* Formulario de establecer contraseña */}
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-0">
        <CardHeader className="text-center pt-8 pb-6">
          <CardTitle className="text-xl text-gray-800 font-medium">
            Establece una contraseña para activar tu cuenta
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSetPassword} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 text-slate-900 font-medium transition-colors rounded-3xl bg-[#64e2be]"
            >
              Activar mi cuenta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPassword;