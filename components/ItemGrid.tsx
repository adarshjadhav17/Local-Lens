import { ItemCard } from "@/components/ItemCard";
import type { LocalItem } from "@/types/local-area";

export function ItemGrid({ items }: { items: LocalItem[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <ItemCard key={`${item.url ?? item.title}-${item.description}-${index}`} item={item} />
      ))}
    </div>
  );
}
