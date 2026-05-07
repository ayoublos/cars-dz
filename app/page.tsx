import CarList from "./cars/page";
import Search from "@/components/ui/search";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

export default async function Home() {
  const lang = await getLang();
  return (
    <div>
      <Search
        placeholder={t.home.searchPlaceholder[lang]}
        buttonLabel={t.home.searchButton[lang]}
      />
      <CarList />
    </div>
  );
}
