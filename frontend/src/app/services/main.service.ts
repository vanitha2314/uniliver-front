import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { User } from 'src/app/shared/models/User';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private httpService: HttpService,
              private dialog: MatDialog) {
   }

   deleteUser(user : any) :Observable<User>{
    return this.httpService.delete<User>("/deleteUser", user);
  }
  updateProfile(user : User){
    return this.httpService.put<User>("/updateProfile", user);
  }
  activateAndDeactive(user : User){
    return this.httpService.put<User>("/activateAndDeactive", user);
  }
  listAllUsers(user : any){
    return this.httpService.get<User>("/listAllUsers");
  }

  openDialog(data: any){
    const dialogref = this.dialog.open(DialogComponent, {
      data:data,
      width: '400px',
      minHeight: '179px',
      panelClass: 'dialogClass',
      hasBackdrop: true,
    });
    return dialogref;

  }
}



