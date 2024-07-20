import view from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
class resultsView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'no recipe found for your quary! please,try again';
  _message = '';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new resultsView();
