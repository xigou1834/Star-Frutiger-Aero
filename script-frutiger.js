// Frutiger Aero风格页面加载效果
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
setTimeout(() => {
  document.body.style.opacity = '1';
}, 100);

// 添加页面加载时的淡入动画
window.addEventListener('load', () => {
  // 为卡片添加逐个出现的动画
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 + index * 150);
  });

  // 为CTA按钮添加动画
  const ctaLink = document.querySelector('.cta-link');
  if (ctaLink) {
    ctaLink.style.opacity = '0';
    ctaLink.style.transform = 'translateY(20px)';
    setTimeout(() => {
      ctaLink.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      ctaLink.style.opacity = '1';
      ctaLink.style.transform = 'translateY(0)';
    }, 600);
  }
});

const dropdowns = document.querySelectorAll('.dropdown');
const searchDropdown = document.querySelector('.search-dropdown');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchPanel = document.querySelector('.search-panel');

let searchPanelHovered = false;
let searchInputFocused = false;

function closeAllDropdowns() {
  dropdowns.forEach(dropdown => {
    if (dropdown !== searchDropdown || !(searchPanelHovered || searchInputFocused)) {
      dropdown.classList.remove('active');
    }
  });
}

// 增强的下拉菜单交互
dropdowns.forEach(dropdown => {
  dropdown.addEventListener('mouseenter', function () {
    if (window.innerWidth > 768) {
      closeAllDropdowns();
      this.classList.add('active');
      
      // 添加悬停时的微妙动画
      const dropdownContent = this.querySelector('.dropdown-content');
      if (dropdownContent) {
        dropdownContent.style.transform = 'translateY(0) scale(1)';
      }
    }
  });

  dropdown.addEventListener('mouseleave', function () {
    if (window.innerWidth > 768 && this === searchDropdown) {
      setTimeout(() => {
        if (!searchPanelHovered && !searchInputFocused) {
          this.classList.remove('active');
        }
      }, 200);
    } else if (window.innerWidth > 768) {
      // 为其他下拉菜单添加延迟关闭
      setTimeout(() => {
        this.classList.remove('active');
      }, 150);
    }
  });

  dropdown.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const wasActive = this.classList.contains('active');
      closeAllDropdowns();
      if (!wasActive) {
        this.classList.add('active');
        if (this === searchDropdown) {
          searchInput?.focus();
        }
      }
    }
  });
});

// 增强的搜索面板交互
searchPanel?.addEventListener('mouseenter', () => {
  searchPanelHovered = true;
  searchDropdown?.classList.add('active');
});

searchPanel?.addEventListener('mouseleave', () => {
  searchPanelHovered = false;
  setTimeout(() => {
    if (!searchInputFocused) {
      searchDropdown?.classList.remove('active');
    }
  }, 200);
});

// 增强的搜索输入框交互
searchInput?.addEventListener('focus', () => {
  searchInputFocused = true;
  searchDropdown?.classList.add('active');
  
  // 添加聚焦动画
  searchInput.style.transform = 'scale(1.02)';
  setTimeout(() => {
    searchInput.style.transform = 'scale(1)';
  }, 200);
});

searchInput?.addEventListener('blur', () => {
  searchInputFocused = false;
  setTimeout(() => {
    if (!searchPanelHovered) {
      searchDropdown?.classList.remove('active');
    }
  }, 200);
});

// 增强的点击外部关闭功能
document.addEventListener('click', function (e) {
  if (!e.target.closest('.dropdown') &&
    !e.target.closest('.search-panel')) {
    closeAllDropdowns();
  }
});

// 增强的搜索表单处理
let keepPanelOpen = false;

searchForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchInput?.value.trim();
  if (query) {
    keepPanelOpen = true;
    
    // 添加搜索提交动画
    const submitButton = this.querySelector('button');
    if (submitButton) {
      submitButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        submitButton.style.transform = 'scale(1)';
      }, 150);
    }
    
    setTimeout(() => {
      window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
      keepPanelOpen = false;
    }, 300);
  }
});

// 增强的输入框失焦处理
searchInput?.addEventListener('blur', () => {
  if (!keepPanelOpen) {
    searchInputFocused = false;
    setTimeout(() => {
      if (!searchPanelHovered && !searchInputFocused) {
        searchDropdown?.classList.remove('active');
      }
    }, 300);
  }
});

// 为卡片添加交互增强效果
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    // 鼠标跟踪效果
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
    });
    
    // 点击涟漪效果
    card.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // CTA按钮增强效果
  const ctaLink = document.querySelector('.cta-link');
  if (ctaLink) {
    ctaLink.addEventListener('mouseenter', () => {
      ctaLink.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    ctaLink.addEventListener('mouseleave', () => {
      ctaLink.style.transform = 'translateY(0) scale(1)';
    });
  }
});

// 添加涟漪效果的CSS（动态添加）
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  .card {
    position: relative;
    overflow: hidden;
  }
  
  /* 页面滚动视差效果 */
  .hero::before {
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }
  
  /* 按钮脉冲效果 */
  .cta-link {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  
  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 
        0 8px 25px rgba(14, 165, 233, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    50% { 
      box-shadow: 
        0 8px 25px rgba(14, 165, 233, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }
  }
`;
document.head.appendChild(style);

// 移动端汉堡菜单功能
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    
    // 添加汉堡按钮动画
    navToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      navToggle.style.transform = 'scale(1)';
    }, 150);
  });
}

// 优化的移动端下拉菜单
if (window.innerWidth <= 768) {
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('a[href="#"]');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
      });
    }
  });
}

// 页面性能优化：防抖处理
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

// 优化窗口大小改变处理
window.addEventListener('resize', debounce(() => {
  // 重置移动端菜单状态
  if (window.innerWidth > 768 && navLinks) {
    navLinks.classList.remove('open');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }
}, 250));