import { toast } from "../hooks/useToast";

export const AppToast = {
  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      className:
        "bg-red-600 text-black border border-red-700 shadow-lg font-medium",
    });
  },

  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      className:
        "bg-green-600 text-black border border-green-700 shadow-lg font-medium",
    });
  },

  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      className:
        "bg-blue-600 text-black border border-blue-700 shadow-lg font-medium",
    });
  },

  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      className:
        "bg-yellow-500 text-black border border-yellow-600 shadow-lg font-medium",
    });
  },
};
