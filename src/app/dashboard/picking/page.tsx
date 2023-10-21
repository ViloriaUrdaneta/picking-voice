"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import * as XLSX from 'xlsx';
import { useGetFreigthsQuery, useCreateFreightsMutation, useGetVoicesQuery } from '@/redux/services/apiSlice';
import { FreightItem } from '@/types';
import { exportVoices } from '@/services/voiceService'


interface ExcelDataResult {
    route: string;
    sheetDataCsv: string;
    sheetDataJson: any[]; 
    worksheetName: string;
}


const Excell = () => {

    const [excelFiles, setExcelFiles] = useState<FileList | null>(null);
    const [typeError, setTypeError] = useState<string | null>(null);

    const { data: freightsData, error: freightsError, isLoading: freightsLoading } = useGetFreigthsQuery(null);
    const { data: voicesData, error: voicesErrod, isLoading: voicesLoading } = useGetVoicesQuery(null);
    const [ createFreights ] = useCreateFreightsMutation()

    console.log('voicesData: ', voicesData)

    async function readExcelFile(file:File): Promise<ExcelDataResult> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                if (data) {
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[worksheetName];
                    const sheetDataFormulae = XLSX.utils.sheet_to_formulae(worksheet);
                    const routeCell = sheetDataFormulae[14]
                    let route;
                    const indice: number = routeCell.indexOf("'");
                    if (indice !== -1) {
                        route = routeCell.slice(indice + 1).trim();
                    } else {
                        route = 'ruta desconocida';
                    }
                    const sheetDataJson = XLSX.utils.sheet_to_json(worksheet);
                    const sheetDataCsv = XLSX.utils.sheet_to_csv(worksheet);
                    resolve({ route, sheetDataCsv, sheetDataJson, worksheetName });
                } else {
                    reject('No se pudieron leer los datos del archivo.');
                }
            };
            reader.onerror = (e) => {
                reject('Ocurrió un error al leer el archivo.');
            };
            reader.readAsArrayBuffer(file);
        })
    }

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        let fileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
        let selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            if (Array.from(selectedFiles).every(file => fileTypes.includes(file.type))) {
                setTypeError(null);
                setExcelFiles(selectedFiles);
            } else {
                setTypeError('Please select only excel file types');
                setExcelFiles(null);           
            }
        } else {
            setTypeError('Please select one or more files');
            setExcelFiles(null);
        }
    }


    const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const results: Array<FreightItem> = [];
        if (excelFiles !== null) {
            for (let i = 0; i < excelFiles.length; i++) {
                const file = excelFiles[i];
                try {
                    const { route, sheetDataCsv, sheetDataJson, worksheetName } = await readExcelFile(file); 
                    let productsLines: string;
                    const lines = sheetDataCsv.split('\n');
                    const pattern = /^[0-9]{3,4}-\d/;
                    const selectedLines = lines.filter((line) => pattern.test(line));
                    productsLines = selectedLines.join('\n');
                    const products = productsLines.split('\n');
                    products.forEach((product) => {
                        const match = product.match(pattern);
                        if (match) {
                            const code = match[0];
                            const productCode = code.split('-')[0];
                            const parts = product.split(',');
                            if (parts.length > 3) {
                                const startIndex = 3; 
                                const endIndex = parts.length - 3;
                                const UV = Number(parts[parts.length -1])
                                const UE = Number(parts[parts.length -2])
                                const UD = Number(parts[parts.length -3])
                                if (endIndex > startIndex) {
                                    const loadRaw = parts.slice(startIndex, endIndex).join(',');
                                    const freight = loadRaw.replace(/^,*|,+/g, ',').replace(/^,|,$/g, '').trim();
                                    results.push({ productCode, freight, UD, UE, UV, route });
                                }
                            }
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
        createFreights(results);
    }

    const exportRoutes = async () => {
      if(voicesData) await exportVoices(voicesData)
    };


    return (
        <div className='p-14'>
            <h3 className="text-4xl font-bold mb-4 text-center">Ingresa listados de carga individual</h3>
            <form className='mt-12 text-center' onSubmit={handleFileSubmit}>
                <input type='file' className='bg-slate-200 block mx-auto mb-4 w-64' required multiple onChange={handleFile} />
                <div className="flex justify-center"> 
                    <button
                        type="submit"
                        className="bg-sky-800 px-4 py-2 text-white rounded hover:bg-blue-700 mr-4"
                    >
                        Subir
                    </button>
                    <button
                        onClick={exportRoutes}
                        className="bg-sky-800 px-4 py-2 text-white rounded hover:bg-blue-700"
                    >
                        Exportar rutas
                    </button>
                </div>
                {typeError && (
                    <div role='alert'>{typeError}</div>
                )}
            </form>
        </div>
    );
}

export default Excell;
