
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
import { __assign, __spreadArray } from "tslib";
import * as zrUtil from 'zrender/lib/core/util.js';
import BoundingRect from 'zrender/lib/core/BoundingRect.js';
import { makeInner } from '../util/model.js';
import { makeLabelFormatter, getOptionCategoryInterval, shouldShowAllLabels, isNameLocationCenter } from './axisHelper.js';
import OrdinalScale from '../scale/Ordinal.js';
var RADIAN = Math.PI / 180;
var inner = makeInner();
export function createAxisLabels(axis) {
  // Only ordinal scale support tick interval
  return axis.type === 'category' ? makeCategoryLabels(axis) : makeRealNumberLabels(axis);
}
/**
 * @param {module:echats/coord/Axis} axis
 * @param {module:echarts/model/Model} tickModel For example, can be axisTick, splitLine, splitArea.
 * @return {Object} {
 *     ticks: Array.<number>
 *     tickCategoryInterval: number
 * }
 */
export function createAxisTicks(axis, tickModel) {
  // Only ordinal scale support tick interval
  return axis.type === 'category' ? makeCategoryTicks(axis, tickModel) : {
    ticks: zrUtil.map(axis.scale.getTicks(), function (tick) {
      return tick.value;
    })
  };
}
/**
 * @param {module:echats/coord/Axis} axis
 *
 */
export function getAxisNameGap(axis) {
  var _a;
  var axesModel = axis.model;
  var nameGap = (_a = axesModel.get('nameGap')) !== null && _a !== void 0 ? _a : 0;
  if (axesModel.get('nameLayout') === 'auto' && isNameLocationCenter(axis.model.get('nameLocation'))) {
    var labelUnionRect = estimateLabelUnionRect(axis);
    if (labelUnionRect) {
      var labelMargin = axesModel.get(['axisLabel', 'margin']);
      var dim = isHorizontalAxis(axis) ? 'height' : 'width';
      return labelUnionRect[dim] + labelMargin + nameGap;
    }
  }
  return nameGap;
}
function makeCategoryLabels(axis) {
  var labelModel = axis.getLabelModel();
  var result = makeCategoryLabelsActually(axis, labelModel);
  return !labelModel.get('show') || axis.scale.isBlank() ? {
    labels: [],
    labelCategoryInterval: result.labelCategoryInterval,
    rotation: 0
  } : result;
}
function makeCategoryLabelsActually(axis, labelModel) {
  var labelsCache = getListCache(axis, 'labels');
  var optionLabelInterval = getOptionCategoryInterval(labelModel);
  var result = listCacheGet(labelsCache, optionLabelInterval);
  if (result) {
    return result;
  }
  var labels;
  var layout;
  if (zrUtil.isFunction(optionLabelInterval)) {
    labels = makeLabelsByCustomizedCategoryInterval(axis, optionLabelInterval);
  } else {
    var autoInterval = optionLabelInterval === 'auto';
    layout = autoInterval || getOptionLabelAutoRotate(labelModel) ? makeAutoCategoryLayout(axis, autoInterval ? undefined : optionLabelInterval) : {
      interval: optionLabelInterval
    };
    labels = makeLabelsByNumericCategoryInterval(axis, layout.interval);
  }
  // Cache to avoid calling interval function repeatedly.
  return listCacheSet(labelsCache, optionLabelInterval, __assign({
    labels: labels
  }, layout));
}
function makeCategoryTicks(axis, tickModel) {
  var ticksCache = getListCache(axis, 'ticks');
  var optionTickInterval = getOptionCategoryInterval(tickModel);
  var result = listCacheGet(ticksCache, optionTickInterval);
  if (result) {
    return result;
  }
  var ticks;
  var tickCategoryInterval;
  // Optimize for the case that large category data and no label displayed,
  // we should not return all ticks.
  if (!tickModel.get('show') || axis.scale.isBlank()) {
    ticks = [];
  }
  if (zrUtil.isFunction(optionTickInterval)) {
    ticks = makeLabelsByCustomizedCategoryInterval(axis, optionTickInterval, true);
  }
  // Always use label interval by default despite label show. Consider this
  // scenario, Use multiple grid with the xAxis sync, and only one xAxis shows
  // labels. `splitLine` and `axisTick` should be consistent in this case.
  else if (optionTickInterval === 'auto') {
    var labelsResult = makeCategoryLabelsActually(axis, axis.getLabelModel());
    tickCategoryInterval = labelsResult.labelCategoryInterval;
    ticks = zrUtil.map(labelsResult.labels, function (labelItem) {
      return labelItem.tickValue;
    });
  } else {
    tickCategoryInterval = optionTickInterval;
    ticks = makeLabelsByNumericCategoryInterval(axis, tickCategoryInterval, true);
  }
  // Cache to avoid calling interval function repeatedly.
  return listCacheSet(ticksCache, optionTickInterval, {
    ticks: ticks,
    tickCategoryInterval: tickCategoryInterval
  });
}
function makeRealNumberLabels(axis) {
  var ticks = axis.scale.getTicks();
  var labelFormatter = makeLabelFormatter(axis);
  return {
    labels: zrUtil.map(ticks, function (tick, idx) {
      return {
        level: tick.level,
        formattedLabel: labelFormatter(tick, idx),
        rawLabel: axis.scale.getLabel(tick),
        tickValue: tick.value
      };
    }),
    rotation: 0
  };
}
function getListCache(axis, prop) {
  // Because key can be a function, and cache size always is small, we use array cache.
  return inner(axis)[prop] || (inner(axis)[prop] = []);
}
function listCacheGet(cache, key) {
  for (var i = 0; i < cache.length; i++) {
    if (cache[i].key === key) {
      return cache[i].value;
    }
  }
}
function listCacheSet(cache, key, value) {
  cache.push({
    key: key,
    value: value
  });
  return value;
}
/**
 * @param {module:echats/coord/Axis} axis
 * @return null/undefined if no labels.
 */
export function estimateLabelUnionRect(axis) {
  var _a;
  var axisModel = axis.model;
  var scale = axis.scale;
  if (!axisModel.get(['axisLabel', 'show']) || scale.isBlank()) {
    return;
  }
  var axisLabelModel = axis.getLabelModel();
  if (scale instanceof OrdinalScale) {
    // reuse category axis's cached labels info
    var _b = makeCategoryLabelsActually(axis, axisLabelModel),
      labels_1 = _b.labels,
      labelCategoryInterval = _b.labelCategoryInterval,
      rotation = _b.rotation;
    var step_1 = layoutScaleStep(labels_1.length, axisLabelModel, labelCategoryInterval);
    return getLabelUnionRect(axis, function (i) {
      return labels_1[i].formattedLabel;
    }, labels_1.length, step_1, rotation !== null && rotation !== void 0 ? rotation : 0);
  }
  var labelFormatter = makeLabelFormatter(axis);
  var realNumberScaleTicks = scale.getTicks();
  var step = layoutScaleStep(realNumberScaleTicks.length, axisLabelModel);
  return getLabelUnionRect(axis, function (i) {
    return labelFormatter(realNumberScaleTicks[i], i);
  }, realNumberScaleTicks.length, step, (_a = axisLabelModel.get('rotate')) !== null && _a !== void 0 ? _a : 0);
}
/**
 * @param {module:echats/coord/Axis} axis
 * @return Axis name dimensions.
 */
export function estimateAxisNameSize(axis) {
  var _a, _b;
  var axisModel = axis.model;
  var name = axisModel.get('name');
  if (!name) {
    return {
      width: 0,
      height: 0
    };
  }
  var textStyleModel = axisModel.getModel('nameTextStyle');
  var padding = normalizePadding((_a = textStyleModel.get('padding')) !== null && _a !== void 0 ? _a : 0);
  var nameRotate = (_b = axisModel.get('nameRotate')) !== null && _b !== void 0 ? _b : 0;
  var bounds = rotateLabel(textStyleModel.getTextRect(name), nameRotate).bounds;
  return applyPadding(bounds, padding);
}
function getLabelUnionRect(axis, getLabel, tickCount, step, rotation) {
  var cache = getListCache(axis, 'labelUnionRect');
  var key = tickCount + '_' + step + '_' + rotation + '_' + (tickCount > 0 ? getLabel(0) : '');
  var result = listCacheGet(cache, key);
  if (result) {
    return result;
  }
  return listCacheSet(cache, key, calculateLabelUnionRect(axis, getLabel, tickCount, step, rotation));
}
function calculateLabelUnionRect(axis, getLabel, tickCount, step, rotation) {
  var labelModel = axis.getLabelModel();
  var padding = getOptionLabelPadding(labelModel);
  var isHorizontal = isHorizontalAxis(axis);
  var rect;
  for (var i = 0; i < tickCount; i += step) {
    var labelRect = rotateLabelRect(labelModel.getTextRect(getLabel(i)), rotation, padding, isHorizontal);
    rect ? rect.union(labelRect) : rect = labelRect;
  }
  return rect;
}
function rotateLabelRect(originalRect, rotation, padding, isHorizontal) {
  var _a = rotateLabel(originalRect, rotation),
    bounds = _a.bounds,
    offset = _a.offset;
  var _b = applyPadding(bounds, padding),
    width = _b.width,
    height = _b.height;
  return new BoundingRect(0, 0, width - (isHorizontal ? 0 : offset.x), height - (isHorizontal ? offset.y : 0));
}
function makeAutoCategoryLayout(axis, interval) {
  var result = inner(axis).autoLayout;
  return result != null && (interval === undefined || result.interval === interval) ? result : inner(axis).autoLayout = axis.calculateCategoryAutoLayout(interval);
}
function calculateUnitDimensions(axis) {
  var rotation = getAxisRotate(axis) * RADIAN;
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var tickValue = ordinalExtent[0];
  var unitSpan = axis.dataToCoord(tickValue + 1) - axis.dataToCoord(tickValue);
  return {
    width: Math.abs(unitSpan * Math.cos(rotation)),
    height: Math.abs(unitSpan * Math.sin(rotation))
  };
}
function calculateMaxLabelDimensions(axis) {
  var labelFormatter = makeLabelFormatter(axis);
  var axisLabelModel = axis.getLabelModel();
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var step = layoutScaleStep(ordinalScale.count(), axisLabelModel);
  var maxW = 0;
  var maxH = 0;
  // Caution: Performance sensitive for large category data.
  // Consider dataZoom, we should make appropriate step to avoid O(n) loop.
  for (var tickValue = ordinalExtent[0]; tickValue <= ordinalExtent[1]; tickValue += step) {
    var label = labelFormatter({
      value: tickValue
    });
    var rect = axisLabelModel.getTextRect(label);
    // Min size, void long loop.
    maxW = Math.max(maxW, rect.width, 5);
    maxH = Math.max(maxH, rect.height, 5);
  }
  var labelPadding = getOptionLabelPadding(axisLabelModel);
  return applyPadding({
    width: maxW,
    height: maxH
  }, labelPadding);
}
/**
 * Calculate interval for category axis ticks and labels.
 * To get precise result, at least one of `getRotate` and `isHorizontal`
 * should be implemented in axis.
 */
export function calculateCategoryInterval(axis) {
  return calculateCategoryAutoLayout(axis).interval;
}
function layoutScaleStep(tickCount, labelModel, interval) {
  var _a;
  // Simple optimization for large amount of labels: trigger sparse label iteration
  // if tick count is over the threshold
  var treshhold = (_a = labelModel.get('layoutApproximationThreshold')) !== null && _a !== void 0 ? _a : 40;
  var step = Math.max((interval !== null && interval !== void 0 ? interval : 0) + 1, 1);
  return tickCount > treshhold ? Math.max(step, Math.floor(tickCount / treshhold)) : step;
}
function calculateLabelInterval(unitSize, maxLabelSize, minDistance) {
  var dw = (maxLabelSize.width + minDistance) / unitSize.width;
  var dh = (maxLabelSize.height + minDistance) / unitSize.height;
  // 0/0 is NaN, 1/0 is Infinity.
  isNaN(dw) && (dw = Infinity);
  isNaN(dh) && (dh = Infinity);
  return Math.max(0, Math.floor(Math.min(dw, dh)));
}
/**
 * Rotate label's rectangle, see https://codepen.io/agurtovoy/pen/WNPyqWx for the visualization of the math
 * below.
 *
 * @return {Object} {
 *   axesIntersection: Size, // intersection of the rotated label's rectangle with the corresponding axes
 *   bounds: Size // dimensions of the rotated label's bounding rectangle
 *   offset: PointLike // bounding rectangle's offset from the assumed rotation origin
 *  }
 */
function rotateLabel(_a, rotation) {
  var width = _a.width,
    height = _a.height;
  var rad = rotation * RADIAN;
  var sin = Math.abs(Math.sin(rad));
  var cos = Math.abs(Math.cos(rad));
  // width and height of the intersection of the rotated label's rectangle with the corresponding axes, see
  // https://math.stackexchange.com/questions/1449352/intersection-between-a-side-of-rotated-rectangle-and-axis
  var axesIntersection = {
    width: Math.min(width / cos, height / sin),
    height: Math.min(height / cos, width / sin)
  };
  // width and height of the rotated label's bounding rectangle; note th
  var bounds = {
    width: width * cos + height * sin,
    height: width * sin + height * cos
  };
  // label's bounding box's rotation origin is at the vertical center of the bbox's axis edge
  // rather than the corresponding corner point
  var asbRotation = Math.abs(rotation);
  var bboxOffset = asbRotation === 0 || asbRotation === 180 ? 0 : height / 2;
  var offset = {
    x: bboxOffset * sin,
    y: bboxOffset * cos
  };
  return {
    axesIntersection: axesIntersection,
    bounds: bounds,
    offset: offset
  };
}
function getCandidateLayouts(axis) {
  var _a;
  var unitSize = calculateUnitDimensions(axis);
  var maxLabelSize = calculateMaxLabelDimensions(axis);
  var isHorizontal = isHorizontalAxis(axis);
  var labelModel = axis.getLabelModel();
  var labelRotations = normalizeLabelRotations(getLabelRotations(labelModel), isHorizontal);
  var labelMinDistance = (_a = labelModel.get('minDistance')) !== null && _a !== void 0 ? _a : 0;
  var candidateLayouts = [];
  for (var _i = 0, labelRotations_1 = labelRotations; _i < labelRotations_1.length; _i++) {
    var rotation = labelRotations_1[_i];
    var _b = rotateLabel(maxLabelSize, rotation),
      axesIntersection = _b.axesIntersection,
      bounds = _b.bounds,
      offset = _b.offset;
    var labelSize = isHorizontal ? {
      width: axesIntersection.width,
      height: bounds.height - offset.y
    } : {
      width: bounds.width - offset.x,
      height: axesIntersection.height
    };
    var interval = calculateLabelInterval(unitSize, labelSize, labelMinDistance);
    candidateLayouts.push({
      labelSize: labelSize,
      interval: interval,
      rotation: rotation
    });
  }
  return candidateLayouts;
}
function chooseAutoLayout(candidateLayouts) {
  var autoLayout = {
    interval: Infinity,
    rotation: 0
  };
  for (var _i = 0, candidateLayouts_1 = candidateLayouts; _i < candidateLayouts_1.length; _i++) {
    var layout = candidateLayouts_1[_i];
    if (layout.interval < autoLayout.interval || layout.interval > 0 && layout.interval === autoLayout.interval) {
      autoLayout = layout;
    }
  }
  return autoLayout;
}
/**
 * Calculate max label dimensions, interval, and rotation for category axis ticks and labels.
 * To get precise result, at least one of `getRotate` and `isHorizontal`
 * should be implemented in axis.
 */
export function calculateCategoryAutoLayout(axis, interval) {
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  if (ordinalExtent[1] - ordinalExtent[0] < 1) {
    return {
      interval: 0,
      rotation: 0
    };
  }
  var candidateLayouts = getCandidateLayouts(axis);
  var autoLayout = __assign(__assign({}, chooseAutoLayout(candidateLayouts)), interval === undefined ? {} : {
    interval: interval
  });
  var axisExtent = axis.getExtent();
  var tickCount = ordinalScale.count();
  var cache = inner(axis.model);
  var lastAutoLayout = cache.lastAutoLayout;
  var lastTickCount = cache.lastTickCount;
  // Use cache to keep interval stable while moving zoom window,
  // otherwise the calculated interval might jitter when the zoom
  // window size is close to the interval-changing size.
  // For example, if all of the axis labels are `a, b, c, d, e, f, g`.
  // The jitter will cause that sometimes the displayed labels are
  // `a, d, g` (interval: 2) sometimes `a, c, e`(interval: 1).
  if (lastAutoLayout != null && lastTickCount != null && Math.abs(lastAutoLayout.interval - autoLayout.interval) <= 1 && Math.abs(lastTickCount - tickCount) <= 1
  // Always choose the bigger one, otherwise the critical
  // point is not the same when zooming in or zooming out.
  && lastAutoLayout.interval > autoLayout.interval
  // If the axis change is caused by chart resize, the cache should not
  // be used. Otherwise some hidden labels might not be shown again.
  && cache.axisExtent0 === axisExtent[0] && cache.axisExtent1 === axisExtent[1]) {
    autoLayout = lastAutoLayout;
  }
  // Only update cache if cache not used, otherwise the
  // changing of interval is too insensitive.
  else {
    cache.lastTickCount = tickCount;
    cache.lastAutoLayout = autoLayout;
    cache.axisExtent0 = axisExtent[0];
    cache.axisExtent1 = axisExtent[1];
  }
  return autoLayout;
}
function isHorizontalAxis(axis) {
  return zrUtil.isFunction(axis.isHorizontal) && axis.isHorizontal();
}
function getAxisRotate(axis) {
  return zrUtil.isFunction(axis.getRotate) ? axis.getRotate() : isHorizontalAxis(axis) ? 0 : 90;
}
function getLabelRotations(labelModel) {
  var labelRotate = labelModel.get('rotate');
  var autoRotate = labelModel.get('autoRotate');
  return labelRotate ? [labelRotate] : zrUtil.isArray(autoRotate) && autoRotate.length > 0 ? autoRotate : autoRotate ? [0, 45, 90] : [0];
}
function normalizeLabelRotations(rotations, isHorizontal) {
  // for horizontal axes, we want to iterate through the rotation angles in the ascending order
  // so that the smaller angles are considered first; conversely, for vertical axes, the larger
  // angles need to be considered first, since in that case the 0 degree rotation corresponds
  // to the smaller possible vertical label size and the largest horizontal extent.
  return __spreadArray([], rotations, true).sort(isHorizontal ? function (a, b) {
    return Math.abs(a) - Math.abs(b);
  } : function (a, b) {
    return Math.abs(b) - Math.abs(a);
  });
}
function getOptionLabelAutoRotate(labelModel) {
  var labelRotate = labelModel.get('rotate');
  var autoRotate = labelModel.get('autoRotate');
  return !labelRotate && (zrUtil.isArray(autoRotate) ? autoRotate.length > 1 : Boolean(autoRotate));
}
function getOptionLabelPadding(labelModel) {
  var _a;
  return normalizePadding((_a = labelModel.get('padding')) !== null && _a !== void 0 ? _a : 0);
}
function normalizePadding(padding) {
  return zrUtil.isArray(padding) ? padding.length === 4 ? padding : [padding[0], padding[1], padding[0], padding[1]] : [padding, padding, padding, padding];
}
function applyPadding(_a, padding) {
  var width = _a.width,
    height = _a.height;
  return {
    width: width + padding[1] + padding[3],
    height: height + padding[0] + padding[2]
  };
}
function makeLabelsByNumericCategoryInterval(axis, categoryInterval, onlyTick) {
  var labelFormatter = makeLabelFormatter(axis);
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var labelModel = axis.getLabelModel();
  var result = [];
  // TODO: axisType: ordinalTime, pick the tick from each month/day/year/...
  var step = Math.max((categoryInterval || 0) + 1, 1);
  var startTick = ordinalExtent[0];
  var tickCount = ordinalScale.count();
  // Calculate start tick based on zero if possible to keep label consistent
  // while zooming and moving while interval > 0. Otherwise the selection
  // of displayable ticks and symbols probably keep changing.
  // 3 is empirical value.
  if (startTick !== 0 && step > 1 && tickCount / step > 2) {
    startTick = Math.round(Math.ceil(startTick / step) * step);
  }
  // (1) Only add min max label here but leave overlap checking
  // to render stage, which also ensure the returned list
  // suitable for splitLine and splitArea rendering.
  // (2) Scales except category always contain min max label so
  // do not need to perform this process.
  var showAllLabel = shouldShowAllLabels(axis);
  var includeMinLabel = labelModel.get('showMinLabel') || showAllLabel;
  var includeMaxLabel = labelModel.get('showMaxLabel') || showAllLabel;
  if (includeMinLabel && startTick !== ordinalExtent[0]) {
    addItem(ordinalExtent[0]);
  }
  // Optimize: avoid generating large array by `ordinalScale.getTicks()`.
  var tickValue = startTick;
  for (; tickValue <= ordinalExtent[1]; tickValue += step) {
    addItem(tickValue);
  }
  if (includeMaxLabel && tickValue - step !== ordinalExtent[1]) {
    addItem(ordinalExtent[1]);
  }
  function addItem(tickValue) {
    var tickObj = {
      value: tickValue
    };
    result.push(onlyTick ? tickValue : {
      formattedLabel: labelFormatter(tickObj),
      rawLabel: ordinalScale.getLabel(tickObj),
      tickValue: tickValue
    });
  }
  return result;
}
function makeLabelsByCustomizedCategoryInterval(axis, categoryInterval, onlyTick) {
  var ordinalScale = axis.scale;
  var labelFormatter = makeLabelFormatter(axis);
  var result = [];
  zrUtil.each(ordinalScale.getTicks(), function (tick) {
    var rawLabel = ordinalScale.getLabel(tick);
    var tickValue = tick.value;
    if (categoryInterval(tick.value, rawLabel)) {
      result.push(onlyTick ? tickValue : {
        formattedLabel: labelFormatter(tick),
        rawLabel: rawLabel,
        tickValue: tickValue
      });
    }
  });
  return result;
}