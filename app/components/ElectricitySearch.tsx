"use client";
import { useMemo, useState } from "react";
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Pagination } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

interface ElectricityData {
    name_and_tariff: string;
    description: string;
    price: string;
    img_link: string;
}

const rowsPerPage = 5;

export default function ElectricitySearch() {
    const [country, setCountry] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [kwTotal, setKwTotal] = useState("");
    const [data, setData] = useState<ElectricityData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const pages = Math.ceil(data.length / rowsPerPage);

    const handleSearch = async () => {
        setLoading(true);
        setPage(1); // Reset the page to 1
        setError("");
        try {
            const response = await fetch(
                `https://frankfurt.corles.net/electricity?country=${country}&zipcode=${zipcode}&kw_total=${kwTotal}`
            );
            const result = await response.json();
            if (response.ok) {
                setData(result);
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    };

    const columns = [
        { name: "Name and Tariff", uid: "name_and_tariff" },
        { name: "Description", uid: "description" },
        { name: "Price", uid: "price" },
        { name: "Image", uid: "img_link" },
    ];

    const renderCell = (item: ElectricityData, columnKey: keyof ElectricityData) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case "img_link":
                if (!cellValue) return null;
                return <Image src={cellValue} alt="Provider" className="w-20" />;
            case "description":
                const desc = item[columnKey]
                    .replace('Abschlag \n Tarifdetails', '')
                    .replaceAll('\n', '<br />')
                    .replaceAll('\r', '<br />');
                return <div dangerouslySetInnerHTML={{ __html: desc }} />;
            default:
                return cellValue;
        }
    };

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return data.slice(start, end);
    }, [page, data]);

    return (
        <div className="flex flex-col items-center w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Residential Electricity Search</h2>
            <div className="flex space-x-4 mb-4">
                <Select
                    label="Country"
                    onChange={(e) => setCountry(e.target.value)}
                >
                    <SelectItem key="Germany" value="Germany">Germany</SelectItem>
                    <SelectItem key="Italy" value="Italy">Italy</SelectItem>
                </Select>
                <Input
                    label="Zipcode"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                />
                <Input
                    label="kW Total"
                    value={kwTotal}
                    onChange={(e) => setKwTotal(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </Button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {data.length > 0 && (
                <Table
                    aria-label="Electricity Data"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }>
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid}>{column.name}</TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={items}>
                        {(item) => (
                            <TableRow key={`${item.name_and_tariff}-${item.price}`}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(item, columnKey as keyof ElectricityData)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}