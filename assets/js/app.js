// assets/js/app.js

// --- CONFIGURATION ---
const postsPerPage = 5; // Adjust this for how many posts to show per page
const siteTitle = "My Awesome Blog";

// --- DOM ELEMENTS ---
const content = document.getElementById('content');
const copyrightYear = document.getElementById('copyright-year');
const themeToggle = document.getElementById('theme-toggle');

// --- APP STATE ---
let allPosts = []; // Will be populated by fetching posts

// --- NEW: PARSE FRONT-MATTER ---
// Parses metadata (like title, date, tags) from the top of a Markdown file.
function parseFrontMatter(markdown) {
    const frontMatterRegex = /^---\s*([\s\S]*?)\s*---/;
    const match = frontMatterRegex.exec(markdown);

    if (!match) {
        return { metadata: {}, content: markdown };
    }

    const frontMatterBlock = match[1];
    const content = markdown.substring(match[0].length).trim();
    const metadata = {};

    frontMatterBlock.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        if (key && value) {
            const cleanKey = key.trim();
            // Specifically parse comma-separated tags into an array
            if (cleanKey === 'tags') {
                metadata[cleanKey] = value.split(',').map(tag => tag.trim());
            } else {
                metadata[cleanKey] = value;
            }
        }
    });
    return { metadata, content };
}


// --- NEW: LOAD POSTS ---
// Fetches all post markdown files, parses them, and populates the `allPosts` array.
async function loadAllPosts() {
    const posts = [];

    for (const file of postFiles) {
        try {
            const response = await fetch(`posts/${file}`);
            if (!response.ok) throw new Error(`Could not load ${file}`);
            
            const markdown = await response.text();
            const { metadata, content } = parseFrontMatter(markdown);
            
            // The slug is derived from the filename
            metadata.slug = file.replace('.md', '');
            
            // Ensure tags is an array even if not specified in front-matter
            if (!metadata.tags) {
                metadata.tags = [];
            }
            
            posts.push({ ...metadata, content });
        } catch (error) {
            console.error(error);
        }
    }
    // Sort posts by date, newest first
    allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}


// --- THEME ---
function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
    applyTheme(newTheme);
});

// --- ROUTER ---
function router() {
    const path = window.location.hash.slice(1) || '/';
    content.innerHTML = '<p>Loading...</p>'; // Show loading indicator

    if (path === '/') {
        renderHomepage();
    } else if (path.startsWith('/page/')) {
        const pageNum = parseInt(path.split('/')[2]);
        renderHomepage(pageNum);
    } else if (path.startsWith('/posts/')) {
        const slug = path.split('/')[2];
        renderSinglePost(slug);
    } else if (path.startsWith('/tag/')) {
        const tag = path.split('/')[2];
        renderTagPage(tag);
    } else if (path === '/about') {
        renderStaticPage('about');
    } else if (path === '/tags') {
        renderAllTagsPage();
    } else {
        content.innerHTML = '<h2>404 - Not Found</h2>';
    }
}

// --- RENDER FUNCTIONS (Mostly unchanged) ---
function renderHomepage(page = 1) {
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToRender = allPosts.slice(start, end);

    let html = '<h2>Latest Posts</h2><ul class="post-list">';
    postsToRender.forEach(post => {
        html += `
            <li>
                <span class="post-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <h3><a class="post-link" href="#/post/${post.slug}">${post.title}</a></h3>
            </li>
        `;
    });
    html += '</ul>';
    
    html += renderPagination(page, allPosts.length);
    content.innerHTML = html;
    document.title = siteTitle;
}

function renderSinglePost(slug) {
    const post = allPosts.find(p => p.slug === slug);
    if (post) {
        const postHtml = marked.parse(post.content);
        let tagsHtml = '';
        if (post.tags && post.tags.length) {
            tagsHtml = '<div class="post-tags">Tagged: ' + post.tags.map(tag => `<a href="#/tag/${tag}">${tag}</a>`).join(' ') + '</div>';
        }
        
        content.innerHTML = `
            <article class="post">
                <h1>${post.title}</h1>
                <p class="post-meta">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                ${tagsHtml}
                <div class="post-content">${postHtml}</div>
            </article>
        `;
        document.title = `${post.title} | ${siteTitle}`;
        // Apply syntax highlighting after content is rendered
        hljs.highlightAll();
    } else {
        content.innerHTML = '<h2>404 - Post Not Found</h2>';
        document.title = `Not Found | ${siteTitle}`;
    }
}

function renderTagPage(tag) {
    const taggedPosts = allPosts.filter(p => p.tags.includes(tag));
    let html = `<h2>Posts Tagged “${tag}”</h2><ul class="post-list">`;
    taggedPosts.forEach(post => {
        html += `
            <li>
                <span class="post-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <h3><a class="post-link" href="#/post/${post.slug}">${post.title}</a></h3>
            </li>
        `;
    });
    html += '</ul>';
    content.innerHTML = html;
    document.title = `Posts tagged "${tag}" | ${siteTitle}`;
}

function renderAllTagsPage() {
    const tags = [...new Set(allPosts.flatMap(p => p.tags))].sort();
    let html = '<h1>All Tags</h1><div class="tag-cloud">';
    tags.forEach(tag => {
        const count = allPosts.filter(p => p.tags.includes(tag)).length;
        html += `<a href="#/tag/${tag}" class="tag-item">${tag} (${count})</a>`;
    });
    html += '</div>';
    content.innerHTML = html;
    document.title = `All Tags | ${siteTitle}`;
}

async function renderStaticPage(pageName) {
    try {
        const response = await fetch(`pages/${pageName}.md`);
        if (!response.ok) throw new Error('Page not found');
        const markdown = await response.text();
        const pageHtml = marked.parse(markdown);
        content.innerHTML = `
            <article class="page">
                <div class="page-content">${pageHtml}</div>
            </article>
        `;
        document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | ${siteTitle}`;
    } catch (error) {
        content.innerHTML = '<h2>404 - Page Not Found</h2>';
        document.title = `Not Found | ${siteTitle}`;
    }
}


function renderPagination(currentPage, totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    if (totalPages <= 1) return '';

    let html = '<div class="pagination">';
    
    // Previous page link
    if (currentPage > 1) {
        html += `<a href="#/page/${currentPage - 1}" class="previous">« Newer Posts</a>`;
    } else {
        html += '<span class="previous disabled">« Newer Posts</span>';
    }

    // Page number indicator
    html += `<span class="page-number">Page ${currentPage} of ${totalPages}</span>`;

    // Next page link
    if (currentPage < totalPages) {
        html += `<a href="#/page/${currentPage + 1}" class="next">Older Posts »</a>`;
    } else {
        html += '<span class="next disabled">Older Posts »</span>';
    }

    html += '</div>';
    return html;
}

// --- INITIALIZATION ---
// Main function to initialize the blog
async function main() {
    // Set copyright year
    copyrightYear.textContent = new Date().getFullYear();

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    applyTheme(savedTheme);
    
    // NEW: Wait for all posts to be loaded before setting up the router
    await loadAllPosts();

    // Listen for URL changes and route on initial load
    window.addEventListener('hashchange', router);
    router(); // Initial call to render content
}

// Start the application
main();