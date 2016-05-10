'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var marker = [{
   left: '20.8%',
   top: '56.7%',
   content: '\n         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n         <button class="item" type="button" data-price="150">Reifen</button>\n         <button class="item" type="button" data-price="50">Felge</button>\n      '
}, {
   left: '54%',
   top: '59.9%',
   content: '\n         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n         <button class="item" type="button" data-price="75">Benzinpumpe</button>\n      '
}, {
   left: '54%',
   top: '30%',
   content: '\n         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n         <button class="item" type="button" data-price="75">Wand</button>\n      '
}, {
   left: '15.1%',
   top: '19.7%',
   content: '\n         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n         <button class="item" type="button" data-price="15">Fahne</button>\n      '
}];

var template = function template(data) {
   return '\n   <div class="pin" style="left: ' + data.left + '; top: ' + data.top + ';">\n      <div class="circle"></div>\n      <div class="glow"></div>\n      <div class="more">\n         <div class="content">\n            ' + data.content + '\n         </div>\n      </div>\n   </div>\n';
};

var App = function () {
   function App() {
      _classCallCheck(this, App);

      this.amount = 0;
      this.$marker = document.querySelector('.marker');
      this.$result = document.querySelector('.result');
      this.$amount = document.querySelector('.result .amount');
      this.$items = document.querySelector('.result .items');
      this.initialize();
   }

   _createClass(App, [{
      key: 'initialize',
      value: function initialize() {
         var _this = this;

         this.$marker.innerHTML = marker.map(template).join('');

         this.$marker.addEventListener('click', function (_ref) {
            var _ref$target = _ref.target;
            var target = _ref$target === undefined ? {} : _ref$target;

            if (target.nodeName !== 'BUTTON') return; // TODO auf Classname ändern

            var name = target.innerText;
            var price = +target.dataset.price;
            _this.addProduct(name, price);
         });
      }
   }, {
      key: 'addProduct',
      value: function addProduct() {
         var name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
         var price = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

         this.amount += price;
         this.$amount.innerText = this.amount + ' €';
         this.$items.innerHTML += '<span class="item" data-price="' + price + '">' + name + '</span>';
         if (this.amount) {
            this.$result.classList.remove('hidden');
         }
      }
   }]);

   return App;
}();

jQuery(function () {
   return new App();
}); // eslint-disable-line no-new
