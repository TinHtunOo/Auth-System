import { Suspense } from "react";
import VerifyEmailPage from "@/components/page/VerifyEmailPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
