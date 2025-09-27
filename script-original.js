// 原始Apple风格脚本
// 页面加载淡入
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
setTimeout(() => {
  document.body.style.opacity = '1';
}, 100);

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

dropdowns.forEach(dropdown => {
  dropdown.addEventListener('mouseenter', function () {
    if (window.innerWidth > 768) {
      closeAllDropdowns();
      this.classList.add('active');
    }
  });

  dropdown.addEventListener('mouseleave', function () {
    if (window.innerWidth > 768 && this === searchDropdown) {
      setTimeout(() => {
        if (!searchPanelHovered && !searchInputFocused) {
          this.classList.remove('active');
        }
      }, 200);
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

searchInput?.addEventListener('focus', () => {
  searchInputFocused = true;
  searchDropdown?.classList.add('active');
});

searchInput?.addEventListener('blur', () => {
  searchInputFocused = false;
  setTimeout(() => {
    if (!searchPanelHovered) {
      searchDropdown?.classList.remove('active');
    }
  }, 200);
});

document.addEventListener('click', function (e) {
  if (!e.target.closest('.dropdown') &&
    !e.target.closest('.search-panel')) {
    closeAllDropdowns();
  }
});

let keepPanelOpen = false;

// 搜索表单提交处理
searchForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchInput?.value.trim();
  if (query) {
    keepPanelOpen = true;
    setTimeout(() => {
      window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
      keepPanelOpen = false;
    }, 500);
  }
});

// blur 事件处理
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

// 移动端汉堡菜单功能
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// 移动端下拉菜单
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

// 窗口大小改变处理
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks) {
    navLinks.classList.remove('open');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }
});