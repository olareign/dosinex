import type { Metadata } from "next";
import { PreviewBanner } from "@/components/public/PreviewBanner";
import { ProfilePage } from "@/components/public/ProfilePage";
import { parsePageTemplate } from "@/content/page-templates";
import { getCmsContext } from "@/lib/cms-data";
import "@/styles/public.css";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ design?: string; embed?: string }> };

/**
 * The signed-in owner's draft, rendered exactly like the public page. `?design=` shows it in another design without
 * saving (Dashboard → Design uses this to let the owner look before choosing); `?embed=1` drops the banner for that
 * preview frame.
 */
export default async function PreviewPage({ searchParams }: Props) {
  const { design, embed } = await searchParams;
  const { account, draft, published } = await getCmsContext();
  const override = parsePageTemplate(design);
  const site = override ? { ...draft, settings: { ...draft.settings, pageTemplate: override } } : draft;
  return (
    <>
      {embed !== "1" && <PreviewBanner live={Boolean(published)} />}
      <ProfilePage site={site} slug={account.slug} basePath="/preview" preview />
    </>
  );
}
