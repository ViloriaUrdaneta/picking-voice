import { CountingList } from '@/types';
import * as XLSX from 'xlsx';

export async function exportCounting(countingItemListgroup: CountingList) {
    try {
        for (const route in countingItemListgroup) {
            const dataArray = countingItemListgroup[route];
            const dataAsArray = dataArray.map(item => [
                item.product,
                item.quantity,
            ]);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([ ...dataAsArray]);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const filePath = `${route}.csv`;
            XLSX.writeFile(wb, filePath);
        }
    } catch (error) {
        console.log(error)
    }
}
