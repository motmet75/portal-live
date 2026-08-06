// Article Gallery JavaScript - article-gallery.js

document.addEventListener('DOMContentLoaded', function() {
    initializeArticleGallery();
});

let currentPage = 1;
let isLoading = false;

function initializeArticleGallery() {
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Add smooth scrolling for article links
    initializeSmoothScrolling();
    
    // Initialize article card interactions
    initializeCardInteractions();
    
    // Initialize keyboard navigation
    initializeKeyboardNavigation();
}

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeCardInteractions() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click to read functionality
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a')) {
                const readMoreLink = this.querySelector('.read-more');
                if (readMoreLink) {
                    window.location.href = readMoreLink.href;
                }
            }
        });
        
        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const readMoreLink = this.querySelector('.read-more');
                if (readMoreLink) {
                    readMoreLink.click();
                }
            }
        });
    });
}

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const focusedCard = document.activeElement;
            if (focusedCard && focusedCard.classList.contains('article-card')) {
                const cards = Array.from(document.querySelectorAll('.article-card'));
                const currentIndex = cards.indexOf(focusedCard);
                
                let nextIndex;
                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % cards.length;
                } else {
                    nextIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
                }
                
                cards[nextIndex].focus();
            }
        }
    });
}

async function loadMoreArticles() {
    if (isLoading) return;
    
    const button = document.querySelector('.load-more-btn');
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    // Show loading state
    isLoading = true;
    button.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    
    try {
        currentPage++;
        const response = await fetch(`/api/articles?page=${currentPage}&limit=10`);
        
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            appendArticles(data.articles);
            
            // Hide button if no more articles
            if (data.articles.length < 10 || data.hasMore === false) {
                button.style.display = 'none';
            }
        } else {
            button.style.display = 'none';
            showMessage('No more articles to load', 'info');
        }
        
    } catch (error) {
        console.error('Error loading articles:', error);
        showMessage('Failed to load more articles. Please try again.', 'error');
        currentPage--; // Revert page increment
    } finally {
        // Hide loading state
        isLoading = false;
        button.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

function appendArticles(articles) {
    const articlesGrid = document.querySelector('.articles-grid');
    
    articles.forEach((article, index) => {
        const articleElement = createArticleElement(article, index);
        articlesGrid.appendChild(articleElement);
        
        // Trigger animation
        setTimeout(() => {
            articleElement.style.opacity = '1';
            articleElement.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Reinitialize interactions for new cards
    initializeCardInteractions();
}

function createArticleElement(article, index) {
    const articleDiv = document.createElement('article');
    articleDiv.className = 'article-card';
    articleDiv.style.opacity = '0';
    articleDiv.style.transform = 'translateY(30px)';
    articleDiv.style.transition = 'all 0.6s ease';
    
    const defaultImage = '/images/default-article.jpg';
    const defaultAvatar = '/images/default-avatar.jpg';
    const imageUrl = article.imageUrl || defaultImage;
    const authorAvatar = article.author?.avatar || defaultAvatar;
    const readTime = article.readTime ? `${article.readTime} min read` : '5 min read';
    const publishDate = formatDate(article.publishDate);
    
    articleDiv.innerHTML = `
        <div class="article-image">
            <img src="${imageUrl}" alt="${article.title}" loading="lazy">
            <div class="article-overlay">
                <span class="read-time">${readTime}</span>
            </div>
        </div>
        
        <div class="article-content">
            <div class="article-meta">
                <span class="article-category">${article.category}</span>
                <span class="article-date">${publishDate}</span>
            </div>
            
            <h3 class="article-title">
                <a href="/articles/${article.id}">${article.title}</a>
            </h3>
            
            <p class="article-excerpt">${article.excerpt}</p>
            
            <div class="article-footer">
                <div class="author-info">
                    <img src="${authorAvatar}" alt="${article.author?.name || 'Author'}" class="author-avatar">
                    <span class="author-name">${article.author?.name || 'Unknown Author'}</span>
                </div>
                
                <a href="/articles/${article.id}" class="read-more">
                    Read More
                    <svg class="read-more-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>
        </div>
    `;
    
    return articleDiv;
}

function formatDate(dateString) {
    if (!dateString) return 'Jan 01, 2024';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    } catch (error) {
        return 'Jan 01, 2024';
    }
}

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
    } else {
        messageDiv.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll-based animations
window.addEventListener('scroll', debounce(() => {
    const cards = document.querySelectorAll('.article-card');
    const windowHeight = window.innerHeight;
    
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < windowHeight * 0.8) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}, 10));