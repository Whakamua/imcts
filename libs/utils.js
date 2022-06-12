function ArraySum(a){
    var total=0;
    for(var i in a) { 
        total += a[i];
    }
    return total;
}