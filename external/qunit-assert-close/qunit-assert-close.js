/**
 * Checks that the first two arguments are equal, or are numbers close enough to be considered equal
 * based on a specified maximum allowable difference.
 *
 * @example assert.close(3.141, Math.PI, 0.001);
 *
 * @param Number actual
 * @param Number expected
 * @param Number maxDifference (the maximum inclusive difference allowed between the actual and expected numbers)
 * @param String message (optional)
 */
function close(actual, expected, maxDifference, message) {
  var actualDiff = (actual === expected) ? 0 : Math.abs(actual - expected),
      result = actualDiff <= maxDifference;
  message = message || (actual + " should be within " + maxDifference + " (inclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff));
  QUnit.push(result, actual, expected, message);
}


/**
 * Checks that the first two arguments are equal, or are numbers close enough to be considered equal
 * based on a specified maximum allowable difference percentage.
 *
 * @example assert.close.percent(155, 150, 3.4);  // Difference is ~3.33%
 *
 * @param Number actual
 * @param Number expected
 * @param Number maxPercentDifference (the maximum inclusive difference percentage allowed between the actual and expected numbers)
 * @param String message (optional)
 */
close.percent = function closePercent(actual, expected, maxPercentDifference, message) {
  var actualDiff, result;
  if (actual === expected) {
    actualDiff = 0;
    result = actualDiff <= maxPercentDifference;
  }
  else if (actual !== 0 && expected !== 0 && expected !== Infinity && expected !== -Infinity) {
    actualDiff = Math.abs(100 * (actual - expected) / expected);
    result = actualDiff <= maxPercentDifference;
  }
  else {
    // Dividing by zero (0)!  Should return `false` unless the max percentage was `Infinity`
    actualDiff = Infinity;
    result = maxPercentDifference === Infinity;
  }
  message = message || (actual + " should be within " + maxPercentDifference + "% (inclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff + "%"));

  QUnit.push(result, actual, expected, message);
};


/**
 * Checks that the first two arguments are numbers with differences greater than the specified
 * minimum difference.
 *
 * @example assert.notClose(3.1, Math.PI, 0.001);
 *
 * @param Number actual
 * @param Number expected
 * @param Number minDifference (the minimum exclusive difference allowed between the actual and expected numbers)
 * @param String message (optional)
 */
function notClose(actual, expected, minDifference, message) {
  var actualDiff = Math.abs(actual - expected),
      result = actualDiff > minDifference;
  message = message || (actual + " should not be within " + minDifference + " (exclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff));
  QUnit.push(result, actual, expected, message);
}


/**
 * Checks that the first two arguments are numbers with differences greater than the specified
 * minimum difference percentage.
 *
 * @example assert.notClose.percent(156, 150, 3.5);  // Difference is 4.0%
 *
 * @param Number actual
 * @param Number expected
 * @param Number minPercentDifference (the minimum exclusive difference percentage allowed between the actual and expected numbers)
 * @param String message (optional)
 */
notClose.percent = function notClosePercent(actual, expected, minPercentDifference, message) {
  var actualDiff, result;
  if (actual === expected) {
    actualDiff = 0;
    result = actualDiff > minPercentDifference;
  }
  else if (actual !== 0 && expected !== 0 && expected !== Infinity && expected !== -Infinity) {
    actualDiff = Math.abs(100 * (actual - expected) / expected);
    result = actualDiff > minPercentDifference;
  }
  else {
    // Dividing by zero (0)!  Should only return `true` if the min percentage was `Infinity`
    actualDiff = Infinity;
    result = minPercentDifference !== Infinity;
  }
  message = message || (actual + " should not be within " + minPercentDifference + "% (exclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff + "%"));

  QUnit.push(result, actual, expected, message);
};


QUnit.extend(QUnit.assert, {
  close: close,
  notClose: notClose
});