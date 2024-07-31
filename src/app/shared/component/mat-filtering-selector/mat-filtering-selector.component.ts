import {CdkVirtualScrollViewport, ScrollDispatcher} from '@angular/cdk/scrolling';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {TYPE_SYS_LANG} from 'src/app/shared/shared.module';

@Component({
  selector: 'app-mat-filtering-selector',
  templateUrl: './mat-filtering-selector.component.html',
  styleUrls: ['./mat-filtering-selector.component.css'],
})
export class MatFilteringSelectorComponent implements OnInit, OnChanges {
  readonly INDEX_SPLIT = '/';

  @Input('title') title!: string;
  @Input('model') model!: any;
  @Input('hasBlankOption') hasBlankOption: boolean = false;
  @Output() modelChange = new EventEmitter<any>();
  @Input('originList') originList!: any[];
  @Input('originListFilterFunc') originListFilterFunc!: ((value: any) => boolean) | undefined;
  @Input('optionIndexProperty') optionIndexProperty: string = 'index';
  @Input('optionValueProperty') optionValueProperty!: string;
  @Input('optionInnerTextProperty') optionInnerTextProperty!: string;
  @Input('currentLanguage') currentLanguage!: TYPE_SYS_LANG;
  @Input('service') service!: any;
  @Input('selectedDispalyProperty') selectedDispalyProperty!: string;
  @Input('selectedDispalyIcon') selectedDispalyIcon: boolean = false;
  @Input('dispalyIconWhenSelected') dispalyIconWhenSelected: boolean = false;
  @Input('listenLoadEvent') listenLoadEvent: boolean = false;
  @Input('isCharaInfo') isCharaInfo: boolean = false;

  @ViewChild(CdkVirtualScrollViewport, {static: true})
  cdkVirtualScrollViewPort!: CdkVirtualScrollViewport;

  filteringContent: string = '';
  displayList!: any[];
  displayListBackUp!: any[];

  initIndex: number = 0;
  selected!: string;

  notShowInitIndex!: string;
  notShowInitItem!: any;

  constructor() {}

  ngOnInit(): void {
    this.displayListBackUp = this.originList.filter(this.originListFilterFunc || (() => true));
    this.filteringOptions(true);
    this.selected = this.model + this.INDEX_SPLIT + this.initIndex;
    this.notShowInitIndex = this.selected;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentLanguage']) {
      this.filteringOptions();
    }
    if (changes['model']) {
      if (this.displayList) {
        for (let i = 0; i < this.displayList.length; ++i) {
          if (this.displayList[i][this.optionValueProperty] == this.model) {
            this.initIndex = i;
          }
        }
        if (this.model != '') {
          this.selected = this.model + this.INDEX_SPLIT + this.initIndex;
          this.notShowInitIndex = this.selected;
          this.notShowInitItem = this.displayList[this.initIndex];
        } else {
          this.selected = '/0';
          this.notShowInitIndex = '';
          this.notShowInitItem = this.displayList[0];
        }
      }
    }
  }

  onModelChange(value: any) {
    let vals = value.split(this.INDEX_SPLIT);
    this.modelChange.emit(vals[0]);
    this.notShowInitIndex = value;
    this.notShowInitItem = this.displayList[vals[1]];
    this.selected = value;
  }

  filteringOptions(isInit: boolean = false) {
    let currentIndex = 0;
    let filterTargetLowercase = this.filteringContent.toLowerCase();
    this.displayList = this.displayListBackUp?.filter((item: any, index: number) => {
      if (item[this.optionValueProperty] == this.model) {
        if (isInit) {
          this.initIndex = index;
          this.notShowInitItem = item;
        } else {
          currentIndex = index;
        }
      }
      // if(item[this.optionInnerTextProperty][this.currentLanguage].includes(this.filteringContent) || this.model == item[this.optionValueProperty]){
      if (
        item[this.optionInnerTextProperty][this.currentLanguage]
          .toLowerCase()
          .includes(filterTargetLowercase)
      ) {
        return true;
      }
      return false;
    });

    if (!isInit) {
      this.cdkVirtualScrollViewPort.scrollToIndex(currentIndex, 'smooth');
    }
  }

  openChange($event: boolean) {
    if ($event) {
      let toIndex = 0;
      if (this.selected != '') {
        toIndex = +this.selected.split(this.INDEX_SPLIT)[1];
      }
      this.cdkVirtualScrollViewPort.scrollToIndex(toIndex, 'smooth');
      this.cdkVirtualScrollViewPort.checkViewportSize();
    }
  }
}
