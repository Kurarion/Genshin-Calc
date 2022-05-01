import { Component, OnInit } from '@angular/core';
import { DBCharacter, genshindb } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  backgroundURL!: string;

  constructor() { }

  ngOnInit(): void {
    let data = DBCharacter.create("ganyu", {resultLanguage: 'cn_sim'});
    console.log(DBCharacter.listNames("liyue", {resultLanguage: 'cn_sim'}))
    console.log(data)
    console.log(data.stats("80"))

    this.backgroundURL = data.images.cover1;
  }

}
