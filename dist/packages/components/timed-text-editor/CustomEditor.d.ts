export default CustomEditor;
declare class CustomEditor extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleWordClick: (e: any) => void;
    renderBlockWithTimecodes: () => {
        component: typeof WrapperBlock;
        editable: boolean;
        props: {
            editorState: any;
            setEditorNewContentStateSpeakersUpdate: any;
            onWordClick: (e: any) => void;
            handleAnalyticsEvents: any;
        };
    };
    shouldComponentUpdate(nextProps: any): boolean;
    handleOnChange: (e: any) => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
import React from 'react';
import WrapperBlock from './WrapperBlock';
//# sourceMappingURL=CustomEditor.d.ts.map