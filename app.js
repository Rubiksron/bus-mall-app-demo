'use strict';

//global variables
Product.names = ['bag.jpg', 'banana.jpg', 'boots.jpg', 'chair.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pen.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
Product.all = [];
Product.justViewed = [];
Product.btnClearLS = document.getElementById('clear-local-storage');
Product.container = document.getElementById('image-container');
Product.tableDynamicEl = document.getElementById('table-dynamic');
Product.pics = [document.getElementById('left'),
                document.getElementById('center'),
                document.getElementById('right')];
Product.totalClicks = 0;

//Product constructor
function Product(name) {
  this.name = name;
  this.path = 'images/' + name;
  this.votes = 0;
  this.views = 0;
  Product.all.push(this);
}

//instantiate the Products through the constructor
for( var i = 0; i < Product.names.length; i++ ) {
  new Product(Product.names[i]);
}

//creates a random number
var makeRandomNumber = function() {
  return Math.floor(Math.random() * Product.names.length);
};

//this function ensures that no duplicates are displayed
var displayPics = function() {
  var randomImages = [];

  randomImages[0] = makeRandomNumber();
  randomImages[1] = makeRandomNumber();

  while(randomImages[0] === randomImages[1]){
    console.log('Duplicate Found');
    randomImages[1] = makeRandomNumber();
  }
  randomImages[2] = makeRandomNumber();
  while(randomImages[2] === randomImages[1] || randomImages[2] === randomImages[0]){
    console.log('Duplicate Found');
    randomImages[2] = makeRandomNumber();
  }
  //using the randomImages array numbers to assign the source a path and a name to the Products in the Products.pics array
  for( var i = 0; i < 3; i++ ) {
    Product.pics[i].src = Product.all[randomImages[i]].path;
    Product.pics[i].id = Product.all[randomImages[i]].name;
    Product.all[randomImages[i]].views += 1;
    Product.justViewed[i] = randomImages[i];
  }
};

//checks to see if totalClicks equals 5
var handleClick = function(event) {
  if(Product.totalClicks >= 5) {
    Product.container.removeEventListener('click', handleClick);
    Product.container.setAttribute('hidden', true);
    //hiding the images after the survey has been completed
    for( var i = 0; i < 3; i++ ){
      Product.pics[i].setAttribute('hidden', true);
    }
    //showing the once hidden canvas and making the chart and table
    Product.btnClearLS.removeAttribute('hidden');
    canvas.removeAttribute('hidden');
    makeTable();
    makeChart();
  }
  //warn the user they missed the mark
  if (event.target.id === 'image-container') {
    return alert('Click on an image!');
  }
  Product.totalClicks += 1;
  //loop over the Product array to compare which Product was clicked, then assign a vote to that Product
  for(var i = 0; i < Product.names.length; i++){
    if(event.target.id === Product.all[i].name) {
      Product.all[i].votes += 1;
      console.log(event.target.id + ' has ' + Product.all[i].votes + ' votes in ' + Product.all[i].views + ' views');
    }
  }
  //save to localStorage here!
  localStorage.totalClicks = JSON.stringify(Product.all);
  console.log('Transfering this data to LC: ', Product.all );
  //display pics if totalClicks is less than 5
  displayPics();
};

//clear localStorage
var handleLocalStorage = function() {
  localStorage.clear();
  console.log('local storage has been cleared.');
  window.location.reload();
};

//make a table to display the data
var makeTable = function() {
  var thEl = document.createElement('th');
  thEl.textContent = 'Products';
  Product.tableDynamicEl.appendChild(thEl);

  for(var i = 0; i < Product.all.length; i++) {
    var thEl = document.createElement('th');
    thEl.textContent = Product.all[i].name + ' has ' + Product.all[i].votes + ' votes in ' + Product.all[i].views + ' views';
    Product.tableDynamicEl.appendChild(thEl);
  }
};

//storing the individual properties of the Products selected to display in chart
Product.namesData = [];
Product.votesData = [];
Product.viewsData = [];

//data object which is to be passed into the .Bar() which is chained to the new instance
Product.data = {
  labels: Product.namesData,
  datasets: [
    {
      fillColor: 'rgba(220,220,220,0.75)',
      strokeColor: 'rgba(220,220,220,1)',
      data: Product.viewsData
    },
    {
      fillColor: 'rgba(151,187,205,0.75)',
      strokeColor: 'rgba(151,187,205,1)',
      data: Product.votesData
    }
  ]
};

//gather all data and push it into separate arrays to feed the chart function
var getChartData = function() {
  for (var i = 0; i < Product.all.length; i++) {
    Product.namesData.push(Product.all[i].name);
    Product.votesData.push(Product.all[i].votes);
    Product.viewsData.push(Product.all[i].views);
  }
}

//make chart
var makeChart = function() {
  getChartData();
  Product.getChart = document.getElementById('canvas').getContext('2d');
  new Chart(Product.getChart).Bar(Product.data);
};

//anonymous function that will check Local Storage for totalClicks and assign the value to Product.all array
(function() {
  if(localStorage.totalClicks) {
    Product.all = JSON.parse(localStorage.totalClicks);
    console.log('data received from local storage.');
  }
})();

//event listeners
Product.container.addEventListener('click', handleClick);
Product.btnClearLS.addEventListener('click', handleLocalStorage)
displayPics();
