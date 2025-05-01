/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
import createElement from '../../assets/lib/create-element.js';

export default class UserTable {
  #rows = [
    {
      name: '',
      age: 0,
      salary: 0,
      city: '',
    }
  ];
  elem = null;

  constructor(rows) {
    this.#rows = rows || this.#rows;

    this.#render();
  }

  #onDeleteRowClick(event) {
    if (event.target.tagName === 'BUTTON') {
      event.target.closest('tr').remove();
    }
  }

  #render() {
    this.elem = createElement(this.#createTemplate());
    this.elem.addEventListener('click', (event) => this.#onDeleteRowClick(event));
  }

  #createTemplate() {
    return `
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Возраст</th>
            <th>Зарплата</th>
            <th>Город</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${this.#rows.map((row) => {
            return `
              <tr>
                <td>${row.name}</td>
                <td>${row.age}</td>
                <td>${row.salary}</td>
                <td>${row.city}</td>
                <td><button>X</button></td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `
  }
}
