export default PlayerControls;
declare class PlayerControls extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    shouldComponentUpdate: (nextProps: any) => boolean;
    setIntervalHelperBackward: () => void;
    interval: NodeJS.Timeout | undefined;
    setIntervalHelperForward: () => void;
    clearIntervalHelper: () => void;
    render(): React.JSX.Element;
}
declare namespace PlayerControls {
    namespace propTypes {
        let playMedia: any;
        let currentTime: any;
        let timecodeOffset: any;
        let promptSetCurrentTime: any;
        let rollback: any;
        let handleMuteVolume: any;
        let duration: any;
        let isPlaying: any;
        let isMute: any;
        let skipBackward: any;
        let skipForward: any;
        let playbackRate: any;
        let playbackRateOptions: any;
        let setPlayBackRate: any;
        let pictureInPicture: any;
    }
}
import React from 'react';
//# sourceMappingURL=index.d.ts.map