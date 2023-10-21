import { NextResponse } from 'next/server';
import { CountListItem, countingList } from '@/types';
import { prisma } from '@/libs/prisma';
import * as XLSX from 'xlsx';

interface ExcelData {
    [key: string]: Array<CountListItem>;
};

interface RequestBody {
    excelDataArray: ExcelData[]; 
}

export async function POST(req: Request) {
    try {
        const { excelDataArray }: RequestBody = await req.json();
        console.log('Datos recibidos del cliente:', excelDataArray[0]);
        return NextResponse.json({message: 'Productos actualizados'})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'Error'})
    }
}

export async function GET(req: Request) {
    const today = new Date().toISOString().split('T')[0];
    try {
        const freights = await prisma.freight_items.findMany({
            where: {
                created_at: {
                    gte: today + 'T00:00:00.000Z', 
                    lte: today + 'T23:59:59.999Z',
                },
            },
        });
        const productList = freights.map(freight => freight.product_id).filter(id => id !== null) as number[];

        const barcodes = await prisma.barcode_product.findMany({
            where: {
                product_id: {
                    in: productList,
                },
            },
            include: {
                barcodes: true
            }
        })


        const freightObjectsArray: any = [];
        freights.forEach((freightItem) => {
            if(freightItem.freight){
                const freightData = freightItem.freight.split(',');
                for (let i = 0; i < freightData.length; i ++) {
                    const quantity = parseInt(freightData[i]);
                    const unitType = freightData[i + 1];
                    if (!isNaN(quantity) && unitType) {
                        freightObjectsArray.push({
                            route: freightItem.route,
                            product_id: freightItem.product_id,
                            quantity,
                            unitType,
                        });
                    }
                }
            }
        });
        
        const combinedObjects: any = [];
        freightObjectsArray.forEach((freightItem: any) => {
            const matchingBarcodes = barcodes.filter((barcodeItem) => barcodeItem.product_id === freightItem.product_id);
            matchingBarcodes.forEach((matchingBarcode) => {
                if (matchingBarcode.barcodes) {
                    if (freightItem.unitType === 'CAJA' && matchingBarcode.type === 'box') {
                        freightItem.barcode_number = matchingBarcode.barcodes.barcode_number;
                        combinedObjects.push(freightItem);
                    } else if (freightItem.unitType === 'DSPL' || freightItem.unitType === 'BARR' || freightItem.unitType === 'POTE' && matchingBarcode.type === 'unit'){
                        freightItem.barcode_number = matchingBarcode.barcodes.barcode_number;
                        combinedObjects.push(freightItem);
                    }
                }
            })
        });

        const countingItemListgroup: countingList = {};
        combinedObjects.forEach((obj: { route: any; quantity: any; barcode_number: any; }) => {
            const { route, quantity, barcode_number } = obj;
            if (!countingItemListgroup[`RUTA ${route}`]) {
                countingItemListgroup[`RUTA ${route}`] = [];
            }
            countingItemListgroup[`RUTA ${route}`].push({ product: barcode_number, quantity });
        })

        for (const route in countingItemListgroup) {
            const dataArray = countingItemListgroup[route];
        
            const dataAsArray = dataArray.map(item => [
                item.product,
                item.quantity,
            ]);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([ ...dataAsArray]);
        
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        
            const filePath = `C:\\Users\\Miguel Viloria\\Desktop\\${route}.csv`;
        
            XLSX.writeFile(wb, filePath);
        
            console.log(`Archivo CSV para ${route} generado con éxito`);
        }

        console.log('countingItemListgroup: ', countingItemListgroup)
        return NextResponse.json({message: 'Productos conseguidos'})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'Error'})
    }
}
