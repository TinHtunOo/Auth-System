import { Suspense } from "react";
import ResetPasswordPage from "@/components/page/ResetPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
