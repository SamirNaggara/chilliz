"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function RemoveIsAuthParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("isAuth")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("isAuth");
      const newUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}
