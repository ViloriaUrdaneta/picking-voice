import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(req: Request) {
    try {
        const positions = await prisma.positions.findMany();
        return NextResponse.json(positions)
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({message: error.message},{status: 500})
        }
    }
};

export async function POST(req: Request) {
    try {
        const { product, position } = await req.json();
        const productId = await prisma.products.findFirst({
            where: {
                id: product,
            },
            select: {
                id: true,
            },
        })
        if(productId){
            const updatedProduct = await prisma.positions.update({
                where: {
                    id: position.id
                },
                data: {
                    product_id: {
                        set: productId.id // Usamos productId.id para obtener el valor numérico
                    },
                    occupied: true
                }
            })
            console.log(updatedProduct)
        }
        const positions = await prisma.positions.findMany();
        console.log('positions: ', positions)
        return NextResponse.json({message: 'Productos actualizados', positions})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'Error'})
    }
};

export async function PUT(req: Request) {
    try {
        const { position } = await req.json();
        console.log('position: ', position)
        const updatedProduct = await prisma.positions.update({
            where: {
                id: position.id
            },
            data: {
                product_id: null,
                occupied: false
            }
        })
        const positions = await prisma.positions.findMany();
        return NextResponse.json({message: 'Productos actualizados', updatedProduct})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'Error'})
    }
};