import { RelayoutMsgService } from "../shared.module";

export class ExpansionPanelCommon{

    constructor(private parentRelayoutMsgService: RelayoutMsgService){ }

    onExpandStatusChanged(){
        this.parentRelayoutMsgService.update("expand");
    }
}