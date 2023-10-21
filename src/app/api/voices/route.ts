import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import * as XLSX from 'xlsx';
import { voiceList } from '@/types'

interface item {
    id: number;
    ERP: string | null;
    SKU: string | null; 
    product_id: number | null;
    freight: string | null;
    route: string | null;
    created_at: Date | null;
    position_number: number | null; 
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
        const productPositions = await prisma.positions.findMany({
            where: {
                product_id: {
                    in: productList,
                },
            },
            select: {
                product_id: true,
                position_number: true,
            },
        });
        const products = await prisma.products.findMany({
            where: {
                id: {
                    in: productList,
                },
            },
            select: {
                id: true,
                ERP: true,
                SKU: true
            },
        });
        const productPositionMap: any = {};
        productPositions.forEach(position => {
            if(position.product_id){
                productPositionMap[position.product_id] = position.position_number;
            }
        });
        const productERPMap: any = {};
        products.forEach(product => {
            if(product.id){
                productERPMap[product.id] = product.ERP;
            }
        });
        const productSKUMap: any = {};
        products.forEach(product => {
            if(product.id){
                productSKUMap[product.id] = product.SKU;
            }
        });
        const itemList: item[] = freights.map(freight => ({
            id: freight.id,
            ERP: null,
            SKU: null,
            product_id: freight.product_id,
            freight: freight.freight,
            route: freight.route,
            created_at: freight.created_at,
            position_number: null, 
        }));
        itemList.forEach(obj => {
            const productId = obj.product_id;
            if (productId !== null && productPositionMap[productId] !== undefined) { 
                obj.position_number = productPositionMap[productId];
                obj.ERP = productERPMap[productId]
                obj.SKU = productSKUMap[productId]
            }
        });
        const voiceItemListgropu: voiceList = {};
        itemList.forEach(obj => {
            const { route, ERP, SKU, freight, position_number } = obj;
            if (!voiceItemListgropu[`Nueva ruta ${route}`]) {
                voiceItemListgropu[`Nueva ruta ${route}`] = [];
            }
            voiceItemListgropu[`Nueva ruta ${route}`].push({ product: `Posición ${position_number} CODIGO ${ERP} ${SKU} CARGAR`, quantity: freight !== null ? freight.split(',').map(part => 
                part.trim() === 'DSPL' || part.trim() === 'PQTE' || part.trim() === 'POTE' || part.trim() === 'BARR' || part.trim() === 'BLSA' ? 'UNIDAD' : part).join(' ') : "ups", });
        })

        for (const route in voiceItemListgropu) {
            const dataArray = voiceItemListgropu[route];
        
            const dataAsArray = dataArray.map(item => [
                item.product,
                item.quantity,
            ]);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([[`RECORRIDO ${route}`], ...dataAsArray]);
        
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        
            const filePath = `C:\\Users\\Miguel Viloria\\Desktop\\${route}.xlsx`;
        
            XLSX.writeFile(wb, filePath);
        
            console.log(`Archivo Excel para ${route} generado con éxito`);
        }

        return NextResponse.json({message: 'Productos conseguidos', voiceItemListgropu})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({message: error.message},{status: 500})
        }
    }
}