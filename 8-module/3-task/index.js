export default class Cart {
  #cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  #onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}

