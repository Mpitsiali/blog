// Blog configuration 
    // {
    //   title: "Accessibility in Web Design",
    //   date: "2023-12-20",
    //   excerpt: "Making your websites accessible to everyone, including users with disabilities.",
    //   file: "accessibility.md",
    //   tags: ["accessibility", "design", "web-development"],
    // },
const BLOG_CONFIG = {
  postsPerPage: 8,
  posts: [
    {
      title: "first post",
      date: "2025-07-07",
      excerpt:
        "my first attempt at writing a blog post.",
      file: "welcome.md",
      tags: ["vibe-coding", "writing"],
    },

  ],
}

const marked = window.marked

class MinimalBlog {
  constructor() {
    this.postsContainer = document.getElementById("postsContainer")
    this.pagination = document.getElementById("pagination")
    this.tagsFilter = document.getElementById("tagsFilter")
    this.viewToggle = document.getElementById("viewToggle")
    this.viewToggleText = document.getElementById("viewToggleText")
    this.postView = document.getElementById("postView")
    this.postContent = document.getElementById("postContent")
    this.backBtn = document.getElementById("backBtn")
    this.themeToggle = document.getElementById("themeToggle")

    this.currentPage = 1
    this.currentTag = "all"
    this.isGridView = false // Start with list view
    this.filteredPosts = [...BLOG_CONFIG.posts]

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.initTheme()
    this.loadTags()
    this.handleLocationChange()
  }

  setupEventListeners() {
    this.themeToggle.addEventListener("click", () => this.toggleTheme())
    this.viewToggle.addEventListener("click", () => this.toggleView())
    this.backBtn.addEventListener("click", () => history.back())

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.postView.style.display !== "none") {
        history.back()
      }
    })

    window.addEventListener("popstate", () => this.handleLocationChange())
  }
  
  handleLocationChange() {
    const hash = window.location.hash
    
    if (hash.startsWith("#post/")) {
        const postFile = hash.substring(6) // length of '#post/'
        const post = BLOG_CONFIG.posts.find(p => p.file === postFile)
        if (post) {
            this.renderPost(post)
        } else {
            // If post not in config, just show the list
            this.showPostsList() 
        }
    } else {
        this.showPostsList()
    }
  }

  loadTags() {
    const allTags = new Set()
    BLOG_CONFIG.posts.forEach((post) => {
      post.tags.forEach((tag) => allTags.add(tag))
    })

    const tagsHTML = Array.from(allTags)
      .sort()
      .map((tag) => `<button class="tag-btn" data-tag="${tag}">${tag}</button>`)
      .join("")

    this.tagsFilter.innerHTML = `
      <button class="tag-btn active" data-tag="all">all</button>
      ${tagsHTML}
    `

    this.tagsFilter.addEventListener("click", (e) => {
      if (e.target.classList.contains("tag-btn")) {
        this.filterByTag(e.target.dataset.tag)
      }
    })
  }

  filterByTag(tag) {
    this.currentTag = tag
    this.currentPage = 1

    document.querySelectorAll(".tag-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tag === tag)
    })

    if (tag === "all") {
      this.filteredPosts = [...BLOG_CONFIG.posts]
    } else {
      this.filteredPosts = BLOG_CONFIG.posts.filter((post) => post.tags.includes(tag))
    }

    this.loadPosts()
  }

  toggleView() {
    this.isGridView = !this.isGridView
    this.viewToggleText.textContent = this.isGridView ? "list view" : "grid view"
    this.loadPosts()
  }

  loadPosts() {
    const startIndex = (this.currentPage - 1) * BLOG_CONFIG.postsPerPage
    const endIndex = startIndex + BLOG_CONFIG.postsPerPage
    const postsToShow = this.filteredPosts.slice(startIndex, endIndex)

    if (postsToShow.length === 0) {
      this.postsContainer.innerHTML = `
        <div class="no-posts">
          <h3>No posts found</h3>
          <p>Try selecting a different tag or check back later for new content.</p>
        </div>
      `
      this.pagination.innerHTML = ""
      return
    }

    const containerClass = this.isGridView ? "posts-grid" : "posts-list"
    const postsHTML = postsToShow.map((post) => this.createPostItem(post)).join("")

    this.postsContainer.innerHTML = `
      <div class="${containerClass}">
        ${postsHTML}
      </div>
    `

    const postItems = document.querySelectorAll(".post-item, .post-card")
    postItems.forEach((item, index) => {
      const postIndex = startIndex + index
      item.addEventListener("click", () => this.navigateToPost(this.filteredPosts[postIndex]))
    })

    this.loadPagination()
  }

  createPostItem(post) {
    const date = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    const tagsHTML = post.tags.map((tag) => `<span class="post-tag">${tag}</span>`).join("")

    if (this.isGridView) {
      return `
        <div class="post-card">
          <div class="post-header">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-date">${date}</div>
          </div>
          <p class="post-excerpt">${post.excerpt}</p>
          <div class="post-tags">${tagsHTML}</div>
        </div>
      `
    } else {
      return `
        <div class="post-item">
          <div class="post-header">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-date">${date}</div>
          </div>
          <p class="post-excerpt">${post.excerpt}</p>
          <div class="post-tags">${tagsHTML}</div>
        </div>
      `
    }
  }

  loadPagination() {
    const totalPages = Math.ceil(this.filteredPosts.length / BLOG_CONFIG.postsPerPage)

    if (totalPages <= 1) {
      this.pagination.innerHTML = ""
      return
    }

    let paginationHTML = `
      <button class="pagination-btn" ${this.currentPage === 1 ? "disabled" : ""} 
              onclick="blog.goToPage(${this.currentPage - 1})">‹</button>
    `

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        paginationHTML += `
          <button class="pagination-btn ${i === this.currentPage ? "active" : ""}" 
                  onclick="blog.goToPage(${i})">${i}</button>
        `
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        paginationHTML += `<span class="pagination-info">...</span>`
      }
    }

    paginationHTML += `
      <button class="pagination-btn" ${this.currentPage === totalPages ? "disabled" : ""} 
              onclick="blog.goToPage(${this.currentPage + 1})">›</button>
    `

    const startPost = (this.currentPage - 1) * BLOG_CONFIG.postsPerPage + 1
    const endPost = Math.min(this.currentPage * BLOG_CONFIG.postsPerPage, this.filteredPosts.length)

    paginationHTML += `
      <div class="pagination-info">
        ${startPost}-${endPost} of ${this.filteredPosts.length}
      </div>
    `

    this.pagination.innerHTML = paginationHTML
  }

  goToPage(page) {
    this.currentPage = page
    this.loadPosts()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  navigateToPost(post) {
      history.pushState({ postFile: post.file }, post.title, `#post/${post.file}`);
      this.renderPost(post);
  }

  async renderPost(post) {
    this.showPostView()
    this.postContent.innerHTML = '<div class="loading">Loading...</div>'
    document.title = `${post.title} | mpitsiali's blog`;

    try {
      const response = await fetch(`posts/${post.file}`)
      if (!response.ok) {
        throw new Error("Post not found")
      }

      const markdown = await response.text()
      const html = marked.parse(markdown)
      this.postContent.innerHTML = html
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      this.postContent.innerHTML = `
        <h1>Post Not Found</h1>
        <p>This post could not be loaded. The markdown file might not exist yet.</p>
        <p><strong>To add this post:</strong></p>
        <ol>
          <li>Create <code>${post.file}</code> in the <code>posts/</code> directory</li>
          <li>Write your content in Markdown format</li>
          <li>Refresh the page</li>
        </ol>
      `
    }
  }

  showPostView() {
    document.querySelector(".main").style.display = "none"
    document.querySelector(".navigation").style.display = "none"
    this.postView.style.display = "block"
  }

  showPostsList() {
    this.postView.style.display = "none"
    document.querySelector(".navigation").style.display = "flex"
    document.querySelector(".main").style.display = "block"
    document.title = "mpitsiali's blog";
    this.loadPosts();
  }

  initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark"
    this.setTheme(savedTheme)
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark"
    const newTheme = currentTheme === "light" ? "dark" : "light"
    this.setTheme(newTheme)
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)

    const themeIcon = document.querySelector(".theme-icon")
    themeIcon.textContent = theme === "light" ? "🌙" : "☀️"
  }
}

let blog
document.addEventListener("DOMContentLoaded", () => {
  blog = new MinimalBlog()
})