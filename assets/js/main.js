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
    // Real posts from original content
    posts = [
        {
            id: "tsn-overview",
            title: "Time-Sensitive Networking 개요",
            date: "2024-08-01",
            excerpt: "IEEE 802.1 TSN 표준의 핵심 개념과 실시간 네트워킹 기술에 대한 종합적인 소개",
            tags: ["TSN", "802.1Qbv", "Networking"],
            category: "tsn",
            file: "posts/technical/tsn.md"
        },
        {
            id: "omnet-simulation",
            title: "OMNeT++를 이용한 TSN 시뮬레이션",
            date: "2024-07-25",
            excerpt: "OMNeT++ 환경에서 TSN 네트워크를 구성하고 시뮬레이션하는 방법",
            tags: ["OMNeT++", "Simulation", "TSN"],
            category: "tsn",
            file: "posts/technical/omnet.md"
        },
        {
            id: "cbs-analysis",
            title: "Credit-Based Shaper 분석",
            date: "2024-07-20",
            excerpt: "IEEE 802.1Qav CBS 메커니즘의 동작 원리와 구현 방법",
            tags: ["CBS", "802.1Qav", "QoS"],
            category: "tsn",
            file: "posts/technical/cbs.md"
        },
        {
            id: "ptp-implementation",
            title: "Precision Time Protocol 구현",
            date: "2024-07-15",
            excerpt: "IEEE 1588 PTP를 이용한 정밀 시간 동기화 구현",
            tags: ["PTP", "IEEE 1588", "Synchronization"],
            category: "tsn",
            file: "ptp.md"
        },
        {
            id: "paper-period-aware",
            title: "논문 리뷰: Period-Aware Routing for TSN",
            date: "2024-07-10",
            excerpt: "IEEE 802.1Qbv TSN 네트워크를 위한 주기 인식 라우팅 방법 논문 분석",
            tags: ["Paper", "Routing", "Research"],
            category: "paper",
            file: "posts/papers/A Period-Aware Routing Method for IEEE 802.1Qbv TSN Networks.md"
        },
        {
            id: "paper-fault-tolerance",
            title: "논문 리뷰: Fault-Tolerant TSN Scheduling",
            date: "2024-07-05",
            excerpt: "TSN에서의 효율적인 장애 허용 스케줄링 전략 연구",
            tags: ["Paper", "Fault Tolerance", "Scheduling"],
            category: "paper",
            file: "posts/papers/An Efficient Pro-Active Fault-Tolerance Scheduling of IEEE 802.1Qbv Time-Sensitive Network.md"
        },
        {
            id: "paper-ilp-scheduling",
            title: "논문 리뷰: ILP를 통한 고속 Gate 스케줄링",
            date: "2024-07-01",
            excerpt: "정수 선형 프로그래밍을 이용한 IEEE 802.1Qbv 게이트 스케줄링 최적화",
            tags: ["Paper", "ILP", "Optimization"],
            category: "paper",
            file: "posts/papers/Fast IEEE802.1Qbv Gate Scheduling Through Integer Linear Programming.md"
        },
        {
            id: "lan9662-setup",
            title: "Microchip LAN9662 TSN 스위치 설정",
            date: "2024-06-28",
            excerpt: "LAN9662 TSN 스위치의 초기 설정과 PTP 구성 가이드",
            tags: ["Microchip", "LAN9662", "Hardware"],
            category: "embedded",
            file: "log/0725lan9662ptp2board.log"
        },
        {
            id: "s32g-rtlinux",
            title: "NXP S32G에서 Real-time Linux 구축",
            date: "2024-06-20",
            excerpt: "S32G 플랫폼에서 실시간 리눅스 환경 구축 및 TSN 지원 설정",
            tags: ["NXP", "S32G", "RT-Linux"],
            category: "embedded",
            file: "log/g2_0619.log"
        }
    ];
    loadPosts();
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
                <a href="${post.file || 'posts/' + post.id + '.html'}" class="read-more">
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
                <a href="${post.file || 'posts/' + post.id + '.html'}" class="read-more">
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