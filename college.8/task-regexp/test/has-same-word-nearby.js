const test = require('tape');

const hasSameWordAdjacently = require('../src/has-same-word-adjacently');

test('hasSameWordAdjacently test whether a string has two same words next to each other', (t) => {
  t.equal(typeof hasSameWordAdjacently, 'function', 'hasSameWordAdjacently should be a function');

  const twoWordsAtStart = 'foo foo bar';
  const twoWordsAtEnd = 'foo bar bar';
  const twoWordsInMiddle = 'foo bar bar baz';

  t.equal(hasSameWordAdjacently(twoWordsAtStart), true, 'The two same words can opear at the start of a string.');
  t.equal(hasSameWordAdjacently(twoWordsAtEnd), true, 'The two same words can opear at the end of a string.');
  t.equal(hasSameWordAdjacently(twoWordsInMiddle), true, 'The two same words can opear in the middle of a string.');

  const threeSameWords = 'foo foo foo';

  t.equal(hasSameWordAdjacently(threeSameWords), true, 'It\'s ok if there are three same words in a row.');

  const noSameWords = 'foo bar baz';
  const sameWordsNotAdjacent = 'foo bar foo';

  t.equal(hasSameWordAdjacently(noSameWords), false, 'It will return false if there is no same words in a string.');
  t.equal(hasSameWordAdjacently(sameWordsNotAdjacent), false, 'It will return false if the two same words are not next to each other.');

  t.end();
});
