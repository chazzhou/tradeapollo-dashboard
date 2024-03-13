"use client";
import { useState } from "react";
import MapChart from "./components/MapChart";
import { Card, Slider } from "@nextui-org/react";
import ElectricitySearch from "./components/ElectricitySearch";

export default function Home() {
  const [year, setYear] = useState(2020);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">CO2 Emissions</h1>
        <Slider
          size="sm"
          step={1}
          label="Year"
          showSteps={true}
          maxValue={2020}
          minValue={1995}
          defaultValue={2020}
          className="w-full max-w-md mb-8"
          onChangeEnd={(value: number | number[]) => setYear(value as number)}
        />
        <div className="w-full">
          <Card className="h-96">
              <MapChart year={year} />
          </Card>
        </div>
        <div className="my-8">
          <ElectricitySearch />
        </div>
      </div>
    </main>
  );
}