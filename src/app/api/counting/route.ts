import { NextResponse } from 'next/server';
import { CountingList } from '@/types';
import { prisma } from '@/libs/prisma';


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

        const countingItemListgroup: CountingList = {};
        combinedObjects.forEach((obj: { route: any; quantity: any; barcode_number: any; }) => {
            const { route, quantity, barcode_number } = obj;
            if (!countingItemListgroup[`RUTA ${route}`]) {
                countingItemListgroup[`RUTA ${route}`] = [];
            }
            countingItemListgroup[`RUTA ${route}`].push({ product: barcode_number, quantity });
        })

        return NextResponse.json(countingItemListgroup)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'Error'})
    }
}
