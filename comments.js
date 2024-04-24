// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');

const comments = [];

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === '/api/comments' && req.method === 'POST') {
    const buffer = [];
    req.on('data', data => {
      buffer.push(data);
    });
    req.on('end', () => {
      const comment = JSON.parse(Buffer.concat(buffer).toString());
      comment.time = new Date();
      comments.push(comment);
      res.end(JSON.stringify(comment));
    });
  } else if (pathname === '/api/comments' && req.method === 'GET') {
    res.end(JSON.stringify(comments));
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});

// Path: index.html
<!DOCTYPE html>
<html>
<head>
  <title>Comments</title>
</head>
<body>
  <h1>Comments</h1>
  <form id="comment-form">
    <input type="text" id="name" placeholder="Name" required>
    <input type="text" id="content" placeholder="Content" required>
    <button type="submit">Submit</button>
  </form>
  <ul id="comments"></ul>
  <script>
    const form = document.getElementById('comment-form');
    const comments = document.getElementById('comments');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = form.querySelector('#name').value;
      const content = form.querySelector('#content').value;
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, content })
      });
      const comment = await res.json();
      comments.innerHTML += `<li>${comment.name} - ${comment.content} - ${comment.time}</li>`;
    });
    async function loadComments() {
      const res = await fetch('/api/comments');
      const comments = await res.json();
      comments.forEach(comment => {
        comments.innerHTML += `<li>${comment.name} - ${comment.content} - ${comment.time}</li>`;
      });