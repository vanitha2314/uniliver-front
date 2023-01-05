import { MainService } from 'src/app/services/main.service';
import { HighChartService } from 'src/app/services/high-chart.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fadeIn } from 'src/app/animations/animations';
import * as fileSaver from 'file-saver';
import { ViewportScroller } from '@angular/common';
import {
  chartTypes,
  createChart,
  initCharts,
  CHART_COLORS_ARRAY,
} from 'src/app/helpers/charts';
import { startsWith } from 'src/app/helpers/validtors';
import { saveAsExcel } from 'src/app/helpers/xlsx';
import { AuthService } from 'src/app/services/auth.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SavedQueryService } from 'src/app/services/saved-query.service';
import { convertToCSV, downloadCSVFile } from 'src/app/helpers/csv';
import * as ace from "ace-builds";
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-sqlserver';
import * as XLSX from 'xlsx';
const { read, write, utils } = XLSX;
// import '../../../../../node_modules/ace-builds/src-min-noconflict/snippets/ext-language_tools.js'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [fadeIn],
})
export class ReportComponent implements OnInit {
  user: any;
  text: string;
  savePivotFile: string;
  saveFile: string;
  chartTypes = chartTypes;
  chart: any;
  uploadedFile: any = null;
  selectTableAndColumns: {};
  children: any;
  nodeList: any;
  chartForm: FormGroup;
  pivotForm: FormGroup;
  pivotFileName: FormGroup;
  pivotFilename = false;
  selectedTable = '';
  items: FormArray;
  selectedColumns: '';
  dataForm: FormGroup;
  selectedSource: any;
  filterColumn = [];
  pivotFilter_Offset = -1;
  pivotFilter_Limit  = 10;
  pivotFilter_current = -1;
  pivotFilter_totalPage = 0;
  pivotFilteredColumns: Array<{
    id: number;
    label: string;
    selectedType: string;
  }> = [];
  columns = {
    x: [] as any[],
    y: [] as any[],
  };
  pivotData = {
    row: [] as any[],
    column: [] as any[],
  };
  reportId: string;
  PivotItemValue: any = [];
  businessFunction: any;
  shareForm: FormGroup;
  sharePointForm: FormGroup;
  queryName: any;
  column: FormGroup;
  pivotDataResponse: any;
  isShown: boolean = false;
  isChartShown: boolean = false;
  isSaveButton: boolean = false;
  showTable: boolean = false;
  isPivotShown:boolean =false;
  uniqueId: string;
  reportData: any;
  selectedFile: File;
  selectedColumnsValue: any = [];
  editMode: boolean = false;
  today = new Date().toISOString();
  saveAsExcel = saveAsExcel;
  saveName: any;
  save: any;
  convertToCSV = convertToCSV;
  colmnsItem: Array<{ isChecked: boolean; name: string }> = [];
  responseKey: any;
  editedQuery: string;
  @Output('select') select = new EventEmitter<any>();
  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  @ViewChild('charts') public chartEl: ElementRef;
  @Input('type') type: string;
  selectedMode: string;
  adlsData: any;
  role: any;
  source: any;
  sources: any;
  selectedSchema: any;
  selectedTableName: any;
  selectedFilterIndexValue: any;
  selectedFilterIndexColumn: any;
  selectedFilterIndex: any;
  checkedAllItems: boolean = false;
  pivotSubmitted = false;
  previewDataDisable = true;
  fileSubmit = true;
  disableModifiedQuery = true;

  settings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    enableCheckAll: true,
    selectAllText: 'Chọn All',
    unSelectAllText: 'Hủy chọn',
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: 'Tìm kiếm',
    noDataAvailablePlaceholderText: 'Không có dữ liệu',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
  };

  @Input('query') set setQuery(query: string) {
    if (this.dataForm) {
      this.dataForm.patchValue({
        sqlQuery: query,
        queryMode: 'custom',
      });
    }
  }
  @Input('reportId') set serReportId(value: string) {
    if (value && !isNaN(+value)) {
      this.reportId = value;
      this.getReportData();
      this.editMode = true;
    } else {
      this.toast.error('Invalid Report!');
      this.router.navigate(['reports']);
    }
  }
  constructor(
    private fb: FormBuilder,
    private reportService: ReportsService,
    private savedQueryService: SavedQueryService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
    private changeDetectionRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private scroller: ViewportScroller,
    private mainService: MainService,
    public highChart: HighChartService,
  ) { }

  // tree: any = {
  //   node: 'Root',
  //   nodeType: 'folder',
  //   children: [],
  // };
  tree = [];
  pivotContainer: any = {
    node: 'Root',
    nodeType: 'folder',
    children: [],
  };
  tableData: any[] = [];
  tableList = {
    schemas: [] as any[],
    mapping: [] as any[],
    columns: [] as Array<{ isChecked: boolean; name: string }>,
    data: {} as any,
    tables: {} as any,
  };

  shareModal: Modal;
  sharePointModal: Modal;
  columnModal: Modal;
  pivotModal: Modal;
  savePivotFileName: Modal;
  @ViewChild('AceEditor') private editor!: ElementRef<HTMLElement>;
  // @ViewChild("editor") private editor: ElementRef<HTMLElement>;
  // @Input() private value?  = '';
  // @Input() private language? = 'ace/mode/javascript';
  private aceEditor: ace.Ace.Editor;
  @ViewChild('shareModalRef') shareModalRef: ElementRef;
  @ViewChild('sharePointRef') sharePointRef: ElementRef;
  @ViewChild('columnModalRef') columnModalRef: ElementRef;
  @ViewChild('pivotModalRef') pivotModalRef: ElementRef;
  @ViewChild('savePivotFileNameModalRef') savePivotFileNameModalRef: ElementRef;

  ngOnInit(): void {
    initCharts();
    this.user = this.authService.getUserDetails();
     this.createChartForm();
    this.getSourceData();
    this.createPivotForm();
    this.createDataForm();
    this.pivotFileName = this.fb.group({
      pivotFileName: ['', Validators.required]
    });
    this.shareForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.sharePointForm = this.fb.group({
      sharePoint: [],
    });
    this.selectBussinessFunction();
    this.items = this.pivotForm.get('items') as FormArray;
    this.items.push(this.createItem());
    console.log(this.businessFunction?.roles[0]);
  }

  getSourceData(){
    this.reportService.dataSourceList(this.user?.id).subscribe((res) => {
      console.log(res);
      this.sources = res.data;
  }, error => {
    this.spinner.hide();

   this.mainService.openDialog(error.error.message|| 'Some thing went wrong' )

    // console.log('filterd', error);
  }
  );
  }

  // SOURCE RELATED FUNCTIONS
  selectSource(ev: any) {
    console.log('select source', ev);
    this.tableData = [];
    this.isChartShown = false;
    this.chartForm.reset();
    this.pivotDataResponse =[];
    this.PivotItemValue =[];
    this.isPivotShown = false;
    this.fileSubmit = true;

    let column_list = this.selectedColumnsValue.join(',');


      const source = this.dataForm.get('source')?.value;
       if (source !== 'Upload File')
       {
         this.previewDataDisable = true;
       }else {
           this.uploadedFile = null;
           this.isShown = false;
       }
      if (source === 'SQL Server') {
        this.disableModifiedQuery = true;
        ace.config.set("fontSize", "14px");
        ace.config.set(
          "basePath",
          "https://unpkg.com/ace-builds@1.8.1/src-noconflict"
        );
        let editor: HTMLElement = document.getElementById('editor')!
        const aceEditor = ace.edit(editor);
        // aceEditor.session.setValue(`SELECT TOP(1000) ${column_list} FROM ${this.dataForm.controls.selectedSchema.value}.${this.dataForm.controls.selectedTable.value}`);
        // aceEditor.setTheme('ace/theme/twilight');
        aceEditor.session.setMode('ace/mode/sql');
        aceEditor.setOptions({ enableBasicAutocompletion: true })
        this.getTables();
      } else if (source === 'Data Lake') {
        this.adlsSource();
      }


    //
    // else if(this.source === 'sql'){
    //   this.getTables();
    // }

    // selectSource() {
    //   const source = this.dataForm.get('source')?.value;
    //   if (source === 'sql') {
    //     this.getTables();
    //   } else if (source === 'adls') {
    //     this.adlsSource();
    //   }

    // VALIDATION
    // if (source === 'sql') {
    //   const sqlQuery = this.dataForm?.get('sqlQuery');
    //   const selectedFile = this.dataForm?.get('selectedFile');
    //   sqlQuery?.setValidators([Validators.required, startsWith('select')]);
    //   sqlQuery?.updateValueAndValidity();
    //   sqlQuery?.setValidators([Validators.required, startsWith('select')]);
    //   selectedFile?.clearValidators();
    //   sqlQuery?.updateValueAndValidity();
    // } else {
    //   const sqlQuery = this.dataForm?.get('sqlQuery');
    //   const selectedFile = this.dataForm?.get('selectedFile');

    //   selectedFile?.setValidators([Validators.required, startsWith('select')]);
    //   selectedFile?.updateValueAndValidity();
    //   selectedFile?.setValidators([Validators.required, startsWith('select')]);

    //   sqlQuery?.clearValidators();
    //   sqlQuery?.updateValueAndValidity();
    // }
  }

  // BusinessFunction
  selectBussinessFunction() {
    this.businessFunction = JSON.parse(
      localStorage.getItem('id_data') as string
    );
    if (this.businessFunction?.roles[0] === 'NA_UPI_SC_Users') {
      this.role = 'SupplyChain';
    } else if (this.businessFunction?.roles[0] === 'NA_UPI_CD_Users') {
      this.role = 'CD';
    } else if (this.businessFunction?.roles[0] === 'NA_UPI_D&A_All_Users') {
      this.role = 'CD, Supply Chain';
    }
  }

  getTables() {
    this.spinner.show();
    this.reportService.getTableList().subscribe(
      (res) => {
        this.spinner.hide();
        if (res.status === 200 && res.data) {
          this.tableList.schemas = Object.keys(res.data);

          this.tableList.data = res.data;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  // Schema Related Function
  selectSchema(event: any) {
    this.disableModifiedQuery = true;
    console.log(event, 'selecting schema');
    this.tableList.mapping = this.tableList.data[event];
    this.tableList.tables = Object.keys(this.tableList.mapping);
    this.selectedSchema = event;
    for (const key in this.tableList.mapping) {
      if (Object.prototype.hasOwnProperty.call(this.tableList.mapping, key)) {
        const columnsName = this.tableList.mapping[key];
        this.tableList.mapping[key] = [];
        columnsName.forEach((columnName: string) => {
          this.tableList.mapping[key].push({
            isChecked: false,
            name: columnName,
          });
        });
      }
    }
  }
  getData() {
    return new Promise((resolve, reject) => {
      this.previewDataDisable = false;

      const formData = this.dataForm?.value;
      console.log(this.dataForm.controls.sqlQuery.value);
      if (this.isChartShown){
        this.isChartShown = false;
        this.chartForm.reset(); 
        this.isSaveButton = false;
      }
     

      if (formData?.source === 'SQL Server') {
        const payload = {
          query: formData?.sqlQuery,
        };
        this.spinner.show();
        this.reportService.getSQLQueryData(payload).subscribe(
          (res) => {
            this.spinner.hide();
            if (res.status === 200 && res.data) this.tableData = res.data;
            if (this.chartForm?.controls?.type?.value) {
              this.onChartTypeChange(this.chartForm?.controls?.type?.value);
            }
            resolve(true);
          },
          (err) => {
            this.spinner.hide();
            this.toast.error(err.message || 'Something went wrong!');
            // this.mainService.openDialog(err.error.message)

            console.error(err);
            reject(err);
          }
        );
      } else  {
        const data = {
          filePath: formData?.selectedFile?.path,
        };

        this.spinner.show();
        this.reportService
          .getAdlsData(formData?.selectedFile?.container, data)
          .subscribe(
            (res) => {
              this.spinner.hide();
              if (res.status === 200 && res.data)
              this.tableData = res.data;
              if (formData?.source !== 'SQL Server'){
              const index = this.tableData[0].indexOf('');
              if (index > -1){
                this.tableData.forEach( el => el.splice(index, 1));
              }
              }
              
              console.log(this.tableData)
              if (this.chartForm?.controls?.type?.value) {
                this.onChartTypeChange(this.chartForm?.controls?.type?.value);
              }
              resolve(true);
            },
            (err) => {
              this.spinner.hide();
              this.toast.error(err.message || 'Something went wrong!');
              console.error(err);
              reject(err);
            }
          );
      }
    });
  }
  createPivotTable() {
    this.isPivotShown = this.dataForm.get('source')?.value === 'SQL Server'? true : false;
    this.pivotForm.reset();
    this.pivotModal = new Modal(this.pivotModalRef.nativeElement, {});
    this.pivotData.column = []
    this.pivotModal.show();
  }

  onFileSelected(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
             /* read workbook */
             const bstr: string = e.target.result;
             const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
     
             /* grab first sheet */
             const wsname: string = wb.SheetNames[0];
             const ws: XLSX.WorkSheet = wb.Sheets[wsname];
     
             /* save data */
            const  data = XLSX.utils.sheet_to_json(ws);

    };
    reader.readAsBinaryString(target.files[0]);

    this.uploadedFile = <File>event.target.files[0];
    console.log(this.uploadedFile);
  }
  // onSharePointFileSelected(event:any){
  //   this.uploadedFile=<File>event.target.files[0]
  // }
  onUploadFile() {
    const fd = new FormData();
    this.previewDataDisable = false;
    this.isPivotShown = true;
    console.log('before', fd);
    fd.append('fileName', this.uploadedFile, this.uploadedFile.name);
    console.log('after', fd);
    this.reportService.uploadFiles(this.user?.id, fd).subscribe(
      (res) => {
        console.log('upload', res);
        console.log('data', res.data);
        this.spinner.hide();
        if (res.status === 200 && res.data) this.tableData = res.data;
        console.log('table', this.tableData);
        if (this.chartForm?.controls?.type?.value) {
          this.onChartTypeChange(this.chartForm?.controls?.type?.value);
        }
      },
      (err) => {
        this.spinner.hide();
        this.toast.error(err.message || 'Something went wrong!');
        console.error(err);
      }
    );
  }

  adlsSource() {
    const payload = {
      userId: this.user?.id,
      userName: this.user?.givenName,
      businessFunction: this.dataForm?.controls?.businessFunction?.value,
    };
    this.spinner.show();
    this.reportService.getAdlsContainerList(payload).subscribe((res) => {
      if (res.status === 200 && res.data) {
        this.spinner.hide();
        this.tree = res.data;
        console.log(this.tree);
        // this.pivotContainer=res.data[1];
      }
    }, error => {
      this.spinner.hide();

     this.mainService.openDialog(error.error.message || 'Something went wrong')

      // console.log('filterd', error);
    }
    );
  }
  onSelectTable(table: any) {
    this.selectedColumnsValue = [];
    this.disableModifiedQuery = false;
    this.selectedTable = this.tableList.data[this.selectedSchema][table];
    this.colmnsItem = this.tableList.mapping[table];
    this.columnSearch= this.colmnsItem;
    this.columnModal = new Modal(this.columnModalRef.nativeElement, {});
    this.columnModal.show();
      //  this.dataForm.reset();

    this.selectedTableName = table;
    this.changeDetectionRef.detectChanges();
    // this.selectedColumns=this.colmnsItem;

    // console.log(this.selectedColumns,"selectedColumns")
  }
  // onModifiedQuery(table: any) {
  //   this.selectedTable = this.tableList.data[this.selectedSchema][table];
  //   this.columnModal = new Modal(this.columnModalRef.nativeElement, {});
  //   this.columnModal.show();
  // }

  columnSearch: any = [];
  searchColumn(ev: any  = ''){
    //  console.log('text', ev);
    if (ev !== ''){
     this.columnSearch =  this.colmnsItem.filter(el => el.name.toLowerCase().includes(ev.toLowerCase()) );
    // console.log('search', this.columnSearch);
    }else {
      this.columnSearch= this.colmnsItem;
      this.selectedColumnsValue.forEach((el: any) => {
        this.columnSearch.forEach((ele: any) => {
          if (ele.name == el)
        {
          ele.isChecked = true;
        } })
      });
       
      
    }

}

  onColumnchange(event: any, column: any) {
    if (event?.target?.checked) {
      console.log(this.dataform.selectedColumns.value  );
    //  const indx =  this.colmnsItem.indexOf(column);
    //  if (indx > -1){
    //    this.colmnsItem[indx].isChecked = true;
    //  }
    // column.isChecked = true;
      this.selectedColumnsValue.push(column.name);
      this.selectedColumnsValue = [...new Set(this.selectedColumnsValue)];
    } else {
     
      //  column.isChecked = false;
      //  const indx =  this.colmnsItem.indexOf(column); 
      // if (indx > -1){
      //   this.colmnsItem[indx].isChecked = false;
      // }
      const index = this.selectedColumnsValue.findIndex(
        (col: any) => col === column
      );
      this.selectedColumnsValue.splice(index, 1);
    }

    // this.tableList.mapping[this.selectedTableName].columns = this.colmnsItem;
        // let column_list = this.selectedColumnsValue.join(',');
        const sqlQuery = `SELECT TOP(1000) ${this.selectedColumnsValue.join(',')} FROM ${this.dataForm.controls.selectedSchema.value}.${this.dataForm.controls.selectedTable.value}`;
        this.sqlEditor(sqlQuery);
  }
resetColumn(){
  this.columnModal.hide();
   this.colmnsItem.map(el => el.isChecked = false);
   this.tableList.mapping[this.selectedTableName].columns = this.colmnsItem;
   this.selectedColumnsValue = [];
   this.sqlEditor();
}

  sqlEditor(value = ``){
     ace.config.set("fontSize", "14px");
    ace.config.set(
      "basePath",
      "https://unpkg.com/ace-builds@1.8.1/src-noconflict"
    );
    let editor: HTMLElement = document.getElementById('editor')!
    const aceEditor = ace.edit(editor);
    aceEditor.session.setValue(value);
    // aceEditor.setTheme('ace/theme/twilight');
    aceEditor.session.setMode('ace/mode/sql');
    aceEditor.setOptions({ enableBasicAutocompletion: true })
    aceEditor.on("click", () => {
      console.log(aceEditor.getValue());
    });
  }

  onQuerySubmit() {
    let column_list = this.selectedColumnsValue.join(',');
    this.dataForm.patchValue({
      sqlQuery: `SELECT TOP(1000)  ${column_list} FROM ${this.dataForm.controls.selectedSchema.value}.${this.dataForm.controls.selectedTable.value}`,
    });
  }
  onQueryMode(mode: 'default' | 'custom' | 'modify',table:any) {
    if (mode === 'custom') {
      this.selectedMode = 'custom';
      this.sqlEditor();

      this.dataForm.controls.sqlQuery.enable();

      this.dataForm.patchValue({
        sqlQuery: '',
      });
      console.log(this.dataform.sqlQuery.value);

    } else if(mode === 'default'){
      this.selectedMode = 'default';
      this.dataForm.controls.sqlQuery.enable();
      this.editedQuery = this.dataForm.controls.sqlQuery.value;
      this.dataForm.patchValue({
        sqlQuery: `SELECT TOP(1000) * FROM ${this.dataForm.controls.selectedSchema.value}.${this.dataForm.controls.selectedTable.value};`,
      });
    }
    else if(mode === 'modify' && this.dataForm.controls?.selectedTable?.valid){
      this.selectedMode = 'modify';
      this.selectedTable =    this.tableList.data[this.selectedSchema][table] ;
      this.columnModal = new Modal(this.columnModalRef.nativeElement, {});
      this.columnModal.show();
    }

  }
  onPivotTypeChange(event: any) {
    this.pivotData.row = [];
    let  i = this.dataForm?.controls?.source?.value !== 'Data Lake'? 0: 1;

    Object.entries(this.tableData[0]).map((e: any[]) => {
      this.pivotData.row.push({ col: e[i], isTime: false });
    });
  }
  rowValueChange(event: any) {
    this.pivotData.column = [];
    event.forEach((element: any) => {
      this.pivotData.row.forEach((col) => {
        if (col.col === element) {
        } else {
          this.pivotData.column.push(col);
        }
      });
    });
  }
  // columnValueChange(event:any){
  //   console.log(event,"col")
  // }
  onSubmittingPivotDatas(){
    this.pivotSubmitted = true;
   if (this.pivotForm.valid){
    this.pivotModal.hide();
   const source = this.dataForm.get('source')?.value;

if (source === 'Data Lake'){

    this.savePivotFileName = new Modal(this.savePivotFileNameModalRef.nativeElement,{});
    this.savePivotFileName.show();

}
else if (source === 'SQL Server') {
this.onSubmittingPivotData();
}


}
  }

  get fc(){
    return this.pivotForm.controls;
  }
  get dataform(){
    return this.dataForm.controls;
  }
  sqlPivotBody: any = {};
  onSubmittingPivotData() {
    const source = this.dataForm.get('source')?.value;
    if (source === 'Data Lake' && this.pivotFilename) {
      this.pivotFilename = false;
      const dataFormData = this.dataForm.value;
      const pivotFormValues = this.pivotForm.value;
      let filterRequestParam = {} as any;
      console.log(pivotFormValues)
      if (pivotFormValues.items[0].filterColumnData != null) {
        for (const pivotFormValueItem of pivotFormValues.items) {
          const filterValueDataConvert = pivotFormValueItem.filterValueData.toString();
          filterRequestParam[pivotFormValueItem.filterColumnData] =
            filterValueDataConvert;
        }
      }
      filterRequestParam = JSON.stringify(filterRequestParam);
      // if (filterRequestParam[""] === ''){
      //  filterRequestParam = {};
      // }
      const key = this.selectedFilterIndexValue;
      const data = {
        dataSource: source,
        pivotTableName:  this.pivotFileName.controls.pivotFileName.value,
        email: this.user?.mail,
        userName: this.user?.givenName,
        containerName: dataFormData.selectedFile?.name,
        filePath: dataFormData.selectedFile?.path,
        pivotInput: {
          rows: (this.pivotForm.controls.rowData.value).toString(),
          columns: (this.pivotForm.controls.colData.value).toString(),
          aggregator: this.pivotForm.controls.aggregate.value,
          aggregationDimension: this.pivotForm.controls.dimension.value,
          filter: this.checkedAllItems ? '' : filterRequestParam?.null === null? {}: filterRequestParam,
        },
      };

      if (this.checkedAllItems) {
        data.pivotInput.filter = {};
      }
      this.PivotItemValue = [];
      this.spinner.show();
      this.reportService
        .getPivotData(this.user?.id, data)
        .subscribe(( res ) => {

              this.spinner.hide();
            if (res.status === 200 ) {
              this.mainService.openDialog(res.message);
            // this.pivotDataResponse = res.data;
            // this.pivotDataResponse.forEach((item: any) => {
            //   if (item.hasOwnProperty('value')) {
            //     this.PivotItemValue.push(item.value);
            //     console.log("values", this.PivotItemValue)

            //   }
            // });
          }
          if (res.status === 202){
            const dialog = this.mainService.openDialog(res.message);
            dialog.afterClosed().subscribe(ref => {
                          this.savePivotFileName = new Modal(this.savePivotFileNameModalRef.nativeElement,{});
            this.savePivotFileName.show(); 
            });
            // this.savePivotFileName = new Modal(this.savePivotFileNameModalRef.nativeElement,{});
            // this.savePivotFileName.show(); 
          }
          }, error => {
            console.log('data lake ', error);

             this.mainService.openDialog(error.error.message || 'Something Went wrong');

            this.spinner.hide();
          }
        );
    } else if (source === 'SQL Server') {
      const dataFormData = this.dataForm.value;
      const pivotFormValues = this.pivotForm.value;
      let filterRequestParam = {} as any;
      if (pivotFormValues.items[0].filterColumnData != "") {
        for (const pivotFormValueItem of pivotFormValues.items) {
          filterRequestParam[pivotFormValueItem.filterColumnData] =
            pivotFormValueItem.filterValueData;
        }
      }
      this.sqlPivotBody = { 
        dataSource: source,
        userId: this.user?.id,
        email: this.user?.mail,
        userName: this.user?.givenName, 
        query: this.dataForm.controls.sqlQuery.value,
        pivotInput: {
          rows: this.pivotForm.controls.rowData.value,
          columns: this.pivotForm.controls.colData.value,
          aggregator: this.pivotForm.controls.aggregate.value,
          aggregationDimension: this.pivotForm.controls.dimension.value,
          filter: this.checkedAllItems ? '' : filterRequestParam,
        },
      };
      if (this.checkedAllItems) {
        this.sqlPivotBody.pivotInput.filter = {};
      }
      this.PivotItemValue = [];
      this.spinner.show();
      this.reportService
        .createSqlPivot(this.user?.id, this.sqlPivotBody)
        .subscribe((res) => {
          this.spinner.hide();
          console.log('data', res);
          this.pivotDataResponse = res.data;
          this.pivotDataResponse.forEach((item: any) => {
            if (item.hasOwnProperty('value')) {
              this.PivotItemValue.push(item.value);
            }
          });
        }, error => {
          this.spinner.hide();

         this.mainService.openDialog(error.error.message || 'something Went wrong');

          // console.log('filterd', error);
        }
        );
    }
  }

  savePivotInformation() {
    this.savePivotFileName = new Modal(
      this.savePivotFileNameModalRef.nativeElement,
      {}
    );
    this.save = convertToCSV(this.PivotItemValue);
    // console.log("csv",this.save)
    this.savePivotFileName.show();
  }

  savePivotData() {
    this.pivotFilename = true;
    if (this.pivotFileName.valid){
      this.savePivotFileName.hide();
      const source = this.dataForm.get('source')?.value;
      if (source === 'Data Lake')
      {
        this.onSubmittingPivotData();

      }
      else if (source === 'SQL Server') {

    const fd = new FormData();
    this.savePivotFile = this.pivotFileName.controls.pivotFileName.value + '.csv';
    var blob = new File([this.save], this.savePivotFile, { type: 'text/csv' });
    console.log("savePivotData", this.save)
    fd.append('fileName', blob, this.savePivotFile);
    this.reportService
      .savePivotData(this.user?.id, this.user?.givenName, fd)
      .subscribe((res) => {
        this.spinner.hide();
        if (res.status === 202){

          const dialog = this.mainService.openDialog(res.message);
          dialog.afterClosed().subscribe(ref => {
                        this.savePivotFileName = new Modal(this.savePivotFileNameModalRef.nativeElement,{});
          this.savePivotFileName.show(); 
          });
          
// this.savePivotInformation(); 
        }
        else if (res.status === 200){
           this.saveSqlData();
        }else {
           this.mainService.openDialog(res.message);
        }
       
       }, error => {
         this.spinner.hide();
         console.log('save adls pivot Data', error);
       });
    this.adlsSource();
    document
      .getElementById('scrollToPivotFiles')
      ?.scrollIntoView({ behavior: 'smooth' });
     
    }
    }
    }

    saveSqlData(){
      this.sqlPivotBody.pivotTableName = this.pivotFileName.controls.pivotFileName.value;
this.spinner.show()
              this.reportService.savePivotDataInSql(this.sqlPivotBody).subscribe(res =>{
                if (res.status === 200){
           this.spinner.hide();
            this.mainService.openDialog(res.message);
          }else{
            this.mainService.openDialog(res.message);
          } 
        },
        error => {
          this.spinner.hide();
          console.log('saveSqlpivot Data', error);
        });
    }

  columnFilteredData(selectedFilterIndex: number) {
    console.log( 'selected column',selectedFilterIndex);
    const source = this.dataForm.get('source')?.value;
    if (source === 'Data Lake') {
      this.selectedFilterIndex = selectedFilterIndex;
      const pivotFormValues = this.pivotForm.value;
      this.selectedFilterIndexValue =
        pivotFormValues.items[selectedFilterIndex].filterColumnData;
      this.selectedFilterIndexColumn =
        pivotFormValues.items[selectedFilterIndex].filterValueData;
      const dataFormData = this.dataForm.value;
      const payLoad = {
        containerName: dataFormData.selectedFile?.name,
        filePath: dataFormData.selectedFile?.path,
        fieldName: this.selectedFilterIndexValue,
        limit: this.pivotFilter_Limit,
        offset: this.pivotFilter_Offset
      };
      this.spinner.show();
      this.reportService.createAdlsPivotFilter(payLoad).subscribe((res) => {
        this.spinner.hide();
        const filter = res.data
        this.pivotFilter_totalPage = res.totalPages;
        this.pivotFilter_current = res.currentPage;
        this.filterColumn= this.filterColumn.concat(filter);
        let index = 0;
        this.filterColumn.forEach((element: string) => {
          this.pivotFilteredColumns.push({
            id: index,
            label: element,
            selectedType: 'All',
          });
          index++;
        });
      }, error => {
        this.spinner.hide();

      //  this.mainService.openDialog(error.error.message)

        // console.log('filterd', error);
      }
      );
    } else if (source === 'SQL Server') {
      this.selectedFilterIndex = selectedFilterIndex;
      const pivotFormValues = this.pivotForm.value;
      this.selectedFilterIndexValue =
        pivotFormValues.items[selectedFilterIndex].filterColumnData;
      this.selectedFilterIndexColumn =
        pivotFormValues.items[selectedFilterIndex].filterValueData;
      const dataFormData = this.dataForm.value;
      let column_list = this.selectedColumnsValue.join(',');
      const payLoad = {
        query: `SELECT TOP(1000)  ${column_list} FROM ${this.dataForm.controls.selectedSchema.value}.${this.dataForm.controls.selectedTable.value}`,
        fieldName: this.selectedFilterIndexValue,
      };
      this.spinner.show();
      this.reportService.createSqlPivotFilter(payLoad).subscribe((res) => {
        this.spinner.hide();
        this.filterColumn = res.data;
        let index = 0;
        this.filterColumn.forEach((element: string) => {
          this.pivotFilteredColumns.push({
            id: index,
            label: element,
            selectedType: 'All',
          });
          index++;
        });
      });
    }
  }
  valueFilteredData(selectedFilterIndex: any) {
    const pivotFormValues = this.pivotForm.value;
    this.selectedFilterIndexColumn =
      pivotFormValues.items[selectedFilterIndex]?.filterValueData;
  }
  addFilterItems(): void {
    this.items = this.pivotForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  toggleCheckAll(event: any) {
    console.log(event);
    this.checkedAllItems = event.target?.checked;
    if (this.checkedAllItems) {
      this.selectAllFilteredItems();
    } else {
      this.unSelectAllFilteredItems();
    }
  }
  private getPivotFormItemFormGroup(index: number): FormGroup {
    const formGroup = (this.pivotForm.controls['items'] as FormArray).controls[
      index
    ] as FormGroup;
    return formGroup;
  }
  selectAllFilteredItems() {
    (this.pivotForm.controls['items'] as FormArray).controls[
      this.selectedFilterIndex
    ]
      .get('filterValueData')
      ?.patchValue(this.filterColumn.map((f: string) => f));
    // console.log("checked",this.checkedAllItems,"")
  }
  private unSelectAllFilteredItems() {
    (this.pivotForm.controls['items'] as FormArray).controls[
      this.selectedFilterIndex
    ]
      .get('filterValueData')
      ?.patchValue([]);
  }
  removeOrClearFilter() {
    var i: any;
    const items = this.pivotForm.get('items') as FormArray;
    if (items.length > 1) {
      items.removeAt(i);
    } else {
      items.reset();
    }
  }

  // CHART RELATED FUNCTIONS
  onPreview() {
    // INITIALIZING VARIABLES
     this.isChartShown = true;
    // this.isSaveButton = !this.isSaveButton;
    const dataFormData = this.dataForm.value;
    const formData = this.chartForm.value;
    let processedData: any = {};
    let chartData: any = {};
    if (!dataFormData?.source) {
      return;
    }
    if (this.chart && !this.chart.reportData) {
      this.chart.destroy();
    }
    if (formData?.type === 'grid' && !formData?.xCoord?.length) {
      return;
    }
    const payload = {
      ...formData,
    };

    if (dataFormData?.source === 'Data Lake') {
      payload.containerName = dataFormData.selectedFile.name;
      payload.filePath = dataFormData.selectedFile.path;
      // payload.containerName = "selfservicewebapp"
    } else if (dataFormData?.source === 'SQL Server') {
      payload.query = dataFormData.sqlQuery;
    } else if (dataFormData?.source === 'Upload File') {
      payload.fileName = this.uploadedFile.name;
      payload.userId = this.user?.id;
    }

    payload.chartType = payload.type;
    payload.xCoord =
      typeof payload.xCoord === 'string' ? [payload.xCoord] : payload.xCoord;
    payload.yCoord =
      typeof payload.yCoord === 'string' ? [payload.yCoord] : payload.yCoord;
    this.spinner.show();
    this.reportService.getChartData(dataFormData?.source, payload).subscribe(
      (res) => {
        if (res.status === 200){
          this.isSaveButton = true;
          res.data.title = this.chartForm.controls?.title?.value;
          this.spinner.hide();
          // if (false){
          //   this.isChartShown = false;
          // this.highChart.createChart(this.chartEl.nativeElement, res?.data, payload.type);
          // }
          
          // else{
        console.log(res)
        
        if (formData.type === 'pie' || formData.type === 'doughnut') {
          chartData = {
            labels: res.data.labels,
            datasets: [
              {
                data: res.data.datasets[0].data,
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)',
                ],
              },
            ],
          };
          // RENDERING CHART
          this.chart = createChart('chart', formData.type, chartData, {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: formData.title,
              },
            },
          });

          this.chartForm.patchValue({ chartData: chartData });
        } else if (formData.type === 'line' || formData.type === 'bar') {
          // const chartDatasets: Array<{
          //   label: string;
          //   backgroundColor: string;
          //   borderColor: string;
          //   data: any;
          // }> = [];
          // console.log(
          //   'object.Values',
          //   Object.values(res.data.datasets[0].data)
          // );
          // console.log('object', res.data.datasets[0].data);
          // for (let index = 0; index < res.data.labels.length; index++) {
          //   const element = res.data.labels[index];
          //   chartDatasets.push({
          //     label: element,
          //     backgroundColor: res.data.datasets[0].backgroundColor,
          //     borderColor: res.data.datasets[0].borderColor,
          //     data: res.data.datasets[0].data[index],
          //   });
          // }
          chartData = {
            ...(formData.isXCoordTime ? {} : { labels: res.data.labels }),

            // static data
            //   labels: ["January", "February", "March", "April", "May", "June"],
            //   datasets: [{
            //     label: "My First dataset",
            //     backgroundColor: "rgba(255,99,132,0.4)",
            //     hoverBorderColor: "rgba(255,99,132,1)",
            //     data: [65, 59, 20, 81, 56, 55],
            //  }, {
            //     label: "My Second dataset",
            //     backgroundColor: "rgba(25,25,255,0.4)",
            //     hoverBorderColor: "rgba(255,99,132,1)",
            //     data: [65, 59, 20, 81, 56, 55],
            //  }]
            // datasets: chartDatasets,
            datasets: [
              {
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: formData.isXCoordTime
                  ? res.data.datasets[0].data
                  : Object.values(res.data.datasets[0].data),
              },
            ],
          };

          // RENDERING CHART
          this.chart = createChart('chart', formData.type, chartData, {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: formData.title,
              },
            },
            ...(formData.isXCoordTime
              ? {
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'month',
                    },
                  },
                },
              }
              : {}),
          });

          this.chartForm.patchValue({ chartData: chartData });
        } else if (formData.type === 'radar') {
          this.tableData.forEach((tableEntry: any) => {
            if (processedData[tableEntry[formData.xCoord]]) {
              formData.radarBasis.forEach((basis: any) => {
                if (basis.selected) {
                  if (!processedData[tableEntry[formData.xCoord]])
                    processedData[tableEntry[formData.xCoord]] = {};
                  processedData[tableEntry[formData.xCoord]][basis.basis] +=
                    tableEntry[basis.basis];
                }
              });
            } else {
              formData.radarBasis.forEach((basis: any) => {
                if (basis.selected) {
                  if (!processedData[tableEntry[formData.xCoord]])
                    processedData[tableEntry[formData.xCoord]] = {};
                  processedData[tableEntry[formData.xCoord]][basis.basis] =
                    tableEntry[basis.basis];
                }
              });
            }
          });
          chartData = {
            labels: Object.keys(Object.values(processedData)[0] as any),
            datasets: Object.keys(processedData).map((key: any) => {
              return {
                label: key,
                data: Object.values(processedData[key]),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)',
              };
            }),
          };
          this.chart = createChart('chart', formData.type, chartData, {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: formData.title,
              },
            },
          });
        } else if (
          formData.type === 'group-bar' ||
          formData.type === 'stacked-bar'
        ) {
          // CHART CONFIGURATION
          // TODO ONCE COLORS ARE AVAILABLE FROM BACKED USE RES.DATA AND REMOVE THIS OBJECT
          chartData = {
            ...(formData.isXCoordTime ? {} : { labels: res.data.labels }),
            datasets: (res.data.datasets as any[]).map((dataset, index) => {
              return {
                ...dataset,
                backgroundColor: CHART_COLORS_ARRAY[index],
                borderColor: CHART_COLORS_ARRAY[index],
              };
            }),
          };
          // RENDERING CHART
          this.chart = createChart('chart', 'bar', chartData, {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: formData.title,
              },
            },
            scales: {
              x: {
                ...(formData.isXCoordTime
                  ? {
                    type: 'time',
                    time: {
                      unit: 'month',
                    },
                  }
                  : {}),
                stacked: formData.type === 'stacked-bar',
              },
              y: {
                stacked: formData.type === 'stacked-bar',
              },
            },
          });

          this.chartForm.patchValue({ chartData });
        } else if (formData.type === 'grid') {
          this.reportData = res.data;

          // CHART CONFIGURATION
          chartData.reportData = this.reportData;

          // RENDERING CHART
          this.chart = chartData;
          // this.chartForm.patchValue({ chartData });

          this.chartForm.patchValue({ chartData });
        }
        // this.chartForm.patchValue({ chartData: chartData });
        document
          .getElementById('scrollToChart')
          ?.scrollIntoView({ behavior: 'smooth' });
          }
      // else {
        
      // }
      // }
      this.mainService.openDialog(res.message);
    },
      (err) => {
        console.log(err);
        this.mainService.openDialog(err?.error?.message|| err.message);
        this.spinner.hide();
        this.isSaveButton = false;
      }
    );
  }

  onChartTypeChange(event: any) {
    this.columns.x = [];
   let  i = this.dataForm?.controls?.source?.value !== 'Data Lake'? 0: 1;

    Object.entries(this.tableData[0]).map((e: any[]) => {
      this.columns.x.push({ col: e[i], isTime: false });
      this.pivotData.row.push({ col: e[i], isTime: false });
    });

    this.columns.y = [];

    Object.entries(this.tableData[0]).map((e: any[]) => {
      this.columns.y.push({ col: e[i], isTime: false });
      this.pivotData.column.push({ col: e[i], isTime: false });
    });
  }

  onChangeXCoord() {
    if (
      this.chartForm.controls.type.value === 'radar' &&
      this.chartForm.controls.xCoord.value &&
      this.tableData &&
      this.tableData[0]
    ) {
      this.chartForm.controls.radarBasis?.value?.forEach(
        (element: any, index: number) => {
          (this.chartForm.controls.radarBasis as FormArray).removeAt(0);
        }
      );
      Object.keys(this.tableData[0]).forEach((element: any) => {
        if (
          this.chartForm.controls.xCoord.value !== element &&
          !isNaN(this.tableData[0][element])
        ) {
          (this.chartForm.controls.radarBasis as FormArray).push(
            this.fb.group({
              basis: element,
              selected: false,
            })
          );
        }
      });
    }
    // this.chartForm.patchValue({ radarDases:  })
  }

  onSave() {
    const dataFormData = this.dataForm.value;
    const formData = this.chartForm.value;
    // let processedData: any = {};
    // let chartData: any = {};
    if (!dataFormData?.source) {
      return;
    }
    // if (this.chart && !this.chart.reportData) {
    //   this.chart.destroy();
    // }
    if (formData?.type === 'grid' && !formData?.xCoord?.length) {
      return;
    }
    if (this.chartForm.valid && this.user?.id) {
      const requestDta = { ...formData };
      delete requestDta['chartData'];
      delete requestDta['title'];
      const payload = {
        reportData: {
          ...this.chartForm.value,
          dataSource: this.dataForm.value,
        },
        requestData: requestDta,
        uniqueId: this.uniqueId,
        createdBy: this.user?.id,
      };
      if (dataFormData?.source === 'Data Lake') {
        payload.requestData.containerName = dataFormData.selectedFile.name;
        payload.requestData.filePath = dataFormData.selectedFile.path;
        // payload.containerName = "selfservicewebapp"
      } else if (dataFormData?.source === 'SQL Server') {
        payload.requestData.query = dataFormData.sqlQuery;
      } else if (dataFormData?.source === 'Upload File') {
        payload.requestData.fileName = this.uploadedFile.name;
        payload.requestData.userId = this.user?.id;
      }

      payload.requestData.chartType = payload.requestData.type;
      payload.requestData.xCoord =
        typeof payload.requestData.xCoord === 'string'
          ? [payload.requestData.xCoord]
          : payload.requestData.xCoord;
      payload.requestData.yCoord =
        typeof payload.requestData.yCoord === 'string'
          ? [payload.requestData.yCoord]
          : payload.requestData.yCoord;

      this.spinner.show();
      if (this.editMode && this.reportId && this.type === 'createdByMe') {
        this.reportService
          .updateReport(this.user.id, this.reportId, payload)
          .subscribe(
            (res) => {
              this.spinner.hide();
              this.toast.success('Successfully updated Report!');
            },
            (err) => {
              this.spinner.hide();
              this.toast.error(err?.message || 'Something went wrong!');
            }
          );
      } else {
        this.reportService.createReport(payload).subscribe(
          (res) => {
            this.spinner.hide();
            this.toast.success('Successfully saved Report!');
          },
          (err) => {
            this.spinner.hide();
            this.toast.error(err?.message || 'Something went wrong!');
          }
        );
      }
    }
  }

  onSaveQuery() {
    this.shareModal = new Modal(this.shareModalRef.nativeElement, {});
    this.shareModal.show();
  }
  onSharePoint() {
    this.sharePointModal = new Modal(this.sharePointRef.nativeElement, {});
    this.sharePointModal.show();
  }
  itemSelector() {
    this.isShown = !this.isShown;
  }
  onUrlSubmit() {
    window.location.href = 'https://unilever.sharepoint.com/';
  }
  onNameSubmit() {
    this.queryName = this.text;
    if (this.dataForm.valid && this.user?.id) {
      const data = {
        query: this.dataForm.controls.sqlQuery.value,
        queryName: this.queryName,
      };
      // this.spinner.show();
      this.savedQueryService.createSavedQuery(this.user.id, data).subscribe(
        (res) => {
          this.spinner.hide();
          this.toast.success('Successfully saved query!');
        },
        (err) => {
          this.spinner.hide();
          console.error(err);
        }
      );
    }
  }
  createPivotForm() {
    this.pivotForm = this.fb.group({
      aggregate: ['', Validators.required],
      rowData: ['', Validators.required],
      colData: ['', Validators.required],
      dimension: ['', Validators.required],

      items: new FormArray([]),
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      filterValueData: new FormControl(''),
      filterColumnData: new FormControl(''),
    });
  }
  // FORMS RELATED FUNCTIONS
  createChartForm() {
    this.chartForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      xCoord: ['', Validators.required],
      isXCoordTime: [false],
      stacked: [false],
      yCoord: [''],
      radarBasis: this.fb.array([]),
      chartData: [null],
    });
  }

  createDataForm() {
    this.dataForm = this.fb.group({
      source: [''],
      sqlQuery: [''],
      file: [''],
      question: [''],
      selectedFile: [{}],
      selectedPivotFile: [{}],
      selectedSchema: [''],
      selectedTable: ['', Validators.required],
      businessFunction: [''],
      selectedColumns: [''],
      queryMode: ['default'],
      selectedSource: [''],
      uploadedFile: [''],
      fileInput: [],
      local: [''],
    });
  }

  getRadarFormArray() {
    return (this.chartForm?.controls?.radarBasis as FormArray)
      ?.controls as FormGroup[];
  }

  // EDIT REPORTS RELATED FUNCTIONS
  getReportData() {
    this.reportService.getReportById(this.reportId).subscribe(
      (res) => {
        if (res?.data === 200 || res?.data) {
          this.reportData = res.data;
          this.uniqueId = res.data.uniqueId;
          this.patchReportData();
          setTimeout(() => {
            this.onPreview();
          }, 1000);
        }
      },
      (err) => {
        console.error(err);
        this.toast.error(err?.error?.message || 'Something went wrong');
        this.router.navigate(['reports']);
      }
    );
  }

  patchReportData() {
    if (this.reportData?.reportData?.dataSource) {
      this.dataForm.patchValue({
        source: this.reportData.reportData.dataSource?.source || '',
        sqlQuery: this.reportData.reportData.dataSource?.sqlQuery || '',
        file: this.reportData.reportData.dataSource?.file || '',
        selectedFile: this.reportData.reportData.dataSource?.selectedFile,
        selectedSchema:
          this.reportData.reportData?.dataSource?.selectedSchema || '',
      });

      this.getData().then((res) => {
        if (res) {
          this.onChartTypeChange({
            target: { value: this.reportData.data?.type },
          });
          this.chartForm.patchValue({
            title: this.reportData.reportData?.title || '',
            type: this.reportData.reportData?.type || '',
            xCoord: this.reportData.reportData?.xCoord || '',
            isXCoordTime: this.reportData.reportData?.isXCoordTime || false,
            stacked: this.reportData.reportData?.isXCoordTime || false,
            yCoord: this.reportData.reportData?.yCoord || '',
            radarBasis: this.reportData.reportData?.radarBasis || '',
            chartData: this.reportData.reportData?.chartData || '',
          });
          this.onChangeXCoord();
        }
      });
    }
  }

  // handle tree event
  handleSelectFile(fileObj: any) {
    this.fileSubmit =  false
    console.log('BeforefileObj', fileObj);
    if (
      fileObj.container &&
      fileObj.path &&
      fileObj.path.includes(`${fileObj.container}/`)
    ) {
      console.log('fileObj', fileObj);
      // let fileNameWithFolder = this.user?.givenName;
      this.reportService.onPivotFileDataChange$.next({
        containerName: fileObj.container,
        filePath: fileObj.path.split(`${fileObj.container}/`)[1],
      });
      fileObj.path = fileObj.path.split(`${fileObj.container}/`)[1];
    }

    this.dataForm.patchValue({
      selectedFile: fileObj,
    });
  }

  handleColumnSelection(event: any) {
    this.dataForm.patchValue({
      sqlQuery: `SELECT TOP(1000) ${event.id} FROM ${this.dataForm.controls.selectedSchema.value}.${event.table}`,
    });
  }
  // ngAfterViewInit(): void {

  //   ace.config.set("fontSize", "14px");
  //   ace.config.set(
  //     "basePath",
  //     "https://unpkg.com/ace-builds@1.8.1/src-noconflict"
  //   );
  //   let editor:HTMLElement=document.getElementById('editor')!
  //   const aceEditor = ace.edit(editor);
  //   aceEditor.session.setValue("select * from ");
  //   // aceEditor.setTheme('ace/theme/twilight');
  //   aceEditor.session.setMode('ace/mode/sql');
  //   aceEditor.setOptions({enableBasicAutocompletion: true})
  // }
  // ngAfterViewInit(): void {
  //   ace.config.set('basePath', "https://ace.c9.io/build/src-noconflict/");
  //   // this.aceEditor = ace.edit(this.editor.nativeElement);
  //   ace.config.set("fontSize", "14px");
  //   const aceEditor = ace.edit(this.editor?.nativeElement);
  //   // this.aceEditor.session.setMode(this.language);
  //   // const aceEditor =ace.edit(this.editor.nativeElement);
  //       // aceEditor.session.setValue("<h1>html<h1>");
  //       // aceEditor.renderer.attachToShadowRoot()
  //       aceEditor.setTheme('ace/theme/twilight');
  //       aceEditor.session.setMode('ace/mode/html');
  //     //  this. aceEditor.on("change", () => {
  //     //     console.log(aceEditor.getValue());
  //     //  });
  // }

  // applyFilter(filterValue: any) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // to lowercase matches
  //   this.tableData.filter = filterValue;
  //   console.log(this.tableData.filter, "filter")
  // }


  fetchColumnFilter(i: any, status = false ){
    const source = this.dataForm.get('source')?.value;
    if(source === 'Data Lake'){
      
      if (this.pivotFilter_current <= this.pivotFilter_totalPage){
        this.pivotFilter_Offset  = status? 0: this.pivotFilter_current + 1;
        this.filterColumn = status? [] : this.filterColumn; 
        this.columnFilteredData(i);
      }
    }else {
       this.columnFilteredData(i);
    }
  }
};



