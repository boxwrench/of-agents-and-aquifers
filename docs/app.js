// State Management
let articles = [];
let activeCategory = 'all';
let searchQuery = '';

// Category Tag Mappings
const categoryMap = {
  research: ['research', 'case-studies', 'case-study', 'modeling', 'water', 'treatment', 'scada'],
  tutorials: ['tutorials', 'guides', 'tutorial', 'guide'],
  tooling: ['tooling', 'harnesses', 'tool', 'harness', 'hermes'],
  datasets: ['datasets', 'telemetry', 'dataset', 'data', 'utilities', 'sensors']
};

// DOM Elements
const searchInput = document.getElementById('search-input');
const articlesGrid = document.getElementById('articles-grid');
const resultsCount = document.getElementById('results-count');
const repoInput = document.getElementById('repo-input');
const bookmarkletLink = document.getElementById('bookmarklet-link');
const copyBookmarkletBtn = document.getElementById('copy-bookmarklet');
const themeToggleBtn = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('theme-icon-moon');
const sunIcon = document.getElementById('theme-icon-sun');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark/Light Theme Initialization
  initTheme();
  
  // 2. Setup Bookmarklet
  const defaultRepo = 'boxwrench/of-agents-and-aquifers';
  const savedRepo = localStorage.getItem('oa_repo_path') || defaultRepo;
  repoInput.value = savedRepo;
  updateBookmarklet(savedRepo);

  // 3. Fetch Articles Data
  fetchArticles();

  // Event Listeners
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterAndRender();
  });

  repoInput.addEventListener('input', (e) => {
    const newRepo = e.target.value.trim() || defaultRepo;
    localStorage.setItem('oa_repo_path', newRepo);
    updateBookmarklet(newRepo);
  });

  copyBookmarkletBtn.addEventListener('click', () => {
    const code = getBookmarkletCode(repoInput.value.trim());
    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBookmarkletBtn.innerText;
      copyBookmarkletBtn.innerText = '📋 Copied!';
      setTimeout(() => {
        copyBookmarkletBtn.innerText = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });

  // Setup category button events
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterAndRender();
    });
  });

  // Theme Toggle Button
  themeToggleBtn.addEventListener('click', toggleTheme);
});

// Theme Setup
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  } else {
    document.documentElement.removeAttribute('data-theme');
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }
}

// Fetch Articles Database
async function fetchArticles() {
  try {
    const response = await fetch('data/articles.json');
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    articles = await response.json();
    calculateCategoryCounts();
    filterAndRender();
  } catch (error) {
    console.error('Error fetching articles data:', error);
    articlesGrid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p>Failed to load resources database.</p>
        <p style="font-size:0.85rem; margin-top:0.5rem; color:var(--ink-lighter);">${error.message}</p>
      </div>
    `;
  }
}

// Check if article tags match mapped tags for a category
function articleMatchesCategory(art, category) {
  if (category === 'all') return true;
  
  const targetTags = categoryMap[category];
  if (!targetTags || !art.tags || !Array.isArray(art.tags)) return false;
  
  return art.tags.some(tag => targetTags.includes(tag.toLowerCase()));
}

// Dynamically compute and display resource counts
function calculateCategoryCounts() {
  // Count Total
  document.getElementById('count-all').textContent = articles.length;
  
  // Count categories
  Object.keys(categoryMap).forEach(cat => {
    const count = articles.filter(art => articleMatchesCategory(art, cat)).length;
    const badge = document.getElementById(`count-${cat}`);
    if (badge) {
      badge.textContent = count;
    }
  });
}

// Filter and Render Grid
function filterAndRender() {
  const filtered = articles.filter(art => {
    // 1. Category Filter
    const matchesCategory = articleMatchesCategory(art, activeCategory);
    
    // 2. Search query filter
    const titleMatch = art.title && art.title.toLowerCase().includes(searchQuery);
    const descMatch = art.description && art.description.toLowerCase().includes(searchQuery);
    const siteMatch = art.site_name && art.site_name.toLowerCase().includes(searchQuery);
    const tagsMatch = art.tags && art.tags.some(t => t.toLowerCase().includes(searchQuery));
    const matchesSearch = !searchQuery || (titleMatch || descMatch || siteMatch || tagsMatch);
    
    return matchesCategory && matchesSearch;
  });

  renderArticles(filtered);
}

// Render filtered lists as Title 22 Cards
function renderArticles(list) {
  articlesGrid.innerHTML = '';
  resultsCount.textContent = `${list.length} item${list.length !== 1 ? 's' : ''} found`;

  if (list.length === 0) {
    articlesGrid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18" />
        </svg>
        <p>No resources found in this category.</p>
      </div>
    `;
    return;
  }

  // Detect correct Link Path (GitHub Pages blob vs local file)
  const isLocal = window.location.protocol === 'file:' || 
                  window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';
  
  let baseRepoUrl = '';
  if (!isLocal) {
    const parts = window.location.pathname.split('/');
    const owner = window.location.hostname.split('.')[0];
    const repo = parts[1] || 'of-agents-and-aquifers';
    baseRepoUrl = `https://github.com/${owner}/${repo}/blob/main/`;
  } else {
    baseRepoUrl = '../';
  }

  list.forEach(art => {
    const card = document.createElement('div');
    card.className = 'content-item';

    // Tags list chips
    let tagsHtml = '';
    if (art.tags && art.tags.length > 0) {
      tagsHtml = `<div class="content-tags-row">` + 
                 art.tags.map(t => `<span class="content-chip">${t}</span>`).join('') + 
                 `</div>`;
    }

    const notesLink = baseRepoUrl + art.notes_file;

    card.innerHTML = `
      <div class="content-item-top">
        <span class="content-source">${art.site_name || 'Web Resource'}</span>
        <span class="content-date">${art.date_published || art.date_added || ''}</span>
      </div>
      <h3 class="content-title">${art.title}</h3>
      <p class="content-blurb">${art.description || 'Check study notes for descriptions, takeaways, and hydrologic operational relevance.'}</p>
      ${tagsHtml}
      <div class="content-item-footer">
        <a href="${notesLink}" target="_blank" class="btn-notes-link">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width:14px; height:14px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Study Notes
        </a>
        <a href="${art.url}" target="_blank" class="btn-source-link">
          Visit Original
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:12px; height:12px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
    `;

    articlesGrid.appendChild(card);
  });
}

// Generate the bookmarklet string
function getBookmarkletCode(repoPath) {
  return `javascript:(function(){const r='${repoPath}';const u=encodeURIComponent(window.location.href);const t=encodeURIComponent(document.title);window.open('https://github.com/'+r+'/issues/new?title=Add+Article:+'+t+'&body=URL:+'+u+'%0A%0A---%0ASent+via+Agents+%26+Aquifers+bookmarklet.&labels=article','_blank');})();`;
}

// Update bookmarklet links
function updateBookmarklet(repoPath) {
  const code = getBookmarkletCode(repoPath);
  bookmarkletLink.setAttribute('href', code);
}
