// var googleKey = AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs;
$(document).ready(function () {
  $(".btn").click(gbookPull);
  $(".seeMore").click(pageUpdate)
})
var books;
var currentPage = 1;
var url;

function gbookPull() {
  event.preventDefault();
  var selected = $("input[name='query']:checked").val();
  var search = $(".form-control").val();
  if (selected === "titleChosen") {
    url = "https://www.googleapis.com/books/v1/volumes?q=" + search + "&maxResults=40&key=AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs";
  } else if(selected === "authorChosen") {
    url = "https://www.googleapis.com/books/v1/volumes?q=+inauthor:" + search + "&maxResults=40&key=AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs";
  }
  $.get(url)
  .then(function(data){
    books = data;
    bookInfo(data);
    $(".seeMore").show();
    console.log(data);
    return books;
  })
}

function bookInfo(data) {
  var titleArr = [];
  var imgArr = [];
  var descArr = [];
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
    bookAppend(data.items[0].volumeInfo.authors[0], imgArr[0], descArr[0]);
    $(".seeMore").text("See more from this author");
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
  }
}

function bookAppend(title, img, desc) {
  $(".bookPages").append(
    "<div class='col-xs-6 col-md-3'>" + "<div class='thumbnail'>" +
    "<h1 class='text-center'>" + title + "</h1>" +
    "<img src=" + img + " alt=" + title + " class='img-responsive'>" + "<div class = 'caption'>"+ "<p>" + desc + "</p>" + "</div>" + "</div>" + "</div>");
}

function pageUpdate() {
  currentPage++;
  console.log(currentPage);
  // if ($("input[name='query']:checked").val() = "titleChosen") {
  //
  // }
  bookInfo(books);
}
