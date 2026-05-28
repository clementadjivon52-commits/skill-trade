import MarketplaceInteractive from "@/components/MarketplaceInteractive";
import { getMarketplaceOffers } from "@/lib/site-data";

type MarketplacePageProps = {
  searchParams: Promise<{
    type?: string;
  }>;
};

type Offer = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  reward: string;
  owner?: {
    id: string;
    name: string;
    photo: string;
    role: string;
    location: string;
    bio: string;
    whatsapp: string;
    trustBadge: string;
    availability: string;
    heroOffer: string;
    tokens: number;
    skills: string[];
    timeServices: string[];
    portfolio: { title: string; image: string }[];
  };
  typeLabel: string;
};

export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const { type = "all" } = await searchParams;
  const raw = await getMarketplaceOffers("all");
  const offers = raw as Offer[];

  return (
    <div className="page-shell py-10 md:py-14">
      <MarketplaceInteractive initialOffers={offers} initialType={type} />
    </div>
  );
}

