export default TimecodeOffset;
declare class TimecodeOffset extends React.Component<any, any, any> {
    constructor(props: any);
    state: {
        timecodeOffset: string;
    };
    handleChange: (e: any) => void;
    resetTimecodeOffset: () => void;
    setTimecodeOffset: () => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
declare namespace TimecodeOffset {
    namespace propTypes {
        let handleSetTimecodeOffset: any;
        let onChange: any;
        let timecodeOffset: any;
        let handleAnalyticsEvents: any;
    }
}
import React from 'react';
//# sourceMappingURL=index.d.ts.map