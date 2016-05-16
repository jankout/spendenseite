'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global Vivus */

var markerTemplate = function markerTemplate(data) {
   return '\n   <div class="pin" id="' + (data.id || '') + '" style="left: ' + data.left + '; top: ' + data.top + ';">\n      <div class="circle"></div>\n      <div class="glow"></div>\n      <div class="more">\n         <div class="content">\n            ' + data.content + '\n         </div>\n      </div>\n   </div>\n';
};

var App = function () {
   function App() {
      _classCallCheck(this, App);

      this.$ = window.jQuery;
      this.marker = window.config.marker;
      this.items = [];
      this.amount = 0;
      this.bonusName = window.config.bonusName;

      this.$marker = this.$('.marker');
      this.$result = this.$('.result');
      this.$amount = this.$('.result .amount');
      this.$resultInfo = this.$('.result .more');

      this.runSVGAnimation('svg-lkw', this.initialize.bind(this));
   }

   _createClass(App, [{
      key: 'initialize',
      value: function initialize() {
         var _this = this;

         var htmlItems = this.marker.map(markerTemplate);
         this.$marker.html(htmlItems[0]);

         var firstPin = this.$('.pin .more').first();
         var callback = function callback() {
            return _this.$marker.html(htmlItems.join(''));
         };
         this.animate(firstPin, 'glimpse', callback);

         this.$amount.on('keyup', this.handleAmountChange.bind(this));
         this.$marker.on('click', 'button', this.handleItemAddition.bind(this));
      }
   }, {
      key: 'render',
      value: function render() {
         this.$amount.val(this.amount);
         this.renderItems();
      }
   }, {
      key: 'handleAmountChange',
      value: function handleAmountChange() {
         this.amount = +this.$amount.val();
         this.renderItems();
      }
   }, {
      key: 'handleItemAddition',
      value: function handleItemAddition(_ref) {
         var _ref$target = _ref.target;
         var target = _ref$target === undefined ? {} : _ref$target;

         var name = target.innerText;
         var price = +target.dataset.price;
         this.addProduct({ name: name, price: price });
      }
   }, {
      key: 'addProduct',
      value: function addProduct(item) {
         this.amount += item.price;
         this.items = [].concat(_toConsumableArray(this.items), [item]).sort(function (a, b) {
            return a.price - b.price;
         });
         this.render();
         this.animate(this.$result, 'grow');
      }
   }, {
      key: 'renderItems',
      value: function renderItems() {
         var _this2 = this;

         var items = [].concat(_toConsumableArray(this.items));
         var targetValue = this.calculateAmount();
         var actualValue = this.$amount.val();
         var listTemplate = function listTemplate(content) {
            return '<div class="items content">' + content + '</div>';
         };
         var itemTemplate = function itemTemplate(item) {
            return '<div class="item" data-price="' + item.price + '">' + item.name + '</div>';
         };

         if (items.length && actualValue < targetValue) {
            var _ret = function () {
               var partlyOff = function partlyOff(item) {
                  return '<div class="item">' + item.name + '\n                                         <div class="pull-right"> ' + item.newPrice + ' €\n                                            <span class="strike">' + item.price + ' €</span>\n                                         </div>\n                                      </div>';
               };
               var fullyOff = function fullyOff(item) {
                  return '<div class="item strike"><span data-price="' + item.price + '">' + item.name + '</span></div>';
               };

               var itemHTML = items.map(function (item) {
                  var difference = targetValue - actualValue;

                  if (!difference) {
                     return itemTemplate(item); // normal
                  }

                  if (difference < item.price) {
                     // partly off
                     targetValue -= difference;
                     item.newPrice = item.price - difference; // eslint-disable-line no-param-reassign
                     return partlyOff(item);
                  }

                  targetValue -= item.price;
                  return fullyOff(item); // fully off
               }).join('');
               _this2.$resultInfo.html(listTemplate(itemHTML));
               return {
                  v: void 0
               };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
         }

         if (actualValue > targetValue) {
            items.push({
               name: this.bonusName,
               price: actualValue - targetValue
            });
         }

         var itemsHtml = items.map(itemTemplate).join('');
         var html = items.length ? listTemplate(itemsHtml) : '';
         this.$resultInfo.html(html);
      }
   }, {
      key: 'calculateAmount',
      value: function calculateAmount() {
         return this.items.map(function (item) {
            return item.price;
         }).reduce(function (sum, price) {
            return sum + price;
         }, 0);
      }
   }, {
      key: 'animate',
      value: function animate($element, className) {
         var callback = arguments.length <= 2 || arguments[2] === undefined ? this.$.noop : arguments[2];

         $element.addClass(className);
         $element.one('animationend', function () {
            $element.removeClass(className);
            callback();
         });
      }
   }, {
      key: 'runSVGAnimation',
      value: function runSVGAnimation() {
         var _this3 = this;

         var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
         var callback = arguments.length <= 1 || arguments[1] === undefined ? this.$.noop : arguments[1];

         var settings = window.config.vivusSettings;
         settings.onReady = function () {
            return _this3.$('#' + id).css('opacity', 1);
         };
         this.vivus = new Vivus(id, settings, callback);
      }
   }]);

   return App;
}();

$(function () {
   return window.app = new App();
}); // eslint-disable-line no-new, no-return-assign
//# sourceMappingURL=script.js.map