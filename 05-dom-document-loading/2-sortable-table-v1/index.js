export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement();
    this.subElements = this.getSubElements(this.element);
  }

  createHeaderCells() {
    return this.headerConfig
      .map(item => `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
          <span>${item.title}</span>
        </div>
      `)
      .join('');
  }

  createBodyRows(data = []) {
    return data
      .map(item => `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.createBodyCells(item)}
        </a>
      `)
      .join('');
  }

  createBodyCells(productData) {
    return this.headerConfig
      .map(item => item.template ?
        item.template(productData[item.id]) :
        `<div class="sortable-table__cell">${productData[item.id]}</div>`)
      .join('');
  }

  get template() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeaderCells()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createBodyRows(this.data)}
        </div>
      </div>
    `;
  }

  createElement() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    return wrapper.firstElementChild;
  }

  sort(field, order) {
    const { sortType } = this.headerConfig.find(item => item.id === field);

    this.addArrowToHeaderCell(field, order);

    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    const sortData= [...this.data]
      .sort((productA, productB) => {
        const valueA = productA[field];
        const valueB = productB[field];

        switch (sortType) {
          case 'string':
            return direction * valueA.localeCompare(valueB, ['ru', 'en'], { caseFirst: 'upper' });
          case 'number':
            return direction * (valueA - valueB);
        }
      });

    this.subElements.body.innerHTML = this.createBodyRows(sortData);
  }

  addArrowToHeaderCell(cellID, order) {
    const headerCells = this.subElements.header.querySelectorAll('.sortable-table__cell');
    const targetCell = this.subElements.header.querySelector(`[data-id="${cellID}"]`);

    for (const cell of headerCells) {
      cell.dataset.order = '';
    }

    targetCell.dataset.order = order;
    targetCell.append(this.subElements.arrow);
  }

  getSubElements(element) {
    const result = {};
    const dataElements = element.querySelectorAll('[data-element]');

    for (const subElement of dataElements) {
      const nameElement = subElement.dataset.element;
      result[nameElement] = subElement;
    }

    result.arrow = this.createArrow();

    return result;
  }

  createArrow() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;

    return wrapper.firstElementChild;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

