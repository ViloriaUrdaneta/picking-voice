export interface User {
    id: string,
    name: string
    password: string
    rol: string
    email: string
}

export interface Product2 {
    id: number;
    src: string;
    alt: string;
    isSelected: boolean;
}

export interface CountListItem {
    codigo: string;
    producto: string;
    cantidad: string;
}

export interface FreightItem { 
    productCode: string; 
    freight: string; 
    UD: number; 
    UE: number; 
    UV: number; 
    route: string 
}

export interface FreightList { 
    list: Array<FreightItem>
}

export interface Barcode {
    id: number;
    barcode_number: string;
}

export interface BarcodeProduct {
    id: number;
    product_id: number;
    barcode_id: number;
    type: string;
    active: boolean;
    barcodes: Barcode;
}

export interface Product {
    id: number;
    ERP: string;
    type: string;
    SKU: string;
    measure: string;
    category: string;
    blocked: boolean;
}

export interface CountingItem {
    product: string;
    quantity: string
}

export interface CountingList {
    [key: string]: Array<countingItem>;
}

export interface VoiceItem {
    product: string;
    quantity: string
}

export interface VoiceList {
    [key: string]: Array<voiceItem>;
}

export interface Position {
    id: number;
    position_code: string;
    position_number: number | null;
    occupied: boolean;
    due_date: Date | null;
    product_id: number | null
}