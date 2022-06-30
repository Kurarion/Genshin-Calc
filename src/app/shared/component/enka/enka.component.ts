import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EnkaService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-enka',
  templateUrl: './enka.component.html',
  styleUrls: ['./enka.component.css']
})
export class EnkaComponent implements OnInit {

  uid = new FormControl();

  constructor(private enkaService: EnkaService) { }

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
      this.enkaService.initEnkaData(this.uid.value);
    }
  }

}
