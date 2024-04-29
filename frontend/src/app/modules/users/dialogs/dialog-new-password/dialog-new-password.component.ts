import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogNewPasswordModel } from '../../../../core/models';

@Component({
  selector: 'app-dialog-new-password',
  templateUrl: './dialog-new-password.component.html',
  styleUrls: ['./dialog-new-password.component.scss']
})
export class DialogNewPasswordComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRefNewPasswordComponent: MatDialogRef<DialogNewPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogNewPasswordModel
  ) {}

  ngOnInit() {
  }

  // Function to close the dialog
  closeClick() {
    this.dialogRefNewPasswordComponent.close();
  }

  ngOnDestroy(): void {
    this.dialogRefNewPasswordComponent.close();
  }
}
