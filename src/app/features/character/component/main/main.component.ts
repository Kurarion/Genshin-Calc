import { Component, OnInit } from '@angular/core';
import { DBCharacter, HttpService } from 'src/app/shared/shared.module';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  backgroundURL!: string;
  data!: any; 

  constructor(private httpClient: HttpClient, private httpService: HttpService) { }

  ngOnInit(): void {
    this.data = DBCharacter.create("hutao", {resultLanguage: 'cn_sim'});
    console.log(DBCharacter.listNames("liyue", {resultLanguage: 'cn_sim'}))
    console.log(this.data)
    console.log(this.data.stats("80"))

    this.httpService.get<Blob>(this.data.images.cover1, 'blob').then((v: Blob|null)=>{
      if(v){
        this.backgroundURL = window.URL.createObjectURL(v);
      }
    })
  }

  test(){
    this.httpService.get<Blob>(this.data.images.cover1, 'blob').then((v: Blob|null)=>{
      if(v){
        this.backgroundURL = window.URL.createObjectURL(v);
      }
    })
  }

}
