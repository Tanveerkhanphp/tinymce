/**
 * RangePoint.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.dom.RangePoint',
  [
    'ephox.katamari.api.Arr',
    'tinymce.core.geom.ClientRect'
  ],
  function (Arr, ClientRect) {
    var isXYWithinRange = function (clientX, clientY, range) {
      if (range.collapsed) {
        return false;
      }

      return Arr.foldl(range.getClientRects(), function (state, rect) {
        return state || ClientRect.containsXY(rect, clientX, clientY);
      }, false);
    };

    return {
      isXYWithinRange: isXYWithinRange
    };
  }
);