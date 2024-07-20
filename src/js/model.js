import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    quary: '',
    results: [],
    resultPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmark: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmark.some(recp => recp.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err}🤔`);
    throw err;
  }
};

export const loadSearchResults = async function (quary) {
  try {
    state.search.quary = quary;
    const data = await AJAX(`${API_URL}?search=${quary}&key=${KEY}`);
    const { recipes } = data.data;
    console.log(recipes);
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,

        image: rec.image_url,

        publisher: rec.publisher,

        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}🤔`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  //add recipe to the bookmark
  state.bookmark.push(recipe);
  //
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};
export const deleteBookmark = function (id) {
  //delete recipe from boookmarm
  const recp = state.bookmark.findIndex(bookmark => bookmark.id === id);

  state.bookmark.splice(recp, 1);

  //
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map(entry => {
        const ingArr = entry[1].split(',').map(el => el.trim());
        //  entry[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format , please use the correct format '
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);
    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
