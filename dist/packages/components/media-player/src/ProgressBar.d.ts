export default ProgressBar;
declare class ProgressBar extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    shouldComponentUpdate: (nextProps: any) => boolean;
    handleOnChange: (e: any) => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
declare namespace ProgressBar {
    namespace propTypes {
        let value: any;
        let max: any;
        let buttonClick: any;
    }
    namespace defaultProps {
        let value_1: string;
        export { value_1 as value };
        let max_1: string;
        export { max_1 as max };
    }
}
import React from 'react';
//# sourceMappingURL=ProgressBar.d.ts.map