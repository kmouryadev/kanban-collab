import { useAuth } from "../../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterSchemaType,
} from "../../validation/auth.schema";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { AppToast } from "../../lib/appToast";
import { extractErrorMessage } from "../../lib/errorUtils";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchemaType) => {
    registerUser.mutate(data, {
      onError: (error: unknown) => {
        const message = extractErrorMessage(error);
        AppToast.error("Registration Failed", message);
      },
      onSuccess: () => {
        AppToast.success(
          "Account Created",
          "Your account has been successfully created!"
        );
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0F1F] to-[#05070D] px-4">
      <Card className="card-surface max-w-md w-full">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                {...register("name")}
                className="bg-[#1a1f2c] text-white placeholder:text-gray-400 border-border"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="bg-[#1a1f2c] text-white placeholder:text-gray-400 border-border"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="bg-[#1a1f2c] text-white placeholder:text-gray-400 border-border"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary text-primary-foreground"
            >
              Create Account
            </Button>

            <p className="text-center text-gray-400 text-sm pt-2">
              Already registered?{" "}
              <Link to="/login" className="text-accent hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
