import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {GlobalProgressService} from 'src/app/shared/shared.module';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.css'],
})
export class LoadingOverlayComponent {
  value!: Observable<number>;
  constructor(private globalProgressService: GlobalProgressService) {
    this.value = globalProgressService.getValue();
  }
}
