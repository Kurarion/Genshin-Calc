import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-mat-filtering-selector',
  templateUrl: './mat-filtering-selector.component.html',
  styleUrls: ['./mat-filtering-selector.component.css']
})
export class MatFilteringSelectorComponent implements OnInit {
  @Input('title') title!: string;
  @Input('model') model!: any;
  @Input('hasBlankOption') hasBlankOption: boolean = false;
  @Output('modelChange') modelChange = new EventEmitter<any>();
  @Input('OriginList') OriginList!: any[];
  @Input('OriginListFilterFunc') OriginListFilterFunc!: ((value:any) => boolean) | undefined;
  @Input('OptionValueProperty') OptionValueProperty!: string;
  @Input('OptionInnerTextProperty') OptionInnerTextProperty!: string;
  @Input('currentLanguage') currentLanguage!: string;

  filteringContent: string = "";
  displayList!: any[];
  displayListBackUp!: any[];

  constructor() { }

  ngOnInit(): void {
    this.displayListBackUp = this.OriginList.filter(this.OriginListFilterFunc || (()=>true))
    this.filteringOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentLanguage']) {
      this.filteringOptions();
    }
  }

  onModelChange(value: any) {
    this.modelChange.emit(value);
  }

  filteringOptions() {
    this.displayList = this.displayListBackUp?.filter(
      (item: any) => {
        if(item[this.OptionInnerTextProperty][this.currentLanguage].includes(this.filteringContent) || this.model == item[this.OptionValueProperty]){
          return true;
        }
        return false;
      }
    )
  }

}
