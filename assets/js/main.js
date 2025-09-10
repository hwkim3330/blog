// Theme Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = document.querySelector('.theme-toggle i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Initialize network animation
    initNetworkAnimation();
    
    // Load posts data
    if (document.getElementById('postsGrid')) {
        loadPostsData();
    }
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
}

// Network Animation for Hero
function initNetworkAnimation() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const nodes = [];
    const numNodes = 50;
    
    // Create nodes
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
            ctx.fill();
        });
        
        // Draw connections
        nodes.forEach((node, i) => {
            nodes.slice(i + 1).forEach(otherNode => {
                const distance = Math.sqrt(
                    Math.pow(node.x - otherNode.x, 2) + 
                    Math.pow(node.y - otherNode.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
                    ctx.globalAlpha = (100 - distance) / 100 * 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Posts data - will be loaded dynamically
let posts = [];

// Load posts from markdown files
async function loadPostsData() {
    try {
        const response = await fetch('posts/posts.json');
        if (response.ok) {
            posts = await response.json();
            loadPosts();
        } else {
            // Fallback if posts.json doesn't exist
            console.error('Could not load posts.json');
            loadPosts();
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        loadPosts();
    }
}

// Load posts
function loadPosts(filter = 'all') {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    const filteredPosts = filter === 'all' 
        ? posts 
        : posts.filter(post => post.category === filter);
    
    postsGrid.innerHTML = filteredPosts.map(post => `
        <article class="post-card">
            <div class="post-header">
                <div class="post-date">${formatDate(post.date)}</div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
            </div>
            <div class="post-footer">
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
                <a href="post.html?p=${encodeURIComponent(post.file || 'posts/' + post.id + '.html')}" class="read-more">
                    Read more <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');
}

// Search posts
function searchPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const postsGrid = document.getElementById('postsGrid');
    
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    postsGrid.innerHTML = filteredPosts.map(post => `
        <article class="post-card">
            <div class="post-header">
                <div class="post-date">${formatDate(post.date)}</div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
            </div>
            <div class="post-footer">
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
                <a href="post.html?p=${encodeURIComponent(post.file || 'posts/' + post.id + '.html')}" class="read-more">
                    Read more <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');
}

// Filter posts by category
function filterPosts(category) {
    // Update active button
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load filtered posts
    loadPosts(category);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});