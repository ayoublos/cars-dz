export type Car = {
  id: number;
  name: string;
  status: string;
  color: string;
  image: string;
  price: number;
  mileage: number;
  year: number;
  fuel: string;
  transmission: string;
  engine: string;
  doors: number;
  seats: number;
};



export function getCarById(id: number, cars: Car[]) {
  return cars.find((c) => c.id === id);
}

