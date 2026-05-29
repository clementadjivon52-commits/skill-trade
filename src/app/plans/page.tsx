import { getUser } from "@/lib/auth";
import PlansClient from "./PlansClient";

export default async function PlansPage() {
  const user = await getUser();
  return (
    <PlansClient
      currentPlan={user?.plan ?? "free"}
      isLoggedIn={!!user}
    />
  );
}
