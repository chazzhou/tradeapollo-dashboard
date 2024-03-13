"use client";
import MapChart from "./components/MapChart";
import { Button, Modal, useDisclosure, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";
import ElectricitySearch from "./components/ElectricitySearch";
import { FaArrowUp } from "react-icons/fa";

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0">
        <MapChart />
      </div>
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <Button
          color="primary"
          onPress={onOpen}
          className={`transition-transform duration-300 z-30 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <FaArrowUp />
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          <ModalHeader>Residential Electricity Prices</ModalHeader>
          <ModalBody className="flex justify-center items-center">
            <ElectricitySearch />
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="absolute bottom-4 left-4 z-30">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white-300 opacity-50 hover:opacity-100 transition-opacity duration-300">
          TradeApollo
        </h1>
      </div>
    </main>
  );
}