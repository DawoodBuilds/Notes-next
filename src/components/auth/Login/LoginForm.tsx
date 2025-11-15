"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Input from "@/components/ui/InputWrapper";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { fetchUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/auth/login", formData);

      if (response.data.success) {
        await fetchUser();
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        if (axiosError.response?.data?.error) {
          setErrors({ general: axiosError.response.data.error });
        } else {
          setErrors({ general: "Login failed. Please try again." });
        }
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <div className="w-[30%] ml-auto mr-auto mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-500">
          <p className="text-red-700 dark:text-red-300 text-center">
            {errors.general}
          </p>
        </div>
      )}

      <div className="w-[30%] flex flex-col gap-6 ml-auto mr-auto mt-6">
        <Input
          title="Email"
          type="email"
          placeholder="eg. johnfrans@gmail.com"
          htmlfor="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />
        <Input
          title="Password"
          type="password"
          placeholder="Enter your password"
          htmlfor="password"
          value={formData.password}
          onChange={handleChange}
          required
          error={errors.password}
          showPasswordToggle={true}
          forgotPassword={true}
        />
      </div>

      <div className="w-[30%] ml-auto mr-auto mt-9">
        <Button
          variant="fullwhite"
          className="w-full rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </Button>
      </div>

      <div className="login">
        Don&apos;t have an account?{" "}
        <Link className="loginbtn" href="/register">
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
