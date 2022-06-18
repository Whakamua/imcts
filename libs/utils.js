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

// function sleep(miliseconds) {
//     var currentTime = new Date().getTime();

//     while (currentTime + miliseconds >= new Date().getTime()) {
//     }
// }

// a custom 'sleep' or wait' function, that returns a Promise that resolves only after a timeout
function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}