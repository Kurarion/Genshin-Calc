import { Component, OnInit } from '@angular/core';
import { EnkaService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-enka',
  templateUrl: './enka.component.html',
  styleUrls: ['./enka.component.css']
})
export class EnkaComponent implements OnInit {

  uid!: string;

  constructor(private enkaService: EnkaService) { }

  ngOnInit(): void {
    let temp = this.enkaService.getData();
    if(temp.uid){
      this.uid = temp.uid;
    }
  }

  onClick(){
    console.log("ddd")
    this.enkaService.initEnkaData(this.uid);
  }

}
