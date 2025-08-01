export default WrapperBlock;
declare class WrapperBlock extends React.Component<any, any, any> {
    constructor(props: any);
    state: {
        speaker: string;
        start: number;
        timecodeOffset: any;
    };
    componentDidMount(): void;
    shouldComponentUpdate: (nextProps: any, nextState: any) => boolean;
    componentDidUpdate: (prevProps: any, prevState: any) => true | undefined;
    handleOnClickEdit: () => void;
    handleTimecodeClick: () => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
import React from 'react';
//# sourceMappingURL=WrapperBlock.d.ts.map