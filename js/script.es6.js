const marker = [{
   left: '20.8%',
   top: '56.7%',
   content: `
         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
         <button class="item" type="button" data-price="150">Reifen</button>
         <button class="item" type="button" data-price="50">Felge</button>
      `
}, {
   left: '54%',
   top: '59.9%',
   content: `
         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
         <button class="item" type="button" data-price="75">Benzinpumpe</button>
      `
}, {
   left: '54%',
   top: '30%',
   content: `
         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
         <button class="item" type="button" data-price="75">Wand</button>
      `
}, {
   left: '15.1%',
   top: '19.7%',
   content: `
         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
         <button class="item" type="button" data-price="15">Fahne</button>
      `
}];

const template = (data) => `
   <div class="pin" style="left: ${data.left}; top: ${data.top};">
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
      this.amount = 0;
      this.$marker = document.querySelector('.marker');
      this.$result = document.querySelector('.result');
      this.$amount = document.querySelector('.result .amount');
      this.$items = document.querySelector('.result .items');
      this.initialize();
   }

   initialize() {
      this.$marker.innerHTML = marker.map(template).join('');

      this.$marker.addEventListener('click', ({ target = {} }) => {
         if (target.nodeName !== 'BUTTON') return; // TODO auf Classname ändern

         const name = target.innerText;
         const price = +target.dataset.price;
         this.addProduct(name, price);
      });
   }

   addProduct(name = '', price = 0) {
      this.amount += price;
      this.$amount.innerText = `${this.amount} €`;
      this.$items.innerHTML += `<span class="item" data-price="${price}">${name}</span>`;
      if (this.amount) {
         this.$result.classList.remove('hidden');
      }
   }

}

jQuery(() => new App()); // eslint-disable-line no-new
