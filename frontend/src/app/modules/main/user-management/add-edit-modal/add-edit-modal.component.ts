import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.scss'],
})
export class AddEditModalComponent implements OnInit {
  @ViewChild('demoModal') input: ElementRef;
  theModal: Modal;
  constructor() {}

  ngOnInit(): void {}

  public show() {
    // console.log(this.input.nativeElement);
    // this.theModal = new Modal(this.input.nativeElement, {});
    // this.theModal.show();
  }
}
