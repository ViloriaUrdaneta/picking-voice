import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(req: Request) {
    try {
        const products = await prisma.products.findMany();
        return NextResponse.json(products)
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({message: error.message},{status: 500})
        }
    }
};

export async function POST(req: Request) {
    try {
        const { ERP, SKU, type, measure, category, blocked  } = await req.json();
        console.log(ERP, SKU, type, measure, category, blocked)
        const newProduct = await prisma.products.create({
            data: {
                ERP, SKU, type, measure, category, blocked,
                
            }
        })
        return NextResponse.json({message: 'Productos agregado exitosamente', newProduct})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({message: error.message},{status: 500})
        }
    }
}

