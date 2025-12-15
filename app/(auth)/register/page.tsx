import { Suspense } from "react";

import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 max-w-lg">
          <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-light text-center">Loading…</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

