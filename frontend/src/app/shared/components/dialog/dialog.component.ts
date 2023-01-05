import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>) { }



  ngOnInit(): void {
    // setTimeout(() => {
    //   this.dialogRef.close();
    // }, 2000);
    console.log(this.data);
  }
  closeDialog(){
     this.dialogRef.close();
  }

}
