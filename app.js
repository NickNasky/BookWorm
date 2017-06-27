// var googleKey = AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs;
$(document).ready(function () {
  $(".btn").click(gbookPull);
  $(".seeMore").click(pageUpdate);
  $(".titleSearch").click(switchToAuthor);
})
var books;
var currentPage;
var url;
var bookAuthor;

function gbookPull() {
  event.preventDefault();
  $(".bookPages").empty();
  currentPage = 1;
  selected = $("input[name='query']:checked").val();
  var search = $(".form-control").val();
  if (selected === "titleChosen") {
    url = "https://www.googleapis.com/books/v1/volumes?q=" + search + "&maxResults=40&key=AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs";
    $(".seeMore").hide();
  } else if(selected === "authorChosen") {
    url = "https://www.googleapis.com/books/v1/volumes?q=+inauthor:" + search + "&maxResults=40&key=AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs";
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
    // radio.checkBoxRadio("refresh");
}

function switchToAuthor(){
  $(".bookPages").empty();
  setRadio();
  // $("#chosen [value=titleChosen]").attr("checked", false);
  // $("#chosen [value=authorChosen]").attr("checked", true);
  console.log($("input[name='query']:checked").val())
  console.log(bookAuthor)
  url = "https://www.googleapis.com/books/v1/volumes?q=+inauthor:" + bookAuthor + "&maxResults=40&key=AIzaSyBdLgp9midvmN0f1wseCb27cHRBdFZY3Rs"
  $(".titleSearch").hide();
  $(".seeMore").show();
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
}

function bookAppend(title, img, desc) {
  $(".bookPages").append(
    "<div class='col-xs-6 col-md-3'>" + "<div class='thumbnail'>" +
    "<h1 class='text-center'>" + title + "</h1>" +
    "<img src=" + img + " alt=" + title + " class='img-responsive'>" + "<div class = 'caption'>"+ "<p>" + desc + "</p>" + "</div>" + "</div>" + "</div>");
}

function pageUpdate() {
  currentPage++;
  bookInfo(books);
}
