import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { marked } from 'marked';
import { HttpService } from 'src/app/shared/shared.module';

export interface ManualDialogData {
  file: string;
}

@Component({
  selector: 'app-manual-dialog',
  templateUrl: './manual-dialog.component.html',
  styleUrls: ['./manual-dialog.component.css']
})
export class ManualDialogComponent implements OnInit {

  content!: string;

  constructor(
    public dialogRef: MatDialogRef<ManualDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ManualDialogData,
    private httpService: HttpService,
  ) {
    this.content = ""
  }

  ngOnInit(): void {
    this.httpService.get<string>(this.data.file, "text", true).then(async (res: string|null)=>{
      if(res){
        this.content = (await marked.parse(res)).replace(/href="\.\/.*?"/g, '')
      }
    })
  }

}
