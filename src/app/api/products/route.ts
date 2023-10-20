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
}
