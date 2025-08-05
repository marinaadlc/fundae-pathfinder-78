import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Coins, BadgeCent, User, Settings, LogOut, Wallet } from "lucide-react";
interface LayoutProps {
  children: ReactNode;
}
const Layout = ({
  children
}: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Aquí iría la lógica de logout
    navigate('/login');
  };
  const navigation = [{
    name: "Catálogo de Formaciones",
    href: "/catalog",
    current: location.pathname === "/catalog"
  }, {
    name: "Acciones formativas",
    href: "/",
    current: location.pathname === "/"
  }, {
    name: "Alumnos",
    href: "/students",
    current: location.pathname === "/students"
  }];
  return <div className="min-h-screen bg-background">
      <header className="border-b bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#00E5A0] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+</span>
                </div>
                <span className="text-2xl font-bold text-foreground">BonificaPro</span>
              </Link>
              <nav className="flex space-x-3">
                {navigation.map(item => <Link key={item.name} to={item.href} className={`px-4 py-3 text-sm rounded-full transition-colors no-underline ${item.current ? "text-white bg-primary/20 font-medium" : "text-muted-foreground hover:text-white hover:bg-primary/5 font-normal"}`}>
                    {item.name}
                  </Link>)}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm px-3 py-1.5 rounded-full  bg-background-100">
                <BadgeCent className="h-4 w-4 text-white bg-inherit" />
                <span className="font-medium text-slate-50"><span className="font-bold">340 créditos </span>disponibles</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/user.jpg" alt="Usuario" />
                      <AvatarFallback>PL</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Pepe López</p>
                      <p className="text-xs leading-none text-muted-foreground">LogTech</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/credit-wallet" className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Bolsa de créditos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>;
};
export default Layout;