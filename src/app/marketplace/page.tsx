import MarketplaceInteractive from "@/components/MarketplaceInteractive";
import { getMarketplaceOffers } from "@/lib/site-data";

type MarketplacePageProps = {
  searchParams: Promise<{
    type?: string;
  }>;
};

export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const { type = "all" } = await searchParams;
  const offers = await getMarketplaceOffers("all"); // Fetch all offers for instant client-side switching

  return (
    <div className="page-shell py-10 md:py-14">
      <MarketplaceInteractive initialOffers={offers} initialType={type} />
    </div>
  );
}

