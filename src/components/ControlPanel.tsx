import React, { useState } from 'react';

interface ControlPanelProps {
    onlyFreeOnes: () => void;
    onlyOccupied: () => void;
    searchByProduct: (searchValue: string, x: number) => void;
    showAll: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onlyFreeOnes, onlyOccupied, searchByProduct, showAll }) => {

    const [searchProduct, setSearchProduct] = useState<string>('');

    const handleSearch = () => {
        searchByProduct(searchProduct, -5.5);
    };
    
    return (
        <div className="fixed top-4 right-4 p-4 bg-white border border-gray-300 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Control Panel</h2>
            <button
                className=" block w-full mb-2 bg-sky-800 hover:bg-sky-700 text-white py-2 px-4 rounded"
                onClick={onlyFreeOnes}
            >
                Mostrar libres
            </button>
            <button
                className=" block w-full mb-2 bg-sky-800 hover:bg-sky-700 text-white py-2 px-4 rounded"
                onClick={onlyOccupied}
            >
                Mostrar ocupados
            </button>
            <button
                className="block  w-full mb-2 bg-sky-800 hover:bg-sky-700 text-white py-2 px-4 rounded"
                onClick={showAll}
            >
                Mostrar todos
            </button>
            <input
                type="text"
                placeholder="Buscar por producto"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="block mb-2 bg-zinc-200 px-4 py-2 rounded"
            />
            <button
                className="bg-sky-800 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSearch}
                >
                Buscar
            </button>
        </div>
    );
};

export default ControlPanel;
