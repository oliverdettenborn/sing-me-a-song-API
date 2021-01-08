/* eslint-disable no-undef */
const { sortCategoryOfRecomendation, sortItemOfList } = require('../../src/utils/random');

describe('Sort Random Category', () => {
  it('should return best or worst (70/30) ', () => {
    const result = sortCategoryOfRecomendation();
    expect(result).toEqual('best' || 'worst');
  });
});

describe('Sort Random Item of Recomendation List', () => {
  it('should return a random item of list', () => {
    const list = ['Music 1', 'Music 2', 'Music 3', 'Music 3', 'Music 3', 'Music 4'];
    const music = sortItemOfList(list);
    expect(list).toContain(music);
  });
});
