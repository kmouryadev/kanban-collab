import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Auth } from "../../utils/auth";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0F1F] to-[#05070D] px-4">
      <h1 className="text-5xl font-bold gradient-title text-center">
        Collaborative Kanban App
      </h1>

      <p className="text-gray-400 mt-4 max-w-xl text-center text-lg">
        Real-time kanban board with drag-and-drop, multi-user collaboration, and
        mobile-friendly actions.
      </p>

      {Auth.isLoggedIn() ? (
        <div className="flex space-x-4 mt-8">
          <Link to="/boards">
            <Button
              size="lg"
              className="w-32 bg-primary text-primary-foreground hover:opacity-90"
            >
              GO to board
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex space-x-4 mt-8">
          <Link to="/login">
            <Button
              size="lg"
              className="w-32 bg-primary text-primary-foreground hover:opacity-90"
            >
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button
              size="lg"
              className="w-32 bg-accent text-accent-foreground hover:opacity-90"
            >
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
