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
    };
    componentDidMount(): void;
    shouldComponentUpdate: (nextProps: any, nextState: any, nextContext: any) => boolean;
    componentDidUpdate: (prevProps: any, prevState: any) => void;
    handleOnClickEdit: () => void;
    handleTimecodeClick: () => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
import React from 'react';
//# sourceMappingURL=WrapperBlock.d.ts.map