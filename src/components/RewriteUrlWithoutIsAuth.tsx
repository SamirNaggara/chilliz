"use client";
import { useEffect } from "react";

export function RewriteUrlWithoutIsAuth() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("isAuth")) {
      url.searchParams.delete("isAuth");
      const newUrl =
        url.pathname +
        (url.search ? url.search : "") +
        (url.hash ? url.hash : "");
      window.history.replaceState(null, "", newUrl);

      // Trick iOS Safari
      window.scrollTo(window.scrollX, window.scrollY + 1);
      window.scrollTo(window.scrollX, window.scrollY - 1);

      // Trick bonus : modifier temporairement le titre
      const originalTitle = document.title;
      document.title = originalTitle + " ";
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }
  }, []);

  return null;
}
