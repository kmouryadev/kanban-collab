import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "../ui/button";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <h1 className="text-xl font-semibold">Kanban Collab</h1>

        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{user.name}</span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
};

export default MainLayout;
