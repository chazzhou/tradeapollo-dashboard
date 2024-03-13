import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '@nextui-org/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

interface FeaturePanelProps {
    feature: any;
    onClose: () => void;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({ feature, onClose }) => {
    const [priceData, setPriceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        if (feature) {
            const currentDate = new Date().toISOString().split('T')[0];
            setSelectedDate(currentDate);
            fetchPriceData(currentDate);
        }
    }, [feature]);

    const fetchPriceData = async (date: string) => {
        try {
            const response = await fetch(
                `https://frankfurt.corles.net/price_data?date=${date}&country_bidding_zone=${feature.properties.zoneName}`
            );
            const data = await response.json();
            setPriceData(data);
        } catch (error) {
            console.error('Error fetching price data:', error);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setSelectedDate(selectedDate);
        fetchPriceData(selectedDate);
    };

    const formatXAxis = (tickItem: string) => {
        return moment(tickItem).format('HH:mm');
    };

    const calculateStats = () => {
        if (priceData.length === 0) {
            return null;
        }

        const prices = priceData.map((data: any) => data.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

        return (
            <Card className="mb-4 p-4" shadow="none">
                <p>Min Price: {minPrice.toFixed(2)} EUR/MWh</p>
                <p>Max Price: {maxPrice.toFixed(2)} EUR/MWh</p>
                <p>Average Price: {avgPrice.toFixed(2)} EUR/MWh</p>
            </Card>
        );
    };

    const exportToCsv = () => {
        if (priceData.length === 0) {
            return;
        }

        const csvContent = "data:text/csv;charset=utf-8," + priceData.map((data: any) => `${data.time},${data.price},${data.unit}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${feature.properties.zoneName}_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!feature) {
        return null;
    }

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 w-96 h-screen bg-white shadow-lg z-50 overflow-y-auto"
        >
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{feature.properties.countryName}</h2>
                <p className="mb-4">Electricity Zone: {feature.properties.zoneName}</p>
                <div className="mb-6">
                    <label htmlFor="date-select" className="block font-semibold mb-2">
                        Select Date:
                    </label>
                    <input
                        type="date"
                        id="date-select"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {calculateStats()}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Pricing Data</h3>
                    {priceData.length > 0 ? (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={priceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" tickFormatter={formatXAxis} />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <Button color="secondary" onClick={exportToCsv} className="mt-4">
                                Export as CSV
                            </Button>
                        </>
                    ) : (
                        <p>No pricing data available for the selected date.</p>
                    )}
                </div>
                <Button color="primary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </motion.div>
    );
};

export default FeaturePanel;