import { redirect } from "next/navigation";

import FormAlbumAdd from "./form-album-add";
import PrevButton from "@/components/prev-button";
import { PageHeading } from "@/components/page-heading";

import { createClient } from "@/lib/supabase/server";

export default async function NewAlbumPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="space-y-4">
      <PrevButton />
      <PageHeading>Phát hành album</PageHeading>
      <FormAlbumAdd />
    </div>
  );
}
