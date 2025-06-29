// Your "database" of blog posts
const postsData = [
    {
        slug: 'a-post-with-features',
        title: 'A Post Demonstrating All Features',
        date: '2023-10-27',
        tags: ['javascript', 'tech', 'demo'],
        content: `
Welcome to this post! It demonstrates all the features of this JS-powered blog.

### Markdown is Easy

You can write in plain text, and it gets converted to beautiful HTML. You can have **bold text**, _italic text_, and links like [this one to Google](https://google.com).

### Syntax Highlighting

Here is a JavaScript code block that will be automatically styled by Highlight.js.

\`\`\`javascript
// This is a javascript code block
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

And here is some Python:

\`\`\`python
def say_hello():
  print("Hello from a pure HTML/JS blog!")
\`\`\`

### And More!

This entire system is driven by just a few files and has no build step.
`
    },
    {
        slug: 'my-second-post',
        title: 'My Second Post on the Blog',
        date: '2023-10-26',
        tags: ['life'],
        content: `
This is another post. The system supports pagination, so this post might appear on the second page if you have enough articles.
`
    },
    {
        slug: 'hello-world',
        title: 'Hello World',
        date: '2023-10-25',
        tags: ['tech'],
        content: `
This is the very first post. It's simple and clean.
`
    }
    // Add new posts here, at the top of the array
];