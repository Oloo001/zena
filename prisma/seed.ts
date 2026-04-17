import { prisma } from "../src/lib/prisma";
import { CarCategory, Transmission, FuelType } from "@prisma/client";

async function main() {
  await prisma.car.deleteMany();

  const cars = [
    {
      name: "Vitz",
      brand: "Toyota",
      category: CarCategory.ECONOMY,
      pricePerDay: 3200,
      location: "Nairobi",
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      description: "Compact and fuel-efficient. Perfect for city driving around Nairobi.",
      images: ["/cars/vitz.jpg"],
      available: true,
      featured: true,
    },
    {
      name: "Prado 150",
      brand: "Toyota",
      category: CarCategory.SUV,
      pricePerDay: 9500,
      location: "Nairobi",
      seats: 7,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.DIESEL,
      description: "Powerful 4x4 SUV. Ideal for safaris and off-road adventures.",
      images: ["/cars/prado.jpg"],
      available: true,
      featured: true,
    },
    {
      name: "Model 3",
      brand: "Tesla",
      category: CarCategory.ELECTRIC,
      pricePerDay: 12000,
      location: "Nairobi",
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.ELECTRIC,
      description: "Premium electric sedan with autopilot. 480km range per charge.",
      images: ["/cars/tesla.jpg"],
      available: true,
      featured: true,
    },
    {
      name: "Harrier",
      brand: "Toyota",
      category: CarCategory.LUXURY,
      pricePerDay: 8000,
      location: "Mombasa",
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      description: "Stylish luxury crossover. Great for executive travel in Mombasa.",
      images: ["/cars/harrier.jpg"],
      available: true,
      featured: true,
    },
    {
      name: "Hiace",
      brand: "Toyota",
      category: CarCategory.VAN,
      pricePerDay: 7500,
      location: "Kisumu",
      seats: 14,
      transmission: Transmission.MANUAL,
      fuelType: FuelType.DIESEL,
      description: "Spacious van for group travel and airport transfers.",
      images: ["/cars/hiace.jpg"],
      available: true,
      featured: true,
    },
    {
      name: "Hilux",
      brand: "Toyota",
      category: CarCategory.PICKUP,
      pricePerDay: 6500,
      location: "Nakuru",
      seats: 5,
      transmission: Transmission.MANUAL,
      fuelType: FuelType.DIESEL,
      description: "Rugged double-cab pickup. Built for tough terrain and heavy loads.",
      images: ["/cars/hilux.jpg"],
      available: true,
      featured: true,
    },
  ];

  for (const car of cars) {
    await prisma.car.create({ data: car });
  }

  console.log("✅ Seeded", cars.length, "cars");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());