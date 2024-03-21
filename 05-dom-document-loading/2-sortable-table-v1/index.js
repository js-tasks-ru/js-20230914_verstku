export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
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

  createBodyCells(productData) {
    return this.headerConfig
      .map(item => item.template ?
        item.template() :
        `<div class="sortable-table__cell">${productData[item.id]}</div>`)
      .join('');
  }

  createBodyRows() {
    return this.data
      .map(item => `
        <div class="sortable-table__row">
          ${this.createBodyCells(item)}
        </div>
      `)
      .join('');
  }

  createArrowNode() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;

    return wrapper.firstElementChild;
  }

  addArrowToHeaderCell(cellIndex, order) {
    const headerCells = this.subElements.header.querySelectorAll('.sortable-table__cell');
    const targetCell = headerCells[cellIndex];

    for (const cell of headerCells) {
      cell.dataset.order = '';
    }

    targetCell.dataset.order = order;
    targetCell.append(this.subElements.arrow);
  }

  get template() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeaderCells()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createBodyRows()}
        </div>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const result = {};
    const dataElements = element.querySelectorAll('[data-element]');

    for (const subElement of dataElements) {
      const nameElement = subElement.dataset.element;
      result[nameElement] = subElement;
    }

    result.arrow = this.createArrowNode();

    return result;
  }

  sort(field, order) {
    const columnIDs = this.headerConfig.map(item => item.id);
    const fieldIndex = columnIDs.indexOf(field);
    const targetColumnConfig = this.headerConfig[fieldIndex];
    const getRows = this.subElements.body.querySelectorAll('.sortable-table__row');

    this.addArrowToHeaderCell(fieldIndex, order);

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[order];

    const sortedRows = Array.from(getRows)
      .sort((rowA, rowB) => {
      const cellA = rowA.querySelectorAll('.sortable-table__cell')[fieldIndex];
      const cellB = rowB.querySelectorAll('.sortable-table__cell')[fieldIndex];

      switch (targetColumnConfig?.sortType) {
        case 'string':
          return direction * cellA.innerHTML.localeCompare(cellB.innerHTML, ['ru', 'en'], { caseFirst: 'upper' });
        case 'number':
          return direction * (cellA.innerHTML - cellB.innerHTML);
      }
    });

    this.subElements.body.append(...sortedRows);
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

