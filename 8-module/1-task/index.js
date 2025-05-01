import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  #initialTopCoord = null;

  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    if (!this.elem.offsetWidth || !this.elem.classList.contains('cart-icon_visible')) {
      return;
    }

    const isMobile = document.documentElement.clientWidth <= 767;
    if (isMobile) {
      Object.assign(this.elem.style, {
        position: '',
        top: '',
        left: '',
        zIndex: ''
      });

      return;
    }

    if (!this.#initialTopCoord) {
      this.#initialTopCoord = this.elem.getBoundingClientRect().top + window.scrollY;
     }

    const container = document.querySelector('.container');

    const spaceFromContainer = container.getBoundingClientRect().right + 20;
    const spaceFromRightClientSide = document.documentElement.clientWidth - this.elem.offsetWidth - 10;

    const leftIndent = `${Math.min(spaceFromContainer, spaceFromRightClientSide)}px`;

    if (window.scrollY > this.#initialTopCoord) {
      Object.assign(this.elem.style, {
        position: 'fixed',
        top: '50px',
        zIndex: 1e3,
        left: leftIndent,
      })
    } else {
      Object.assign(this.elem.style, {
        position: '',
        top: '',
        left: '',
        zIndex: ''
      });
    }
  }
}
