import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/auth.store";

function App() {
  const restore = useAuthStore((state) => state.restore);

  useEffect(() => {
    restore();
  }, [restore]);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
