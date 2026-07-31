import { RaasHomePage } from "@/components/raas/home-page";
import { RaasSiteShell } from "@/components/raas/site-shell";
import { getCatalogPlants } from "@/lib/nursery-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const plants = await getCatalogPlants();
  const featuredPlants = plants.filter((plant) => plant.featured);
  return (
    <RaasSiteShell>
      <RaasHomePage featuredPlants={featuredPlants.length >= 3 ? featuredPlants : plants.slice(0, 3)} />
    </RaasSiteShell>
  );
}
