import * as XLSX from 'xlsx';
import { Readable } from 'stream';


export function jsonToExcel(jsonArray: any): Readable {
    // Convertir le tableau JSON en feuille de calcul
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray);

    // Créer un nouveau classeur
    let workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // Ajouter la feuille de calcul au classeur
    XLSX.utils.book_append_sheet(workbook, worksheet, "Récapitulatif");

    // Écrire le classeur dans un buffer
    let buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Créer un stream à partir du buffer
    let stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return stream;
}
