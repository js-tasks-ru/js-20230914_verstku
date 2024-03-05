export default class NotificationMessage {
  static currentNotification = null;

  constructor(msg = '', {
    duration = 0,
    type = ''
  } = {}) {
    this.msg = msg;
    this.duration = duration;
    this.type = type;

    this.element = this.createNotification();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.msg}
          </div>
        </div>
      </div>
    `;
  }

  createNotification() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    return wrapper.firstElementChild;
  }

  show(nodeContainer = document.body) {
    if (this.constructor.currentNotification) {
      this.constructor.currentNotification.remove();

    }

    this.constructor.currentNotification =  this.element;

    nodeContainer.append(this.element);
    setTimeout(() => this.destroy(), this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
