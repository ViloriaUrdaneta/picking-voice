import { NextResponse } from 'next/server';
import { prisma } from "@/libs/prisma";
import { FreightItem } from '@/types';

interface RequestBody {
    results: FreightItem[]; 
}

export async function GET() {
    try {
        const freights = await prisma.freight_items.findMany();
        return NextResponse.json(freights)
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({message: error.message},{status: 500})
        }
    }
};

export async function POST(req: Request) {
    try {
        const results = await  req.json();
        const ERPList = results.map((objeto: { productCode: any; }) => objeto.productCode);
        const products = await prisma.products.findMany({
            where: {
                ERP: {
                    in: ERPList,
                },
            },
            select: {
                id: true,
                ERP: true,
            },
        });
        const ERPToIdMap: any = {};
        products.forEach(product => {
            ERPToIdMap[product.ERP] = product.id;
        });
        const freightItems = results.map((obj: { productCode: any; UD: any; UE: any; UV: any; freight: any; route: any; }) => {
            const ERP = obj.productCode
            return {
                UD: obj.UD,
                UE: obj.UE,
                UV: obj.UV,
                freight: obj.freight,
                product_id: Number(ERPToIdMap[ERP]),
                route: obj.route,
                created_at: new Date(),
            };
        })
        console.log(freightItems)
        const newFreightItems = await prisma.freight_items.createMany({
            data: freightItems,
        });
        console.log('Datos recibidos del cliente:', newFreightItems);
        return NextResponse.json({message: 'Productos actualizados', newFreightItems})
    } catch (error) {
        console.log('error: ', error)
        return NextResponse.json({message: 'Error'})
    }
};
