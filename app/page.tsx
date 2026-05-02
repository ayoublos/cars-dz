import CarList from "./cars/page";
import Search from "@/components/ui/search";


export default function Home() {
  return (
    <div>
      <Search />
      <CarList />
    </div>
  );
}
