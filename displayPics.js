//uniqueArray is where you will store the unique numbers that displayPics() creates in the while loops.
//productArray will be wherever you are pushing your new instances to, so make changes as needed.
//you will also need to change the variable name of makeRandomNumber to your own function's name.

var uniqueArray = [];

function displayPics() {
  //keeps the array filled with 6 unique values
  while(uniqueArray.length < 6) {
    var random = makeRandomNumber();
    while(!uniqueArray.includes(random)) {
      console.log('building uniqueArray:  ', uniqueArray);
      uniqueArray.push(random);
    }
  }
  console.log('uniqueArray completed!!: ', uniqueArray);
  for( var i = 0; i < uniqueArray.length; i++ ) {
  //value of the first index of the array is removed and set as the variable 'temp' and replaced at each iteration of the loop.
    var temp = uniqueArray.shift();
    console.log('The Temp is #: ', temp);
    //sets the path of the product at the current index.
    Product.pics[i].src = productArray[temp].path;
    //sets the id of the product at the current index.
    Product.pics[i].id = productArray[temp].name;
   productArray[temp].views += 1;
    console.log('Product.all[temp].name: ',productArray[temp].name);
  }
  console.log('remaining values in uniqueArray: ', uniqueArray);
}
