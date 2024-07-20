import icons from 'url:../../img/icons.svg';
export default class view {
  _data;

  /**
   * render the recieved object to the dom
   * @param {Object|Object[]} data  the data to bre rendered (e.g recipe)
   * @param {boolean} [render=true]  if false creates markup string instead of rendering to the dom
   * @returns {undefined|string} a markup string id rendered if the render =false
   * @this {Object} view instence
   * @author ahmed sabry
   * @todo finish the implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //updated changed text

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('🥰', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      //updated changed attributes
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes);
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  renderSpinner() {
    const markup = `<div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(errorMessage = this._errorMessage) {
    const markup = `<div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${errorMessage}</p>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
