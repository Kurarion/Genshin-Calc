import { Component, OnInit } from '@angular/core';
import { OcrService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-artifact-list',
  templateUrl: './artifact-list.component.html',
  styleUrls: ['./artifact-list.component.css'],
})
export class ArtifactListComponent implements OnInit {
  constructor(private ocrService: OcrService) {}

  ngOnInit() {}

  updateLanguage() {}

  addArtifactList(image: Blob) {
    //OCR
    this.ocrService.ocr(image);
  }
}
