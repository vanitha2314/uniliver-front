import * as XLSX from 'xlsx';

export const saveAsExcel = (id: string) => {
  let element = document.getElementById(id);
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${new Date().getTime()}.xlsx`);
};
