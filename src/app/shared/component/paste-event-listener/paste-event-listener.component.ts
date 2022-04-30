import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-paste-event-listener',
  templateUrl: './paste-event-listener.component.html',
  styleUrls: ['./paste-event-listener.component.css'],
})
export class PasteEventListenerComponent implements OnInit {
  @Output('pastedImage') pastedImage = new EventEmitter<Blob>();

  constructor() {}

  ngOnInit() {}

  @HostListener('document:paste', ['$event'])
  onPaste(event: any) {
    const items = event.clipboardData.items;
    let blob = null;

    if (items[0] && items[0].type.indexOf('image') === 0) {
      blob = items[0].getAsFile();
      this.pastedImage.emit(blob);
    }
  }
}
