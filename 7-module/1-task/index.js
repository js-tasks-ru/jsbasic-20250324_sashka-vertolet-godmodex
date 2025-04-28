import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  elem = null;
  #SCROLL_STEP = 350;
  #categories = [
    {
      id: '',
      name: '',
    }
  ];
  #ribbonInner = null;
  #arrowRight = null;
  #arrowLeft = null;
  #menuLinks = null;
  #currentActiveCategory = '';

  constructor(categories) {
    this.#categories = categories || this.#categories;
    this.#currentActiveCategory = this.#categories.find(({ id }) => id === '')?.id || this.#currentActiveCategory;

    this.#render();
  }

  #render() {
    this.elem = createElement(this.#createTemplate());
    this.#ribbonInner = this.elem.querySelector('.ribbon__inner');
    this.#arrowLeft = this.elem.querySelector('.ribbon__arrow_left');
    this.#arrowRight = this.elem.querySelector('.ribbon__arrow_right');
    this.#menuLinks = Array.from(this.elem.querySelectorAll('.ribbon__item'));

    this.#addEventListeners();
  }

  #onMenuLinkClick = (e) => {
    e.preventDefault();

    if (e.target.classList.contains('ribbon__item_active')) {
      return;
    }

    e.target.classList.add('ribbon__item_active');
    const prevActive = this.elem.querySelector(`[data-id="${this.#currentActiveCategory}"]`);

    if (prevActive) {
      prevActive.classList.remove('ribbon__item_active');
    }

    this.#currentActiveCategory = e.target.dataset.id;

    this.elem.dispatchEvent(new CustomEvent('ribbon-select', {
      detail: this.#currentActiveCategory,
      bubbles: true,
    }));
  }

  #onRibbonScroll = () => {
    const scrollLeft = this.#ribbonInner.scrollLeft;
    const scrollWidth = this.#ribbonInner.scrollWidth;
    const clientWidth = this.#ribbonInner.clientWidth;

    const scrollRight = scrollWidth - scrollLeft - clientWidth;

    if (scrollLeft === 0) {
      this.#arrowLeft.classList.remove('ribbon__arrow_visible');
    } else {
      this.#arrowLeft.classList.add('ribbon__arrow_visible');
    }

    if (scrollRight <= 1) {
      this.#arrowRight.classList.remove('ribbon__arrow_visible');
    } else {
      this.#arrowRight.classList.add('ribbon__arrow_visible');
    }
  }

  #onArrowClick(direction) {
    switch(direction) {
      case 'left':
        this.#ribbonInner.scrollBy(-this.#SCROLL_STEP, 0);
        break;
      case 'right':
        this.#ribbonInner.scrollBy(this.#SCROLL_STEP, 0);
        break;
      default:
        console.log('Incorrect function invocation');
        break;
    }
  }

  #addEventListeners() {
    this.#arrowLeft.addEventListener('click', () => this.#onArrowClick('left'));
    this.#arrowRight.addEventListener('click', () => this.#onArrowClick('right'));
    this.#ribbonInner.addEventListener('scroll', this.#onRibbonScroll);

    this.#menuLinks.forEach((link) => {
      link.addEventListener('click', this.#onMenuLinkClick);
    });
  }

  #createRibbonItemTemplate(category) {
    return (category.id === '')
     ? `<a href="#" class="ribbon__item ribbon__item_active" data-id="${category.id}">${category.name}</a>`
     : `<a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>`
  }

  #createTemplate() {
    return `
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>

      <nav class="ribbon__inner">
        ${this.#categories.map((category) => this.#createRibbonItemTemplate(category)).join('')}
      </nav>

      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      </div>
    `
  }
}
