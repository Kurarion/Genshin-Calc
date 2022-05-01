import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-clipboard-data',
  templateUrl: './clipboard-data.component.html',
  styleUrls: ['./clipboard-data.component.css'],
})
export class ClipboardDataComponent implements OnInit {
  constructor(private clipboard: Clipboard) {}

  ngOnInit() {}

  getDataFromClipBoard() {
    // navigator.clipboard.read();
  }

  onPaste(e: any) {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let blob = null;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }
  }

  setDataToClipBorad() {
    // this.clipboard.copy();
  }
}
