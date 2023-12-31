import * as XLSX from 'xlsx';
import { VoiceList } from '@/types'

export async function exportVoices(voiceItemListgropu: VoiceList) {
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
            const filePath = `${route}.xlsx`;
            XLSX.writeFile(wb, filePath);
        }
    } catch (error) {
        console.log(error)
    }
}