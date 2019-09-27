var displayPics = function() {
  //stores 3 unique numbers
  var randomImages = [];
  //assigns random values to randomImages index 1 and 2
  randomImages[0] = makeRandomNumber();
  randomImages[1] = makeRandomNumber();
  //here we are checking to see if you randomImages at index 1 is equal to index 2, if so reassign index 1 by calling makeRandomNumber()
  while(randomImages[0] === randomImages[1]){
    console.log('Duplicate Found');
    randomImages[1] = makeRandomNumber();
  }
  //creating the 3rd number in the array and ensuring that it does not match the previous 2 indexes
  randomImages[2] = makeRandomNumber();
  while(randomImages[2] === randomImages[1] || randomImages[2] === randomImages[0] ){
    console.log('Duplicate Found');
    randomImages[2] = makeRandomNumber();
  }
  //using the randomImages array numbers to assign the source a path and a name to the Products in the Products.pics array
  for( var i = 0; i < 3; i++ ) {
    Product.pics[i].src = Product.all[randomImages[i]].path;
    Product.pics[i].id = Product.all[randomImages[i]].name;
    Product.all[randomImages[i]].views += 1;
  }
};