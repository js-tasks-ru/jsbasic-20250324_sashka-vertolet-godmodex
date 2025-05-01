import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  #cartItems = []; // [product: {...}, count: N]
  #modal = null;
  #cartForm = null;
  #modalBody = null;

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.#addEventListeners();
  }

  addProduct(product) {
    if (!product) {
      return;
    }

    let newProduct = this.#cartItems.find(({ product: { id } }) => id === product.id);
    if (newProduct) {
      newProduct.count += 1;
    } else {
      newProduct = {
        product,
        count: 1,
      };
      this.#cartItems.push(newProduct);
    }

    this.#onProductUpdate(newProduct);
  }

  updateProductCount(productId, amount) {
    const updatedProduct = this.#cartItems.find(({ product: { id } }) => id === productId);
    updatedProduct.count += amount;
    if (updatedProduct.count === 0) {
      this.#cartItems = this.#cartItems.filter(({ product: { id } }) => id !== productId);
    }

    this.#onProductUpdate(updatedProduct);
  }

  isEmpty() {
    return this.#cartItems.length === 0;
  }

  getTotalCount() {
    return this.#cartItems.reduce((acc, { count }) => acc += count, 0);
  }

  getTotalPrice() {
    return this.#cartItems.reduce((acc, { count, product: { price } }) => {
      return acc += price * count;
    }, 0);
  }

  #renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  #renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  #renderModal() {
    this.#modal = new Modal();
    this.#modal.setTitle('Your order');
    const modalBody = document.createElement('div');

    const products = this.#cartItems
      .map(({ product, count }) => this.#renderProduct(product, count));

    products.forEach((product) => modalBody.append(product));
    modalBody.append(this.#renderOrderForm());

    this.#modal.setBody(modalBody);

    this.#modal.open();

    this.#modalBody = modalBody;
    this.#modalBody.addEventListener('click', (event) => this.#handleChangeProductQuantity(event))

    this.#cartForm = this.#modalBody.querySelector('.cart-form');
    this.#cartForm.addEventListener('submit', (event) => this.#onSubmit(event));
  }

  #handleChangeProductQuantity(event) {
    const plusButton = event.target.closest('.cart-counter__button_plus');
    const minusButton = event.target.closest('.cart-counter__button_minus');

    if (plusButton || minusButton) {
      const productId = event.target.closest('.cart-product').dataset.productId;
      const amount = plusButton ? 1 : -1;
      this.updateProductCount(productId, amount);
    }
  }

  #onProductUpdate(cartItem) {
    if (document.body.classList.contains('is-modal-open')) {
      const { product: { id: productId } } = cartItem;

      const cartProduct = this.#modalBody.querySelector(`[data-product-id="${productId}"]`);
      const productCount = this.#modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      const productPrice = this.#modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      const infoPrice = this.#modalBody.querySelector(`.cart-buttons__info-price`);

      if (cartItem.count === 0) {
        cartProduct.remove();
      } else {
        productCount.textContent = cartItem.count;
        productPrice.textContent = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      }

      infoPrice.textContent = `€${(this.getTotalPrice()).toFixed(2)}`;

      if (this.isEmpty()) {
        this.#modal.close();
      }
    }

    this.cartIcon.update(this);
  }

  #onSubmit(event) {
    event.preventDefault();
    const successOrderHtml = `
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We’ll notify you about delivery time shortly.<br>
          <img src="/assets/images/delivery.gif">
        </p>
      </div>
    `;
    const successOrderElem = createElement(successOrderHtml);
    const failedOrderHtml = `
      <div class="modal__body-inner">
        <p>
          Sorry, something went wrong... Please try again later.
        </p>
      </div>
    `;
    const failedOrderElem = createElement(failedOrderHtml);

    this.#cartForm.querySelector('button[type="submit"]').classList.add('is-loading');

    const formData = new FormData(this.#cartForm);
    const fetchPromise = fetch('https://httpbin.org/post', {
      body: formData,
      method: 'POST',
    });

    fetchPromise
      .then(() => {
        this.#modal.setTitle('Success!');
        this.#modal.setBody(successOrderElem)
        this.#cartItems = [];
        this.cartIcon.update(this);
      })
      .catch((e) => {
        console.log(e);
        this.#modal.setTitle('Something went wrong')
        this.#modal.setBody(failedOrderElem);
      })
  };

  #addEventListeners() {
    this.cartIcon.elem.onclick = () => this.#renderModal();
  }
}

