import { Suspense } from "react";
import SettingsPage from "@/components/page/SettingPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}
