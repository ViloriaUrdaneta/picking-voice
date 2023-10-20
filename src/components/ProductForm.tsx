"use client"
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';


interface ProductFormProps {
    onSubmit: (newProduct: any) => void; 
    initialProduct?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialProduct }) => {

    const [newProduct, setNewProduct] = useState<Product>({
        id: 0,
        ERP: '',
        type: '',
        SKU: '',
        measure: '',
        category: '',
        blocked: false,
    });

    useEffect(() => {
        if (initialProduct) {
            setNewProduct(initialProduct);
        }
    }, [initialProduct]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const isChecked = (e.target as HTMLInputElement).checked;
            setNewProduct({
                ...newProduct,
                [name]: isChecked,
            });
        } else {
            setNewProduct({
                ...newProduct,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(newProduct);
        setNewProduct({
            id: 0,
            ERP: '',
            type: '',
            SKU: '',
            measure: '',
            category: '',
            blocked: false,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-4">
                    <label htmlFor="ERP">ERP:</label>
                    <input
                        type="text"
                        id="ERP"
                        name="ERP"
                        value={newProduct.ERP}
                        onChange={handleChange}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="type">Type:</label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        value={newProduct.type}
                        onChange={handleChange}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="SKU">SKU:</label>
                    <input
                        type="text"
                        id="SKU"
                        name="SKU"
                        value={newProduct.SKU}
                        onChange={handleChange}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="measure">Measure:</label>
                    <input
                        type="text"
                        id="measure"
                        name="measure"
                        value={newProduct.measure}
                        onChange={handleChange}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={newProduct.category}
                        onChange={handleChange}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="blocked">Blocked:</label>
                    <input
                        type="checkbox"
                        id="blocked"
                        name="blocked"
                        checked={newProduct.blocked}
                        onChange={handleChange}
                        className="block p-4 mt-2"
                    />
                </div>
            </div>
            <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
            >
                {initialProduct ? 'Guardar' : 'Agregar'}
            </button>
        </form>
    );
};

export default ProductForm;

