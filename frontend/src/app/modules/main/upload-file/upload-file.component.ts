import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeIn } from 'src/app/animations/animations';
import { AuthService } from 'src/app/services/auth.service';
import { UploadedFileService } from 'src/app/services/uploaded-file.service';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  animations: [fadeIn],
})
export class UploadFileComponent implements OnInit {
  filesList: any[];
  user: any;

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private uploadedFileService: UploadedFileService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserDetails();
    this.getAllFiles();
  }
  getAllFiles() {
    if (this.user?.id) {
      this.spinner.show();
      this.uploadedFileService.getAllUserFiles(this.user.id).subscribe(
        (res) => {
          this.spinner.hide();
          if (res?.data?.length) {
            this.filesList = res.data;
          }
        },
        (err) => {
          this.spinner.hide();
          console.error(err);
        }
      );
    }
  }
}
