import { Component, HostListener, OnInit } from '@angular/core';
import { ArtifactService } from 'src/app/shared/shared.module';

const MaxSubTimes = 4 + 4 + 4 + 69

@Component({
  selector: 'app-artifact-auto',
  templateUrl: './artifact-auto.component.html',
  styleUrls: ['./artifact-auto.component.css']
})
export class ArtifactAutoComponent implements OnInit {

  constructor(private artifactService: ArtifactService) { }

  ngOnInit(): void {
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.artifactService.saveData();
  }
}
