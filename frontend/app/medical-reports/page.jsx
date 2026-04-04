"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MedicalReportsIndex() {
  const router = useRouter();
  useEffect(() => { router.push("/"); }, []);
  return null;
}
