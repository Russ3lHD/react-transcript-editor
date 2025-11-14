export default WrapperBlock;
declare class WrapperBlock extends React.Component<any, any, any> {
    static contextType: React.Context<{
        showSpeakers: boolean;
        showTimecodes: boolean;
        timecodeOffset: number;
        isEditable: boolean;
    }>;
    constructor(props: any);
    state: {
        speaker: string;
        start: number;
        isEditing: boolean;
        tempSpeaker: string;
        uniqueSpeakers: never[];
        actionType: null;
    };
    componentDidMount(): void;
    shouldComponentUpdate: (nextProps: any, nextState: any, nextContext: any) => boolean;
    componentDidUpdate: (prevProps: any, _prevState: any) => void;
    componentWillUnmount(): void;
    onEditingEvent: (ev: any) => void;
    getOtherSpeakers: () => any[];
    handleStartEditing: () => void;
    handleChangeTempSpeaker: (e: any) => void;
    handleKeyDown: (_e: any) => void;
    handleSwitchSegment: (newSpeakerName: any) => void;
    handleRenameAll: () => void;
    handleOptionSelect: (e: any) => void;
    applySegmentScope: () => void;
    applyGlobalScope: () => void;
    handleTimecodeClick: () => void;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=WrapperBlock.d.ts.map