fetchQuotes()

const quoteList = document.getElementById("quote-list")

function fetchQuotes(quote) {
    fetch(`http://localhost:3000/quotes?_embed=likes`)
      .then(res => res.json())
      .then(jsonQuotes => {
        jsonQuotes.forEach(quote => {
        renderQuotes(quote)
      })
    })
};

function renderQuotes(quote) {
    const li = document.createElement("li")
    li.className = "quote-card"
    li.id = `quote-${quote.id}`
    const blockQuote = document.createElement("blockquote")
    blockQuote.className = "blockquote"
    const p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = quote.quote
    const footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quote.author
    const br = document.createElement("br")
    const likeButton = document.createElement("button")
    likeButton.className = "btn-success"
    likeButton.innerText = "Likes: "
    let span = document.createElement("span")
    span.innerText = "0"
    const deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    deleteButton.id = quote.id
    likeButton.append(span)
    blockQuote.append(p, footer, br, likeButton, deleteButton)
    li.append(blockQuote)
    quoteList.append(li)

    likeButton.addEventListener("click", function(e) {
        span.innerText = `${parseInt(span.innerText)+ 1}`
        likeQuote(e, quote.id)
    })

    deleteButton.addEventListener("click", deleteQuote)
}

function likeQuote(e, quoteId) {
    e.preventDefault()
    fetch("http://localhost:3000/likes", {
    method: "POST",
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
        quoteId: quoteId,
        createdAt: ""
    })

  })
  .then((response) => response.json())
  .then((likeObj) => console.log(likeObj))
}

function deleteQuote(e) {
    e.preventDefault();
    console.log(e.target.id)
    fetch(`http://localhost:3000/quotes/${e.target.id}`, {
        method: "DELETE",
        headers:
        {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
    })
    .then(response => {
        if(response.ok) {
            const quoteElement = document.getElementById(`quote-${e.target.id}`)
            if(quoteElement) {
                quoteElement.remove()
            }
        }
    })
}

const newQuoteForm = document.getElementById("new-quote-form")

newQuoteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(e.target[1].value)
    newQuote(e.target[0].value, e.target[1].value)
})

function newQuote(quote, author) {
    const quoteData = {
        quote: quote,
        author: author,
    };
    fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(quoteData)

  })
  .then((response) => response.json())
  .then((quote) => renderQuotes(quote))
}