import { Component, HostListener, OnInit } from '@angular/core';
import { ArtifactService, Const } from 'src/app/shared/shared.module';

const OptimalStep = 10;
const MinValid = 0;
const MaxValid = (4 + 5) * 5 * OptimalStep;

@Component({
  selector: 'app-artifact-auto',
  templateUrl: './artifact-auto.component.html',
  styleUrls: ['./artifact-auto.component.css']
})
export class ArtifactAutoComponent implements OnInit {

  readonly subs = Const.PROPS_OPTIMAL_ARTIFACT_SUB;

  constructor(private artifactService: ArtifactService) { }

  ngOnInit(): void {
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    //データ保存
    this.artifactService.saveData();
  }
}
