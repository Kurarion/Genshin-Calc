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
  @Input('originList') originList!: any[];
  @Input('originListFilterFunc') originListFilterFunc!: ((value:any) => boolean) | undefined;
  @Input('optionIndexProperty') optionIndexProperty: string = "index";
  @Input('optionValueProperty') optionValueProperty!: string;
  @Input('optionInnerTextProperty') optionInnerTextProperty!: string;
  @Input('currentLanguage') currentLanguage!: string;
  @Input('service') service!: any;
  @Input('selectedDispalyProperty') selectedDispalyProperty!: string;
  @Input('dispalyIconWhenSelected') dispalyIconWhenSelected: boolean = false;

  filteringContent: string = "";
  displayList!: any[];
  displayListBackUp!: any[];

  constructor() { }

  ngOnInit(): void {
    this.displayListBackUp = this.originList.filter(this.originListFilterFunc || (()=>true))
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
        if(item[this.optionInnerTextProperty][this.currentLanguage].includes(this.filteringContent) || this.model == item[this.optionValueProperty]){
          return true;
        }
        return false;
      }
    )
  }

}
