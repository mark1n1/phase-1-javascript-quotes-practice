document.addEventListener('DOMContentLoaded', () => {
  const quotesURL = 'http://localhost:3000/quotes?_embed=likes';
  const likesURL = 'http://localhost:3000/likes';
  const URL = 'http://localhost:3000/quotes';
  const ul = document.getElementById('quote-list');
  const form = document.getElementById('new-quote-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const configObject = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        quote: event.target.quote.value,
        author: event.target.author.value
      })
    };

    fetch(URL, configObject).then((response) => response.json())
      .then((quote) => renderQuote(quote));
    form.reset();
  });

  fetch(quotesURL).then((response) => response.json())
    .then((quotes) => {
      quotes.map((quote) => renderQuote(quote));
    });
  
  function renderQuote(quote) {
    const li = document.createElement('li');
    const blockquote = document.createElement('blockquote');
    const p = document.createElement('p');
    const footer = document.createElement('footer');
    const br = document.createElement('br');
    const span = document.createElement('span');
    const likeButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    li.className = 'quote-card';

    blockquote.className = 'blockquote';

    p.className = 'mb-0';
    p.innerText = quote.quote;

    footer.className = 'blockquote-footer';
    footer.innerText = quote.author;

    span.innerText = quote.likes.length;
    likeButton.className = 'btn-success';
    likeButton.innerText = 'Likes: ';

    deleteButton.className = 'btn-danger';
    deleteButton.innerText = 'Delete';

    likeButton.addEventListener('click', () => {
      const unix_time = parseInt(Math.round(new Date().getTime() / 1000).toString());
      const configObject = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          quoteId: quote.id,
          createdAt: unix_time
        })
      };

      fetch(likesURL, configObject);
      fetch(`http://localhost:3000/likes?quoteId=${quote.id}`)
        .then((response) => response.json())
        .then((quote) => span.innerText = quote.length);
    });

    deleteButton.addEventListener('click', (event) => {
      fetch(URL + `/${quote.id}`, { method: 'DELETE' }).then(() => event.target.parentNode.remove());
    });

    likeButton.append(span);
    blockquote.append(p, footer, br, likeButton, deleteButton);
    ul.append(blockquote);
  }
});