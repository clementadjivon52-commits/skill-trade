import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  return (
    <SettingsClient
      user={{
        name: user.name,
        bio: user.bio,
        whatsapp: user.whatsapp,
        photo: user.photo,
        plan: user.plan,
        language: user.language,
        theme: user.theme,
      }}
    />
  );
}
