
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
export function hydrate(dom, options) {
  var svgRoot = dom.querySelector('svg');
  if (!svgRoot) {
    console.error('No SVG element found in the DOM.');
    return;
  }
  var children = svgRoot.children;
  function getIndex(child, attr) {
    var index = child.getAttribute(attr);
    if (index) {
      return parseInt(index, 10);
    } else {
      return null;
    }
  }
  var events = options.on;
  if (events) {
    var _loop_1 = function (eventName) {
      if (typeof events[eventName] === 'function') {
        var _loop_2 = function (i) {
          var child = children[i];
          var type = child.getAttribute('ecmeta_ssr_type');
          var silent = child.getAttribute('ecmeta_silent') === 'true';
          if (type && !silent) {
            child.addEventListener(eventName, function (e) {
              events[eventName]({
                type: eventName,
                ssrType: type,
                seriesIndex: getIndex(child, 'ecmeta_series_index'),
                dataIndex: getIndex(child, 'ecmeta_data_index'),
                event: e
              });
            });
          }
        };
        for (var i = 0; i < children.length; i++) {
          _loop_2(i);
        }
      }
    };
    for (var eventName in events) {
      _loop_1(eventName);
    }
  }
}