import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnkaService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-enka',
  templateUrl: './enka.component.html',
  styleUrls: ['./enka.component.css']
})
export class EnkaComponent implements OnInit {

  uid = new FormControl();

  constructor(private enkaService: EnkaService, private httpClient: HttpClient, private matSnackBar: MatSnackBar, private translateService: TranslateService, private router: Router) { }

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
      this.uid.setErrors(null);
      this.router.navigate(['/']);
      this.enkaService.initEnkaData(this.uid.value).then(()=>{
        //完了
        this.translateService.get('ENKA.DONE').subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 1000
          })
        });
      }).catch(()=>{
        //失敗
        this.translateService.get('ENKA.FAILED').subscribe((res: string) => {
          this.matSnackBar.open(res, undefined, {
            duration: 1000
          })
        });
      })
    }
  }

}
