import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-tree',
  templateUrl: './table-tree.component.html',
  styleUrls: ['./table-tree.component.scss'],
})
export class TableTreeComponent implements OnInit {
  schemaObject: any;
  tables: any[];
  selectedTable = '';
  selectedColumns: string[] = [];
  @Output('select') select = new EventEmitter<any>();
  selectTableAndColumns:{}
  @Input('schemaObject') set setObjects(value: any) {
    this.tables = value && Object.keys(value);
    this.schemaObject = value;
  }

  constructor() {}

  ngOnInit(): void {}

  onExpand(table: string) {
    this.selectedTable = this.selectedTable === table ? '' : table;
  }

  onSelect(event: any, column: string) {
    if (event?.target?.checked) {
      this.selectedColumns.push(column);
    } else {
      const index = this.selectedColumns.findIndex((col) => col === column);
      this.selectedColumns.splice(index, 1);
    }
    this.selectTableAndColumns= {
      id: this.selectedColumns,
      table:this.selectedTable 
    }
    this.select.emit(this.selectTableAndColumns);
  }
}
