import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    //marked the selected result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmark);

    //1) load recipe

    recipeView.renderSpinner();

    await model.loadRecipe(id);
    const { recipe } = model.state;

    //2) render recipe
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //render spinner
    resultsView.renderSpinner();
    //get the data
    const quary = searchView.getQuary();
    if (!quary) return;
    console.log(quary);

    //render the data
    await model.loadSearchResults(quary);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //render initial buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render new buttons
  paginationView.render(model.state.search);
};
const controlServings = function (updateTo) {
  //updating the serving
  model.updateServings(updateTo);
  //render the serving
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // add or remove markups
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  //update recipe view
  recipeView.update(model.state.recipe);
  // render recipe in the bookmarks
  bookmarksView.render(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    //upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render the recipe
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderMessage();
    //render the bookmark
    bookmarksView.render(model.state.bookmark);
    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('😭', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('welcome to the application');
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandleraddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
