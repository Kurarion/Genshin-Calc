import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface TextInputDialogData {
  title: string;
  content: string;
  cancel: string;
  ok: string;
  inputLabel: string;
  titleVal?: Record<string,any>;
  contentVal?: Record<string,any>;
  cancelVal?: Record<string,any>;
  okVal?: Record<string,any>;
  inputLabelVal?: Record<string,any>;
}

export interface TextInputDialogResult {
  value: any
  isOk: boolean
}

@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrls: ['./text-input-dialog.component.css']
})
export class TextInputDialogComponent {

  result!: TextInputDialogResult;

  constructor(
    public dialogRef: MatDialogRef<TextInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TextInputDialogData,
  ) {
    this.result = {
      value: '',
      isOk: false
    }
  }

  onNoClick(): void {
    this.result.isOk = false;
    this.dialogRef.close(this.result);
  }

  onOkClick(): void {
    this.result.isOk = true;
    this.dialogRef.close(this.result);
  }
}
