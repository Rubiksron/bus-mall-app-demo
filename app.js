'use strict';

//global variables
Product.names = ['bag.jpg', 'banana.jpg', 'boots.jpg', 'chair.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pen.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
Product.all = [];
Product.uniqueArray = [];
Product.btnResetEl = document.getElementById('btnReset');
Product.btnClearLS = document.getElementById('clear-local-storage');
Product.container = document.getElementById('image-container');
Product.tableDynamicEl = document.getElementById('table-dynamic');
Product.pics = [
  document.getElementById('left'),
  document.getElementById('center'),
  document.getElementById('right')
];
Product.totalClicks = 0;

//Product constructor, path is concatenating the image folder with the name and extension of the products, then is set as the src path in html
function Product(name, votes=0, views=0) {
  this.name = name;
  this.path = `images/${name}`;
  this.votes = votes;
  this.views = views;
  Product.all.push(this);
}

//creates a random number between 0 and 1 exclusive, meaning 1 is above the limit and 0 is below the limit
var makeRandomNumber = function() {
  return Math.floor(Math.random() * Product.names.length);
};

function displayPics() {
  //keeps the array filled with 6 unique values
  while(Product.uniqueArray.length < 6) {
    var random = makeRandomNumber();
    while(!Product.uniqueArray.includes(random)) {
      console.log('building uniqueArray:  ', Product.uniqueArray);
      Product.uniqueArray.push(random);
    }
  }
  console.log('uniqueArray completed!!: ', Product.uniqueArray);
  for( var i = 0; i < Product.uniqueArray.length; i++ ) {
  //value of the first index of the array is removed and set as the variable 'temp' and replaced at each iteration of the loop
    var temp = Product.uniqueArray.shift();
    console.log('The Temp is #: ', temp);
    //sets the path of the product at the current index
    Product.pics[i].src = Product.all[temp].path;
    //sets the id of the product at the current index
    Product.pics[i].id = Product.all[temp].name;
    Product.all[temp].views += 1;
    console.log('Product.all[temp].name: ', Product.all[temp].name);
  }
  console.log('remaining values in uniqueArray: ', Product.uniqueArray);
}

//checks to see if totalClicks equals 5
var handleClick = function(event) {
  //check to see if totalClicks is more than 5
  if(Product.totalClicks >= 5) {
    Product.container.removeEventListener('click', handleClick);
    Product.container.setAttribute('hidden', true);
    //hiding the images after the survey has been completed
    for( var i = 0; i < 3; i++ ){
      Product.pics[i].setAttribute('hidden', true);
    }
    //showing the once hidden canvas and making the chart and table
    Product.btnClearLS.removeAttribute('hidden');
    Product.btnResetEl.removeAttribute('hidden');
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
  for( var c = 0; c < Product.names.length; c++){
    if(event.target.id === Product.all[c].name) {
      Product.all[c].votes += 1;
    }
  }
  //save to localStorage here!
  localStorage.userData = JSON.stringify(Product.all);
  //display pics if totalClicks is less than 5
  displayPics();
};
//reset the page
var handleReset = function() {
  window.location.reload();
};

//clear localStorage
var handleLocalStorage = function() {
  localStorage.clear();
  window.location.reload();
};

//make a table to display the data
var makeTable = function() {
  var thEl = document.createElement('th');
  thEl.textContent = 'Products';
  Product.tableDynamicEl.appendChild(thEl);

  for(var i = 0; i < Product.all.length; i++) {
    thEl = document.createElement('th');
    thEl.textContent = Product.all[i].name + ' has ' + Product.all[i].votes + ' votes in ' + Product.all[i].views + ' views';
    Product.tableDynamicEl.appendChild(thEl);
  }
};

//storing the individual properties of the Products selected to display in chart
Product.namesData = [];
Product.votesData = [];
Product.viewsData = [];

//gather all data and push it into separate arrays to feed the chart function
var getChartData = function() {
  for (var i = 0; i < Product.all.length; i++) {
    Product.namesData.push(Product.all[i].name);
    Product.votesData.push(Product.all[i].votes);
    Product.viewsData.push(Product.all[i].views);
  }
};
//data object which is to be passed into the .Bar() method which is chained to the new instance of Chart
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

//make chart
var makeChart = function() {
  getChartData();
  Product.getChart = document.getElementById('canvas').getContext('2d');
  new Chart(Product.getChart).Bar(Product.data);
};

//anonymous function that will check Local Storage for userData and assign the value to Product.all array, if not instantiate the Products
(function() {
  if(localStorage.userData) {
    var parsedUserData = JSON.parse(localStorage.userData);
    for( var i = 0; i < parsedUserData.length; i++ ) {
      new Product(parsedUserData[i].name, parsedUserData[i].votes, parsedUserData[i].views);
    }

  } else {
    //instantiate the Products through the constructor
    for( var c = 0; c < Product.names.length; c++ ) {
      new Product(Product.names[c]);
    }
  }
})();

//event listeners
Product.btnResetEl.addEventListener('click', handleReset);
Product.container.addEventListener('click', handleClick);
Product.btnClearLS.addEventListener('click', handleLocalStorage);
displayPics();
