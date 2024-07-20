class searchView {
  _parentElement = document.querySelector('.search');
  getQuary() {
    const quary = this._parentElement.querySelector('.search__field').value;
    this._clear();
    return quary;
  }
  _clear() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new searchView();
