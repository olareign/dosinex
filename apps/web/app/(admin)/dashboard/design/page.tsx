import { DesignForm } from "@/components/cms/DesignForm";
import { publicPageTemplate } from "@/content/page-templates";
import { getCmsContext } from "@/lib/cms-data";

export const metadata = { title: "Design" };

export default async function DesignPage() {
  const { draft } = await getCmsContext();
  return (
    <main className="cms-content">
      <h1 className="cms-title">Design</h1>
      <DesignForm initial={publicPageTemplate(draft.settings)} draftVersion={draft.updatedAt} />
    </main>
  );
}
