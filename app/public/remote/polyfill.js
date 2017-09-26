"use strict";
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;
  
      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
   };
}

if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }
    var n, k,
      t = Object(this),
      len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    n = len - 1;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) {
        n = 0;
      }
      else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

if (!Array.prototype.findLastIndexOf) {
  Array.prototype.findLastIndexOf = function(searchFn /*, fromIndex*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }
    var n, k,
      t = Object(this),
      len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    n = len - 1;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) {
        n = 0;
      }
      else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
      if (k in t && searchFn(t[k])) {
        return k;
      }
    }
    return -1;
  };
}


if(!String.prototype.replaceAll){
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };
}

if(!String.prototype.regReplaceAll){
  String.prototype.regReplaceAll = function(pattern, replacement) {
    var target = this;
    return target.replace(pattern, replacement);
  };
}
if(!String.prototype.regSelect){
  String.prototype.regSelectAll = function(pattern, replacement) {
    var target = this;
    var match=target.match(pattern, replacement);
    return match?match.join(""):"";
  };
}
if(!String.prototype.replaceNbsps){
  String.prototype.replaceNbsps = function (){
    var str = this;
    var re = new RegExp(String.fromCharCode(160), "g");
    return str.replace(re, " ");
  }
};


// Overwrites native 'children' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
;(function(constructor) {
  if (constructor &&
      constructor.prototype &&
      constructor.prototype.children == null) {
      Object.defineProperty(constructor.prototype, 'children', {
          get: function() {
              var i = 0, node, nodes = this.childNodes, children = [];
              while (node = nodes[i++]) {
                  if (node.nodeType === 1) {
                      children.push(node);
                  }
              }
              return children;
          }
      });
  }
})(window.Node || window.Element);

var isFunction=function(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}