"use client"
import React, { useState } from 'react';
import { Product } from '@/types';


interface ProductTableProps {
    products: Product[];
    onEditProduct: (product: Product) => void;
    onEditEan: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEditProduct, onEditEan }) => {

    const [searchFilters, setSearchFilters] = useState({
        ERP: '',
        type: '',
        SKU: '',
        measure: '',
        category: '',
        blocked: '',
    });

    const filteredProducts = products.filter((product) => {
        return (
            product.ERP.includes(searchFilters.ERP) &&
            product.type.includes(searchFilters.type) &&
            product.SKU.includes(searchFilters.SKU) &&
            product.measure.includes(searchFilters.measure) &&
            product.category.includes(searchFilters.category) &&
            (searchFilters.blocked === '' || product.blocked === (searchFilters.blocked === 'true'))
        );
    });

    const handleFilterChange = (property: string, value: string) => {
        setSearchFilters({
            ...searchFilters,
            [property]: value,
        });
    };

    return (
        <div className="mt-12">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ERP</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blocked</th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="text"
                                value={searchFilters.ERP}
                                onChange={(e) => handleFilterChange('ERP', e.target.value)}
                                placeholder="Buscar por ERP"
                            />
                        </th>
                        <th>
                            <input
                                type="text"
                                value={searchFilters.SKU}
                                onChange={(e) => handleFilterChange('SKU', e.target.value)}
                                placeholder="Buscar por SKU"
                            />
                        </th>
                        <th>
                            <input
                                type="text"
                                value={searchFilters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                placeholder="Buscar por Description"
                            />
                        </th>
                        <th>
                            <input
                                type="text"
                                value={searchFilters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                placeholder="Buscar por Categoría"
                            />
                        </th>
                        <th>
                        <select
                            value={searchFilters.blocked}
                            onChange={(e) => handleFilterChange('blocked', e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="true">Bloqueados</option>
                            <option value="false">No Bloqueados</option>
                        </select>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{product.ERP}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{product.SKU}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{product.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{product.blocked ? 'Yes' : 'No'}</td>
                            <td>
                                <button
                                    onClick={() => onEditProduct(product)}
                                    className="bg-sky-800 text-white px-4 mx-1 py-1 rounded hover:bg-blue-700"
                                >
                                    Editar
                                </button>
                            </td>
                            <td>
                                <button
                                    onClick={() => onEditEan(product)}
                                    className="bg-sky-800 text-white px-2 py-1 rounded hover:bg-blue-700"
                                >
                                    EAN
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProductTable
