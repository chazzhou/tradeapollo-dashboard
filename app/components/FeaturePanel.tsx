import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@nextui-org/react';

interface FeaturePanelProps {
    feature: any;
    onClose: () => void;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({ feature, onClose }) => {
    if (!feature) {
        return null;
    }

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 w-96 h-screen bg-white shadow-lg z-50"
        >
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{feature.properties.countryName}</h2>
                <p className="mb-4">Electricity Zone: {feature.properties.zoneName}</p>
                {/* Add more content from DB */}
                <Button
                    color='primary'
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        </motion.div>
    );
};

export default FeaturePanel;