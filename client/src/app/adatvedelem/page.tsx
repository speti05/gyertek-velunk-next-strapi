import { BlockRenderer } from "@/components/BlockRenderer";
import { getDataPrivacy } from "@/data/loaders";
import { notFound } from "next/navigation";

async function loader() {
  const data = await getDataPrivacy();
  if (!data) notFound();
  return { ...data.data };
}

export default async function AdatvedelemRoute() {
  const { blocks, description, title } = await  loader();
  return (
    <div className="data-privacy general-page">
      <div className=" container">
      <h3>{title}</h3>
      

        <BlockRenderer
          blocks={blocks} />
      </div>
    </div>
  );
}
