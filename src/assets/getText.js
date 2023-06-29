// function handleResponse(response) {
//     if (response.hasOwnProperty("quoteText") && response.hasOwnProperty("quoteAuthor")) {
//         const quote = response.quoteText;
//         const author = response.quoteAuthor;
//         console.log("Цитата: " + quote);
//         console.log("Автор: " + author);
//     } else {
//         console.log("Не удалось получить цитату.");
//     }
// }

// const script = document.createElement("script");
// script.src = "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=ru&jsonp=handleResponse";
// document.head.appendChild(script);


function handleResponse(response) {
    if (
      Object.prototype.hasOwnProperty.call(response, "quoteText") &&
      Object.prototype.hasOwnProperty.call(response, "quoteAuthor")
    ) {
      const quote = response.quoteText;
      const author = response.quoteAuthor;
      console.log("Цитата: " + quote);
      console.log("Автор: " + author);
      this.apiText = quote;
    } else {
      console.log("Не удалось получить цитату.");
    }
  }
  
  window.handleResponse = handleResponse;
  