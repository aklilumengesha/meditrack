"use client";

import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push("/login");
    else if (user.role === "DOCTOR") router.push("/doctor/dashboard");
    else if (user.role === "PATIENT") router.push("/patient/dashboard");
    else router.push("/dashboard");
  }, [user, loading]);

  return null;
}
