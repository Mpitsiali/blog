// Blog configuration
const BLOG_CONFIG = {
  postsPerPage: 6,
  posts: [
    {
      title: "Welcome to My Blog",
      date: "2024-01-15",
      excerpt:
        "This is the first post on my new minimalist blog. Learn about the features and how to add new posts with tags and pagination.",
      file: "welcome.md",
      tags: ["welcome", "tutorial", "blog"],
    },
    {
      title: "The Art of Minimalism",
      date: "2024-01-10",
      excerpt: "Exploring the principles of minimalist design and how it applies to web development and daily life.",
      file: "minimalism.md",
      tags: ["design", "minimalism", "philosophy"],
    },
    {
      title: "Building with Vanilla JavaScript",
      date: "2024-01-05",
      excerpt:
        "Why sometimes the best solution is the simplest one. A look at building modern web apps without frameworks.",
      file: "vanilla-js.md",
      tags: ["javascript", "web-development", "tutorial"],
    },
    {
      title: "CSS Grid vs Flexbox",
      date: "2024-01-03",
      excerpt: "Understanding when to use CSS Grid and when to use Flexbox for your layouts.",
      file: "css-grid-flexbox.md",
      tags: ["css", "web-development", "layout"],
    },
    {
      title: "Web Performance Tips",
      date: "2024-01-01",
      excerpt: "Simple techniques to make your websites faster and more efficient.",
      file: "performance-tips.md",
      tags: ["performance", "web-development", "optimization"],
    },
    {
      title: "Responsive Design Principles",
      date: "2023-12-28",
      excerpt: "Creating websites that work beautifully on all devices and screen sizes.",
      file: "responsive-design.md",
      tags: ["design", "css", "responsive"],
    },
    {
      title: "Git Workflow Best Practices",
      date: "2023-12-25",
      excerpt: "Organizing your Git workflow for better collaboration and code management.",
      file: "git-workflow.md",
      tags: ["git", "workflow", "development"],
    },
    {
      title: "Accessibility in Web Design",
      date: "2023-12-20",
      excerpt: "Making your websites accessible to everyone, including users with disabilities.",
      file: "accessibility.md",
      tags: ["accessibility", "design", "web-development"],
    },
  ],
}



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
    this.isGridView = true
    this.filteredPosts = [...BLOG_CONFIG.posts]

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.initTheme()
    this.loadTags()
    this.loadPosts()
    this.addScrollEffects()
  }

  setupEventListeners() {
    this.themeToggle.addEventListener("click", () => this.toggleTheme())
    this.viewToggle.addEventListener("click", () => this.toggleView())
    this.backBtn.addEventListener("click", () => this.showPostsList())

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.postView.style.display !== "none") {
        this.showPostsList()
      }
    })

    // Add smooth scroll to top when navigating
    window.addEventListener("beforeunload", () => {
      window.scrollTo(0, 0)
    })
  }

  addScrollEffects() {
    // Add parallax effect to header background
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const headerBg = document.querySelector(".header-background")
      if (headerBg) {
        headerBg.style.transform = `skewY(-2deg) translateY(${scrolled * 0.5}px)`
      }
    })

    // Add intersection observer for post cards animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe post cards when they're created
    this.observePostCards = (cards) => {
      cards.forEach((card) => {
        card.style.opacity = "0"
        card.style.transform = "translateY(20px)"
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
        observer.observe(card)
      })
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
      <button class="tag-btn active" data-tag="all">All Posts</button>
      ${tagsHTML}
    `

    // Add event listeners to tag buttons
    this.tagsFilter.addEventListener("click", (e) => {
      if (e.target.classList.contains("tag-btn")) {
        this.filterByTag(e.target.dataset.tag)
      }
    })
  }

  filterByTag(tag) {
    this.currentTag = tag
    this.currentPage = 1

    // Update active tag button
    document.querySelectorAll(".tag-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tag === tag)
    })

    // Filter posts
    if (tag === "all") {
      this.filteredPosts = [...BLOG_CONFIG.posts]
    } else {
      this.filteredPosts = BLOG_CONFIG.posts.filter((post) => post.tags.includes(tag))
    }

    this.loadPosts()
  }

  toggleView() {
    this.isGridView = !this.isGridView
    this.viewToggleText.textContent = this.isGridView ? "List View" : "Grid View"

    // Add a small delay for smooth transition
    this.postsContainer.style.opacity = "0.5"
    setTimeout(() => {
      this.loadPosts()
      this.postsContainer.style.opacity = "1"
    }, 150)
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
    const postsHTML = postsToShow.map((post) => this.createPostCard(post)).join("")

    this.postsContainer.innerHTML = `
      <div class="${containerClass}">
        ${postsHTML}
      </div>
    `

    // Add click listeners to post cards
    const postCards = document.querySelectorAll(".post-card")
    postCards.forEach((card, index) => {
      const postIndex = startIndex + index
      card.addEventListener("click", () => this.openPost(this.filteredPosts[postIndex]))
    })

    // Add scroll animation to new cards
    this.observePostCards(postCards)

    this.loadPagination()
  }

  createPostCard(post) {
    const date = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    const tagsHTML = post.tags.map((tag) => `<span class="post-tag">${tag}</span>`).join("")

    const listViewClass = this.isGridView ? "" : "list-view"

    return `
      <div class="post-card ${listViewClass}">
        <div class="post-info">
          <div class="post-meta">
            <div>
              <h2 class="post-title">${post.title}</h2>
            </div>
            <div class="post-date">${date}</div>
          </div>
          <p class="post-excerpt">${post.excerpt}</p>
          <div class="post-tags">${tagsHTML}</div>
        </div>
      </div>
    `
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

    // Show page numbers
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
        ${startPost}-${endPost} of ${this.filteredPosts.length} posts
      </div>
    `

    this.pagination.innerHTML = paginationHTML
  }

  goToPage(page) {
    this.currentPage = page
    this.loadPosts()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async openPost(post) {
    this.showPostView()
    this.postContent.innerHTML = '<div class="loading">Loading post...</div>'

    try {
      const response = await fetch(`posts/${post.file}`)
      if (!response.ok) {
        throw new Error("Post not found")
      }

      const markdown = await response.text()
      const html = marked.parse(markdown)
      this.postContent.innerHTML = html

      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      this.postContent.innerHTML = `
        <h1>Post Not Found</h1>
        <p>Sorry, this post could not be loaded. This might be because the markdown file doesn't exist yet.</p>
        <p><strong>To add this post:</strong></p>
        <ol>
          <li>Create a file named <code>${post.file}</code> in the <code>posts/</code> directory</li>
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
    document.querySelector(".navigation").style.display = "block"
    document.querySelector(".main").style.display = "block"
    window.scrollTo({ top: 0, behavior: "smooth" })
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

// Initialize the blog when the page loads
let blog
document.addEventListener("DOMContentLoaded", () => {
  blog = new MinimalBlog()
})
