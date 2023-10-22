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

export async function PATCH(req: Request) {
    const dataToInsert = [
        { id: 1, position_code: 'A1', occupied: false, position_number: 101 },
        { id: 2, position_code: 'A2', occupied: false, position_number: 102 },
        { id: 3, position_code: 'A3', occupied: false, position_number: 103 },
        { id: 4, position_code: 'A4', occupied: false, position_number: 104 },
        { id: 5, position_code: 'A5', occupied: false, position_number: 105 },
        { id: 6, position_code: 'A6', occupied: false, position_number: 106 },
        { id: 7, position_code: 'A7', occupied: false, position_number: 107 },
        { id: 8, position_code: 'A8', occupied: false, position_number: 108 },
        { id: 9, position_code: 'A9', occupied: false, position_number: 109 },
        { id: 10, position_code: 'A10', occupied: false, position_number: 110 },
        { id: 11, position_code: 'B1', occupied: false },
        { id: 12, position_code: 'B2', occupied: false },
        { id: 13, position_code: 'B3', occupied: false },
        { id: 14, position_code: 'B4', occupied: false },
        { id: 15, position_code: 'B5', occupied: false },
        { id: 16, position_code: 'B6', occupied: false },
        { id: 17, position_code: 'B7', occupied: false },
        { id: 18, position_code: 'B8', occupied: false },
        { id: 19, position_code: 'B9', occupied: false },
        { id: 20, position_code: 'B10', occupied: false },
        { id: 21, position_code: 'C1', occupied: false },
        { id: 22, position_code: 'C2', occupied: false },
        { id: 23, position_code: 'C3', occupied: false },
        { id: 24, position_code: 'C4', occupied: false },
        { id: 25, position_code: 'C5', occupied: false },
        { id: 26, position_code: 'C6', occupied: false },
        { id: 27, position_code: 'C7', occupied: false },
        { id: 28, position_code: 'C8', occupied: false },
        { id: 29, position_code: 'C9', occupied: false },
        { id: 30, position_code: 'C10', occupied: false },
        { id: 31, position_code: 'D1', occupied: false },
        { id: 32, position_code: 'D2', occupied: false },
        { id: 33, position_code: 'D3', occupied: false },
        { id: 34, position_code: 'D4', occupied: false },
        { id: 35, position_code: 'D5', occupied: false },
        { id: 36, position_code: 'D6', occupied: false },
        { id: 37, position_code: 'D7', occupied: false },
        { id: 38, position_code: 'D8', occupied: false },
        { id: 39, position_code: 'D9', occupied: false },
        { id: 40, position_code: 'D10', occupied: false }
    ];
    try {
        const insertedRecords = await prisma.positions.createMany({
            data: dataToInsert,
        });
          // Respondemos con los registros insertados
        return NextResponse.json({message: 'Productos actualizados', insertedRecords})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'Error'})
    }
};