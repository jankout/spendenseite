/* global Vivus */

const markerTemplate = (data) => `
   <div class="pin" id="${data.id || ''}" style="left: ${data.left}; top: ${data.top};">
      <div class="circle"></div>
      <div class="glow"></div>
      <div class="more">
         <div class="content">
            ${data.content}
         </div>
      </div>
   </div>
`;

class App {

   constructor() {
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

   initialize() {
      const htmlItems = this.marker.map(markerTemplate);
      this.$marker.html(htmlItems[0]);

      const firstPin = this.$('.pin .more').first();
      const callback = () => this.$marker.html(htmlItems.join(''));
      this.animate(firstPin, 'glimpse', callback);

      this.$amount.on('keyup', this.handleAmountChange.bind(this));
      this.$marker.on('click', 'button', this.handleItemAddition.bind(this));
   }

   render() {
      this.$amount.val(this.amount);
      this.renderItems();
   }

   handleAmountChange() {
      this.amount = +this.$amount.val();
      this.renderItems();
   }

   handleItemAddition({ target = {} }) {
      const name = target.innerText;
      const price = +target.dataset.price;
      this.addProduct({ name, price });
   }

   addProduct(item) {
      this.amount += item.price;
      this.items = [...this.items, item].sort((a, b) => a.price - b.price);
      this.render();
      this.animate(this.$result, 'grow');
   }

   renderItems() {
      let items = [...this.items];
      let targetValue = this.calculateAmount();
      let actualValue = this.$amount.val();
      let listTemplate = (content) => `<div class="items content">${content}</div>`;
      let itemTemplate = (item) => `<div class="item" data-price="${item.price}">${item.name}</div>`;

      if (items.length && actualValue < targetValue) {
         let partlyOff = (item) => `<div class="item">${item.name}
                                         <div class="pull-right"> ${item.newPrice} €
                                            <span class="strike">${item.price} €</span>
                                         </div>
                                      </div>`;
         let fullyOff = (item) => `<div class="item strike"><span data-price="${item.price}">${item.name}</span></div>`;

         let itemHTML = items.map((item) => {
            let difference = targetValue - actualValue;

            if (!difference) {
               return itemTemplate(item); // normal
            }

            if (difference < item.price) { // partly off
               targetValue -= difference;
               item.newPrice = item.price - difference; // eslint-disable-line no-param-reassign
               return partlyOff(item);
            }

            targetValue -= item.price;
            return fullyOff(item); // fully off
         }).join('');
         this.$resultInfo.html(listTemplate(itemHTML));
         return;
      }

      if (actualValue > targetValue) {
         items.push({
            name: this.bonusName,
            price: actualValue - targetValue,
         });
      }

      let itemsHtml = items.map(itemTemplate).join('');
      let html = items.length ? listTemplate(itemsHtml) : '';
      this.$resultInfo.html(html);
   }

   calculateAmount() {
      return this.items
         .map(item => item.price)
         .reduce((sum, price) => sum + price, 0);
   }

   animate($element, className, callback = this.$.noop) {
      $element.addClass(className);
      $element.one('animationend', () => {
         $element.removeClass(className);
         callback();
      });
   }

   runSVGAnimation(id = '', callback = this.$.noop) {
      const settings = window.config.vivusSettings;
      settings.onReady = () => this.$(`#${id}`).css('opacity', 1);
      this.vivus = new Vivus(id, settings, callback);
   }

}

$(() => window.app = new App()); // eslint-disable-line no-new, no-return-assign
