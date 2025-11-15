"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Input from "@/components/ui/InputWrapper";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface FormData {
  First_name: string;
  Last_name: string;
  email: string;
  password: string;
}

interface FormErrors {
  First_name?: string;
  Last_name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    First_name: "",
    Last_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.First_name.trim()) {
      newErrors.First_name = "First name is required";
    } else if (formData.First_name.trim().length < 2) {
      newErrors.First_name = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.First_name)) {
      newErrors.First_name = "First name can only contain letters";
    }

    if (!formData.Last_name.trim()) {
      newErrors.Last_name = "Last name is required";
    } else if (formData.Last_name.trim().length < 2) {
      newErrors.Last_name = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.Last_name)) {
      newErrors.Last_name = "Last name can only contain letters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter";
    } else if (/^\d+$/.test(formData.password)) {
      newErrors.password = "Password cannot be all numbers";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character";
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
    if (name === "email" && errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: undefined,
      }));
    }
  };

  const isPasswordValid = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
      !/^\d+$/.test(password)
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/auth/signup", formData);

      if (response.data.success) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        if (axiosError.response?.data?.error) {
          setErrors({ general: axiosError.response.data.error });
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      } else {
        setErrors({ general: "Registration failed. Please try again." });
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

      <div className="fields">
        <Input
          title="First Name"
          placeholder="eg. John"
          htmlfor="First_name"
          value={formData.First_name}
          onChange={handleChange}
          required
          error={errors.First_name}
        />
        <Input
          title="Last Name"
          placeholder="eg. Francisco"
          htmlfor="Last_name"
          value={formData.Last_name}
          onChange={handleChange}
          required
          error={errors.Last_name}
        />
      </div>
      <div className="w-[30%] flex flex-col gap-4 ml-auto mr-auto mt-4">
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
        <div>
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
          />
          {submitted && !isPasswordValid(formData.password) && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p className="font-semibold">Password must contain:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li
                  className={
                    formData.password.length >= 8
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  One uppercase letter
                </li>
                <li
                  className={
                    /[a-z]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  One lowercase letter
                </li>
                <li
                  className={
                    /\d/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  One number
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  One special character (!@#$%^&*...)
                </li>
                <li
                  className={
                    !/^\d+$/.test(formData.password) && formData.password
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  Cannot be all numbers
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="w-[30%] ml-auto mr-auto mt-6">
        <Button
          variant="fullwhite"
          className="w-full rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </div>
      <div className="login">
        Already have an account?{" "}
        <Link className="loginbtn" href="/login">
          Log in
        </Link>
      </div>
    </form>
  );
}
