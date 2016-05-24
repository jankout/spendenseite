/* global Vivus */

const markerTemplate = (data) => `
   <div class="pin" id="${data.id || ''}" style="left: ${data.left}; top: ${data.top};">
      <div class="circle"></div>
      <div class="glow"></div>
      <div class="more">
         <div class="content" data-earmark="${data.earmark}">
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
      this.$infoButtons.on('click', '[data-view]', (event) => {
         event.preventDefault();
         this.changeInfobox(event.currentTarget.dataset.view);
      });

      this.changeInfobox(0);
      this.startIntro();
   }

   startIntro() {
      const id = 'svg-lkw';
      const onReady = () => { this.$(`#${id}`).css('opacity', 1); };
      const callback = () => {
         const htmlItems = this.marker.map(markerTemplate);
         this.$marker.html(htmlItems.join(''));
         const firstPin = this.$('.pin .more').first();
         this.animate(firstPin, 'glimpse');
      };

      if (/^((?!chrome).)*safari/i.test(window.navigator.userAgent)) {
         onReady();
         callback();
      }
      else {
         this.runSVGAnimation(id, onReady, callback);
      }
   }

   render() {
      this.$amount.val(this.amount);
      this.renderItems();
   }

   beforeSubmit(event) {
      const counts = {};
      this.items.forEach((item) => { counts[item.earmark] = (counts[item.earmark] || 0) + item.price; });
      const earmark = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
      this.$earmark.val(earmark || '');
   }

   changeInfobox(view) {
      this.$infoBlock
         .attr('data-view', view)
         .find('.view').hide()
         .eq(view).show();
   }

   handleAmountChange() {
      this.amount = +this.$amount.val();
      this.renderItems();
   }

   handleAddition({ currentTarget = {} }) {
      const name = currentTarget.innerText;
      const price = +currentTarget.dataset.price;
      const earmark = currentTarget.parentElement.dataset.earmark;
      this.addProduct({ name, price, earmark });
   }

   handleRemoval({ currentTarget = {} }) {
      const name = currentTarget.innerText;
      const price = +currentTarget.dataset.price;
      this.removeProduct({ name, price });
   }

   addProduct(item) {
      this.amount += item.price;
      this.items = [...this.items, item].sort((a, b) => a.price - b.price);
      this.render();
      this.animate(this.$result, 'grow');
   }

   removeProduct({ name, price }) {
      this.amount -= price;
      const index = this.items.map(item => item.name).indexOf(name);
      this.items.splice(index, 1);
      this.render();
   }

   renderItems() {
      let items = [...this.items];
      let hasItems = !(this.amount > 0 || items.length);
      let targetValue = this.calculateAmount();
      let actualValue = this.$amount.val();
      let itemTemplate = (item) => `<div class="item" data-price="${item.price}"><span class="name">${item.name}</span></div>`;

      this.$resultMore.toggleClass('hidden', hasItems);
      this.$donateButton.attr('disabled', hasItems);

      if (items.length && actualValue < targetValue) {
         let partlyOff = (item) => `<div class="item"><span class="name">${item.name}</span>
                                       <div class="price">${item.newPrice}&nbsp;€ <span class="strike">${item.price}&nbsp;€</span></div>
                                    </div>`;
         let fullyOff = (item) => `<div class="item strike"><span class="name">${item.name}</span><span data-price="${item.price}"></span></div>`;

         let html = items.map((item) => {
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
         this.$items.html(html);
         return;
      }

      if (actualValue > targetValue) {
         items.push({
            name: this.bonusName,
            price: actualValue - targetValue,
         });
      }

      let itemsHtml = items.map(itemTemplate).join('');
      let html = items.length ? itemsHtml : '';
      this.$items.html(html);
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

   runSVGAnimation(id = '', onReady = this.$.noop, callback = this.$.noop) {
      const settings = window.config.vivusSettings;
      settings.onReady = onReady;
      this.vivus = new Vivus(id, settings, callback);
   }

}

$(() => window.app = new App()); // eslint-disable-line no-new, no-return-assign
