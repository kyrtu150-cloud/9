import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Features } from "@/components/site/features";
import { Process } from "@/components/site/process";
import { Cases } from "@/components/site/cases";
import { Pricing } from "@/components/site/pricing";
import { FAQ } from "@/components/site/faq";
import { Contacts } from "@/components/site/contacts";
import { SiteFooter } from "@/components/site/footer";
import { getContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "JOOZ.ai Studio",
      url: "https://jooz.ai",
      description: "AI-студия продающего контента для маркетплейсов",
    },
    {
      "@type": "SoftwareApplication",
      name: "JOOZ.ai Studio",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", name: "Start", price: "1990", priceCurrency: "RUB" },
        { "@type": "Offer", name: "Pro", price: "4990", priceCurrency: "RUB" },
        { "@type": "Offer", name: "Business", price: "12990", priceCurrency: "RUB" },
      ],
    },
  ],
};

export default async function HomePage() {
  const content = await getContent();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Nav ctaLabel={content["nav.cta"]} loginLabel={content["nav.login"]} />
      <main>
        <Hero content={content} />
        <Features content={content} />
        <Process content={content} />
        <Cases content={content} />
        <Pricing content={content} />
        <FAQ content={content} />
        <Contacts content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}
