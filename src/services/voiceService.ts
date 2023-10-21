import * as XLSX from 'xlsx';
import { voiceList } from '@/types'


export async function exportVoices(voiceItemListgropu: voiceList) {
    
    try {
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

    } catch (error) {
        console.log(error)
    }
}