import BoundingRect from 'zrender/lib/core/BoundingRect.js';
import Axis from './Axis.js';
import { AxisBaseModel } from './AxisBaseModel.js';
interface Size {
    width: number;
    height: number;
}
interface InnerAutoLayoutCachedVal {
    maxLabelSize?: Size;
    interval: number;
    rotation: number;
}
export declare function createAxisLabels(axis: Axis): {
    labels: {
        level?: number;
        formattedLabel: string;
        rawLabel: string;
        tickValue: number;
    }[];
    rotation?: number;
    labelCategoryInterval?: number;
};
/**
 * @param {module:echats/coord/Axis} axis
 * @param {module:echarts/model/Model} tickModel For example, can be axisTick, splitLine, splitArea.
 * @return {Object} {
 *     ticks: Array.<number>
 *     tickCategoryInterval: number
 * }
 */
export declare function createAxisTicks(axis: Axis, tickModel: AxisBaseModel): {
    ticks: number[];
    tickCategoryInterval?: number;
};
/**
 * @param {module:echats/coord/Axis} axis
 *
 */
export declare function getAxisNameGap(axis: Axis): number;
/**
 * @param {module:echats/coord/Axis} axis
 * @return null/undefined if no labels.
 */
export declare function estimateLabelUnionRect(axis: Axis): BoundingRect;
/**
 * @param {module:echats/coord/Axis} axis
 * @return Axis name dimensions.
 */
export declare function estimateAxisNameSize(axis: Axis): Size;
/**
 * Calculate interval for category axis ticks and labels.
 * To get precise result, at least one of `getRotate` and `isHorizontal`
 * should be implemented in axis.
 */
export declare function calculateCategoryInterval(axis: Axis): number;
/**
 * Calculate max label dimensions, interval, and rotation for category axis ticks and labels.
 * To get precise result, at least one of `getRotate` and `isHorizontal`
 * should be implemented in axis.
 */
export declare function calculateCategoryAutoLayout(axis: Axis, interval?: number): InnerAutoLayoutCachedVal;
export {};
