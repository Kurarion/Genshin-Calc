import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnkaService, OverlayService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-enka',
  templateUrl: './enka.component.html',
  styleUrls: ['./enka.component.css']
})
export class EnkaComponent implements OnInit {

  uid = new UntypedFormControl();

  constructor(private enkaService: EnkaService, 
    private httpClient: HttpClient, 
    private matSnackBar: MatSnackBar, 
    private translateService: TranslateService, 
    private router: Router,
    private overlayService: OverlayService,) {
    this.enkaService.getEnkaUIDUpdate().subscribe((uid: string) => {
      this.uid.setValue(uid);
    })
  }

  ngOnInit(): void {
    let temp = this.enkaService.getData();
    if(temp.uid){
      this.uid.setValue(temp.uid);
    }
  }

  onClick(){
    if(this.uid.invalid || this.uid.value == undefined || this.uid.value == ""){
      this.uid.markAsTouched();
      this.uid.setErrors({'blank': true});
    }else{
      this.overlayService.showLoading();
      this.uid.setErrors(null);
      this.router.navigate(['/']);
      this.enkaService.initEnkaData(this.uid.value).then((addedNum: number)=>{
        //完了
        let messageId = 'ENKA.DONE'
        if (addedNum === 0) {
          messageId = 'ENKA.DONE_ZERO'
        }
        this.translateService.get(messageId).subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 2000
          })
        });
      }).catch(()=>{
        //失敗
        this.translateService.get('ENKA.FAILED').subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 2000
          })
        });
      }).finally(()=>{
        this.overlayService.hideLoading();
      })
    }
  }

}
