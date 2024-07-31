import {RelayoutMsgService} from '../shared.module';

export class ExpansionPanelCommon {
  expandOverStatus!: boolean[];
  timeout: any = null;

  constructor(
    private parentRelayoutMsgService: RelayoutMsgService,
    initNum: number = 0,
  ) {
    this.expandOverStatus = new Array(initNum).fill(false);
  }

  onExpandStatusChanged() {
    this.parentRelayoutMsgService.update('expand');
  }

  setExpandStatus(index: number, value: boolean) {
    this.expandOverStatus[index] = value;
  }

  getExpandStatus(index: number) {
    return this.expandOverStatus[index];
  }

  onFinishAnimation() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.parentRelayoutMsgService.update('animation');
      this.timeout = null;
    }, 50);
  }
}
