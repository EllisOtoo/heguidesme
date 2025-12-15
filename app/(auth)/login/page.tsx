import { Suspense } from "react";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 max-w-lg">
          <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-light text-center">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

