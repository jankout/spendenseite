'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global Vivus */

var markerTemplate = function markerTemplate(data) {
   return '\n   <div class="pin" id="' + (data.id || '') + '" style="left: ' + data.left + '; top: ' + data.top + ';">\n      <div class="circle"></div>\n      <div class="glow"></div>\n      <div class="more">\n         <div class="content" data-earmark="' + data.earmark + '">\n            ' + data.content + '\n         </div>\n      </div>\n   </div>\n';
};

var App = function () {
   function App() {
      var _this = this;

      _classCallCheck(this, App);

      this.$ = window.jQuery;
      this.marker = window.config.marker;
      this.items = [];
      this.amount = 0;
      this.bonusName = window.config.bonusName;

      this.$marker = this.$('.marker');
      this.$result = this.$('.result');
      this.$amount = this.$('.result .amount');
      this.$resultMore = this.$('.result .more');
      this.$items = this.$('.result .items');
      this.$infoBlock = this.$('.info-block');
      this.$infoButtons = this.$('.info-buttons');
      this.$donateButton = this.$('.donation-button');
      this.$earmark = this.$('.donation-earmark');
      this.$form = this.$('.donation-form');

      this.$amount.on('keyup change', this.handleAmountChange.bind(this));
      this.$marker.on('click', '.item', this.handleAddition.bind(this));
      this.$items.on('click', '.item', this.handleRemoval.bind(this));
      this.$form.on('submit', this.beforeSubmit.bind(this));
      this.$infoButtons.on('click', '[data-view]', function (event) {
         event.preventDefault();
         _this.changeInfobox(event.currentTarget.dataset.view);
      });

      this.changeInfobox(0);
      this.startIntro();
   }

   _createClass(App, [{
      key: 'startIntro',
      value: function startIntro() {
         var _this2 = this;

         this.runSVGAnimation('svg-lkw', function () {
            var htmlItems = _this2.marker.map(markerTemplate);
            _this2.$marker.html(htmlItems.join(''));
            var firstPin = _this2.$('.pin .more').first();
            _this2.animate(firstPin, 'glimpse');
         });
      }
   }, {
      key: 'render',
      value: function render() {
         this.$amount.val(this.amount);
         this.renderItems();
      }
   }, {
      key: 'beforeSubmit',
      value: function beforeSubmit(event) {
         var counts = {};
         this.items.forEach(function (item) {
            counts[item.earmark] = (counts[item.earmark] || 0) + item.price;
         });
         var earmark = Object.keys(counts).sort(function (a, b) {
            return counts[b] - counts[a];
         })[0];
         this.$earmark.val(earmark || '');
      }
   }, {
      key: 'changeInfobox',
      value: function changeInfobox(view) {
         this.$infoBlock.attr('data-view', view).find('.view').hide().eq(view).show();
      }
   }, {
      key: 'handleAmountChange',
      value: function handleAmountChange() {
         this.amount = +this.$amount.val();
         this.renderItems();
      }
   }, {
      key: 'handleAddition',
      value: function handleAddition(_ref) {
         var _ref$currentTarget = _ref.currentTarget;
         var currentTarget = _ref$currentTarget === undefined ? {} : _ref$currentTarget;

         var name = currentTarget.innerText;
         var price = +currentTarget.dataset.price;
         var earmark = currentTarget.parentElement.dataset.earmark;
         this.addProduct({ name: name, price: price, earmark: earmark });
      }
   }, {
      key: 'handleRemoval',
      value: function handleRemoval(_ref2) {
         var _ref2$currentTarget = _ref2.currentTarget;
         var currentTarget = _ref2$currentTarget === undefined ? {} : _ref2$currentTarget;

         var name = currentTarget.innerText;
         var price = +currentTarget.dataset.price;
         this.removeProduct({ name: name, price: price });
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
      key: 'removeProduct',
      value: function removeProduct(_ref3) {
         var name = _ref3.name;
         var price = _ref3.price;

         this.amount -= price;
         var index = this.items.map(function (item) {
            return item.name;
         }).indexOf(name);
         this.items.splice(index, 1);
         this.render();
      }
   }, {
      key: 'renderItems',
      value: function renderItems() {
         var _this3 = this;

         var items = [].concat(_toConsumableArray(this.items));
         var hasItems = !(this.amount > 0 || items.length);
         var targetValue = this.calculateAmount();
         var actualValue = this.$amount.val();
         var itemTemplate = function itemTemplate(item) {
            return '<div class="item" data-price="' + item.price + '"><span class="name">' + item.name + '</span></div>';
         };

         this.$resultMore.toggleClass('hidden', hasItems);
         this.$donateButton.attr('disabled', hasItems);

         if (items.length && actualValue < targetValue) {
            var _ret = function () {
               var partlyOff = function partlyOff(item) {
                  return '<div class="item"><span class="name">' + item.name + '</span>\n                                       <div class="price">' + item.newPrice + '&nbsp;€ <span class="strike">' + item.price + '&nbsp;€</span></div>\n                                    </div>';
               };
               var fullyOff = function fullyOff(item) {
                  return '<div class="item strike"><span class="name">' + item.name + '</span><span data-price="' + item.price + '"></span></div>';
               };

               var html = items.map(function (item) {
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
               _this3.$items.html(html);
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
         var html = items.length ? itemsHtml : '';
         this.$items.html(html);
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
         var _this4 = this;

         var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
         var callback = arguments.length <= 1 || arguments[1] === undefined ? this.$.noop : arguments[1];

         var settings = window.config.vivusSettings;
         settings.onReady = function () {
            return _this4.$('#' + id).css('opacity', 1);
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