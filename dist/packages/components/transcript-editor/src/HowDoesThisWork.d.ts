import React from 'react';
export interface AnalyticsEvent {
    category: string;
    action: string;
    name: string;
}
export interface HowDoesThisWorkProps {
    handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
}
declare const HowDoesThisWork: React.FC<HowDoesThisWorkProps>;
export default HowDoesThisWork;
//# sourceMappingURL=HowDoesThisWork.d.ts.map