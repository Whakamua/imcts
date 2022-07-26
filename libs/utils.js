function ArraySum(a){
    var total=0;
    for(var i in a) { 
        total += a[i];
    }
    return total;
}

function weightedChoice(array, weights) {
    let s = weights.reduce((a, e) => a + e);
    let r = Math.random() * s;
    return array.find((e, i) => (r -= weights[i]) < 0);
  }

// a custom 'sleep' or wait' function, that returns a Promise that resolves only after a timeout
function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}

function indexOfMax(arr) {
  if (arr.length === 0) {
      return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }

  return maxIndex;
}
