// var googleKey = AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs;
// var greadsKey = YqTgqWmdmWowpubRQ7l1Q;
$(document).ready(function () {
  $(".searchBtn").click(gbookPull);
  $(".seeMore").click(pageUpdate);
  $(".titleSearch").click(switchToAuthor);
  $("nav").click(backToMain);
  $(".seeMore").hide();
  $(".titleSearch").hide();
})
var books;
var currentPage;
var url;
var bookAuthor;
var reviews;
var isbn;
var forSale;
var loading = $(".loading");

function backToMain() {
  $("main").show();
  $(".bookPages").empty();
  $(".seeMore").hide();
  $(".titleSearch").hide();
}

function expandInfo(){
  event.preventDefault();
  $(".thumbnail").hide();
  $(".expandBtn").hide();
  $(".seeMore").hide();
  $(".titleSearch").hide();
  displayLoading();
  var title = $(this).attr("data-title");
  var expandedBook;
  for (var i = 0; i < books.items.length; i++) {
    if (this.alt === (books.items[i].volumeInfo.title).replace(/ /g, '+') || title ===(books.items[i].volumeInfo.title).replace(/ /g, '+')){
      expandedBook = books.items[i];
    }
  }
  if (expandedBook.volumeInfo.imageLinks) {
    var expandedImg = expandedBook.volumeInfo.imageLinks.thumbnail;
  } else {
    expandedImg = "http://via.placeholder.com/500x300"
  }
  if (expandedBook.volumeInfo.authors) {
    var expandedAuthor = " by " + expandedBook.volumeInfo.authors[0];
  } else {
    expandedAuthor = "";
  }
  if (expandedBook.volumeInfo.description) {
  var expandedDesc = expandedBook.volumeInfo.description;
} else {
  expandedDesc = "This book doesn't seem to have an official description!"
}
  var expandedTitle = expandedBook.volumeInfo.title;
  isbn = expandedBook.volumeInfo.industryIdentifiers[0].identifier;
  var reviewUrl = "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/book/isbn/" + isbn + "?key=YqTgqWmdmWowpubRQ7l1Q&format=json";
  forSale = expandedBook.saleInfo.saleability;
  if (forSale === "FOR_SALE") {
    var bookPrice = expandedBook.saleInfo.listPrice.amount;
    var buyBook = expandedBook.saleInfo.buyLink;
    if (expandedBook.saleInfo.isEbook) {
      var ebook = "This book is available as an eBook!";
    } else {
      var ebook = "Sorry, this book is not available as an eBook."
    }
  }
  $.get(reviewUrl)
  .then(function(data) {
    hideLoading();
    $(".bookPages").append(
      "<div class='col-xs-12 col-md-12'>" + "<div id='bigNail' class='thumbnail'>" +
      "<h1 class='text-center expandedHeader'>" + expandedTitle +
      expandedAuthor + "</h1>" + "<p class='imgAndDesc'><img src=" + expandedImg
      + " alt=" + expandedTitle + " class='img-responsive' id='cover'>" +
      expandedDesc + "</p><a class='btn btn-primary reviewBtn' role='button'>Show Reviews for " + expandedTitle + "</a> <a class='btn btn-default previewBtn' role='button'>See Google Books Availability of " + expandedTitle + "</a><div class='viewerCanvas'><ul><li>Price: " + bookPrice +"</li><li>eBook Availability: " + ebook + "<li><a href='" + buyBook + "'>Buy Now!</a></li></ul>" + "</div><div class='widget'>" + data.reviews_widget + "</div>" + "</p>" + "</div> " + "</div>");
      $(".widget").hide();
      $(".viewerCanvas").hide();
      $(".reviewBtn").click(showReview);
      $(".previewBtn").click(showAvailibity);
  })
  .catch(function (e){
    alert("Sorry, we couldn't find what you were looking for. Please enter a new value");
    $(".thumbnail").show();
    $(".expandBtn").show();
    hideLoading();
  })
}

function showReview() {
  $(".widget").toggle();
  $(".viewerCanvas").hide();
}

function showAvailibity() {
  if (forSale !== "FOR_SALE") {
    alert("Sorry, this book is not available to purchase through Google Books.")
  } else {
    $(".widget").hide();
    $(".viewerCanvas").toggle()
  }
}

function gbookPull() {
  event.preventDefault();
  displayLoading();
  $("main").hide();
  $(".bookPages").empty();
  currentPage = 1;
  $(".titleSearch").hide();
  $(".seeMore").hide();
  selected = $("input[name='query']:checked").val();
  var search = $(".form-control").val();
  if (selected === "titleChosen") {
    url = "https://www.googleapis.com/books/v1/volumes?q=+intitle:" + search + "&orderBy=relevance&maxResults=40&key=AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs";
    $(".seeMore").hide();
  } else if(selected === "authorChosen") {
    url = "https://www.googleapis.com/books/v1/volumes?q=+inauthor:" + search + "&orderBy=relevance&maxResults=40&key=AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs";
    $(".titleSearch").hide();
  }
  $.get(url)
  .then(function(data){
    books = data;
    bookInfo(data);
    return books;
  })
}

function setRadio() {
    var radio = $("#chosen");
    radio[0].checked = true;
}

function switchToAuthor(){
  displayLoading();
  $(".bookPages").empty();
  $(".titleSearch").hide();
  setRadio();
  url = "https://www.googleapis.com/books/v1/volumes?q=+inauthor:" + bookAuthor + "&maxResults=40&key=AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs"
  $.get(url)
  .then(function(data) {
    books = data;
    bookInfo(data);
    return books;
  })
}

function bookInfo(data) {
  var titleArr = [];
  var imgArr = [];
  var descArr = [];
  $(".seeMore").hide();
  $(".titleSearch").hide();
  bookAuthor = data.items[0].volumeInfo.authors[0];
  for (var i = 0; i < data.items.length; i++) {
    titleArr[i] = data.items[i].volumeInfo.title;
    if (data.items[i].volumeInfo.imageLinks) {
      imgArr[i] = data.items[i].volumeInfo.imageLinks.thumbnail;
    } else {
      imgArr[i] = "http://via.placeholder.com/350x150";
    }
    if (data.items[i].volumeInfo.description) {
      descArr[i] = data.items[i].volumeInfo.description;
    } else {
      descArr[i] = "Sorry, this book doesn't seem to have an official description!";
    }
  }
  if ($("input[name='query']:checked").val() === "titleChosen"){
    $(".bookPages").append("<div class='row'>");
    bookAppend(titleArr[0], imgArr[0], descArr[0]);
    $(".titleSearch").text("Would you like to see more books from " + bookAuthor + "?");
    $(".titleSearch").show();
  } else {
    for (var j = (currentPage-1)*8; j < 8 * currentPage; j++){
      if (j%4 === 0) {
        $(".bookPages").append("<div class='row'>");
        bookAppend(titleArr[j], imgArr[j], descArr[j]);
      } else if (j%4 === 1) {
        bookAppend(titleArr[j], imgArr[j], descArr[j]);
      } else if (j%4 === 2) {
        bookAppend(titleArr[j], imgArr[j], descArr[j]);
      } else if (j%4 === 3) {
        bookAppend(titleArr[j], imgArr[j], descArr[j]);
        $(".bookPages").append("</div>");
      }
    }
    $(".seeMore").show();
  }
  $(".img-responsive").click(expandInfo);
  $(".expandBtn").click(expandInfo);
    hideLoading();
}

function bookAppend(title, img, desc) {
  $(".bookPages").append(
    "<div class='col-xs-6 col-md-3'>" + "<div class='thumbnail'>" +
    "<h1 class='text-center'>" + title + "</h1>" +
    "<a><img src=" + img + " alt=" + title.replace(/ /g, '+') + " class='img-responsive'></a>" + "<div class = 'caption'>"+ "<p>" + desc + "</p>"+ "</div>" + "</div><a data-title='" + title.replace(/ /g, '+') + "' class='expandBtn'>To Reviews</a>" + "</div>");
}

function pageUpdate() {
  currentPage++;
  if (currentPage > 5){
    alert("No more books are available for this search. Start another to get more!")
  }
  bookInfo(books);
}
function displayLoading() {
  loading.removeClass('hide')
}

function hideLoading() {
  loading.addClass('hide')
}
