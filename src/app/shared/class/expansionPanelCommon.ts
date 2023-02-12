import { RelayoutMsgService } from "../shared.module";

export class ExpansionPanelCommon{

    expandOverStatus!: boolean[];

    constructor(private parentRelayoutMsgService: RelayoutMsgService, initNum: number = 0){
        this.expandOverStatus = new Array(initNum).fill(false);
    }

    onExpandStatusChanged(){
        this.parentRelayoutMsgService.update("expand");
    }

    setExpandStatus(index: number, value: boolean){
        this.expandOverStatus[index] = value;
    }

    getExpandStatus(index: number){
        return this.expandOverStatus[index]
    }
}