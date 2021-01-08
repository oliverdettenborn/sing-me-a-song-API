/* eslint-disable no-unneeded-ternary */
function sortCategoryOfRecomendation() {
  const category = (Math.random() > 0.3) ? 'best' : 'worst';
  return category;
}

function sortItemOfList(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

module.exports = {
  sortCategoryOfRecomendation,
  sortItemOfList,
};
