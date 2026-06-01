// Configuration & State
let articles = [];
let activeTag = 'all';
let searchQuery = '';

// DOM Elements
const searchInput = document.getElementById('search-input');
const tagsContainer = document.getElementById('tags-list');
const articlesGrid = document.getElementById('articles-grid');
const resultsCount = document.getElementById('results-count');
const repoInput = document.getElementById('repo-input');
const bookmarkletLink = document.getElementById('bookmarklet-link');
const copyBookmarkletBtn = document.getElementById('copy-bookmarklet');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load saved Repo Path or default
  const defaultRepo = 'boxwrench/of-agents-and-aquifers';
  const savedRepo = localStorage.getItem('oa_repo_path') || defaultRepo;
  repoInput.value = savedRepo;
  
  // Set initial bookmarklet links
  updateBookmarklet(savedRepo);
  
  // Fetch articles from the JSON database
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
});

// Fetch Articles
async function fetchArticles() {
  try {
    const response = await fetch('data/articles.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch articles JSON: ${response.status}`);
    }
    articles = await response.json();
    populateTags();
    filterAndRender();
  } catch (error) {
    console.error('Error fetching articles data:', error);
    articlesGrid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p>Failed to load articles database.</p>
        <p style="font-size:0.85rem; margin-top:0.5rem; color:var(--text-muted);">${error.message}</p>
      </div>
    `;
  }
}

// Generate unique tags list
function populateTags() {
  const tagsSet = new Set();
  articles.forEach(art => {
    if (art.tags && Array.isArray(art.tags)) {
      art.tags.forEach(tag => tagsSet.add(tag));
    }
  });

  // Rebuild tags list UI
  tagsContainer.innerHTML = '';
  
  // "All" button
  const allBtn = document.createElement('button');
  allBtn.className = 'tag-btn active';
  allBtn.textContent = 'All Articles';
  allBtn.addEventListener('click', () => selectTag('all', allBtn));
  tagsContainer.appendChild(allBtn);

  // Individual tag buttons
  Array.from(tagsSet).sort().forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn';
    btn.textContent = tag;
    btn.addEventListener('click', () => selectTag(tag, btn));
    tagsContainer.appendChild(btn);
  });
}

// Handle Tag selection
function selectTag(tag, buttonElement) {
  activeTag = tag;
  
  // Update active state in UI
  document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
  buttonElement.classList.add('active');
  
  filterAndRender();
}

// Filter and Render Cards
function filterAndRender() {
  const filtered = articles.filter(art => {
    // 1. Tag filter
    const matchesTag = activeTag === 'all' || (art.tags && art.tags.includes(activeTag));
    
    // 2. Search text filter
    const titleMatch = art.title && art.title.toLowerCase().includes(searchQuery);
    const descMatch = art.description && art.description.toLowerCase().includes(searchQuery);
    const siteMatch = art.site_name && art.site_name.toLowerCase().includes(searchQuery);
    const tagsMatch = art.tags && art.tags.some(t => t.toLowerCase().includes(searchQuery));
    const matchesSearch = !searchQuery || (titleMatch || descMatch || siteMatch || tagsMatch);
    
    return matchesTag && matchesSearch;
  });

  renderArticles(filtered);
}

// Render filtered cards into grid
function renderArticles(list) {
  articlesGrid.innerHTML = '';
  resultsCount.textContent = `Showing ${list.length} of ${articles.length} articles`;

  if (list.length === 0) {
    articlesGrid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <p>No articles found matching your criteria.</p>
      </div>
    `;
    return;
  }

  // Detect correct Link Path (GitHub Pages blob vs local offline file)
  const isLocal = window.location.protocol === 'file:' || 
                  window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';
  
  let baseRepoUrl = '';
  if (!isLocal) {
    // We are on github pages: extract repo owner & name
    const parts = window.location.pathname.split('/');
    const owner = window.location.hostname.split('.')[0];
    const repo = parts[1] || 'of-agents-and-aquifers';
    baseRepoUrl = `https://github.com/${owner}/${repo}/blob/main/`;
  } else {
    baseRepoUrl = '../';
  }

  list.forEach(art => {
    const card = document.createElement('article');
    card.className = 'article-card';

    // Image section
    let imgHtml = '';
    if (art.image) {
      imgHtml = `<img src="${art.image}" alt="${art.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
    }
    
    // Fallback/Placeholder SVG (Water drop theme)
    const placeholderHtml = `
      <div class="card-img-placeholder" style="${art.image ? 'display:none;' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a2.25 2.25 0 00-2.013-1.241H13.75a2.25 2.25 0 00-2.25 2.25v.341c0 .29-.073.577-.213.83l-1.02 2.039a2.25 2.25 0 01-2.012 1.244H5.25A2.25 2.25 0 003 16.5v.682c0 .396.078.786.23 1.15l1.08 2.583a2.25 2.25 0 002.076 1.385h9.75a2.25 2.25 0 002.196-1.74l.914-3.657a2.25 2.25 0 00-.363-1.928zM12 3c-1.2 0-2.4 1.5-3 3 .6 1.8 1.8 3.5 3 4.5 1.2-1 2.4-2.7 3-4.5-.6-1.5-1.8-3-3-3z" />
        </svg>
      </div>
    `;

    // Tags list html
    let tagsHtml = '';
    if (art.tags && art.tags.length > 0) {
      tagsHtml = `<div class="card-tags">` + 
                 art.tags.map(t => `<span class="card-tag">${t}</span>`).join('') + 
                 `</div>`;
    }

    // Resolve Notes Link
    const notesLink = baseRepoUrl + art.notes_file;

    card.innerHTML = `
      ${imgHtml}
      ${placeholderHtml}
      <div class="card-body">
        <div class="meta-row">
          <span class="site-source">${art.site_name || 'Web'}</span>
          <span>${art.date_published || art.date_added || ''}</span>
        </div>
        <h3 class="card-title">${art.title}</h3>
        <p class="card-desc">${art.description || 'No description available. Check the notes file for detailed information.'}</p>
        ${tagsHtml}
        <div class="card-footer">
          <a href="${notesLink}" target="_blank" class="btn-read-notes">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:16px; height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Study Notes
          </a>
          <a href="${art.url}" target="_blank" class="btn-original-link">
            Visit Article
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:14px; height:14px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    `;

    articlesGrid.appendChild(card);
  });
}

// Generate the bookmarklet string
function getBookmarkletCode(repoPath) {
  return `javascript:(function(){const r='${repoPath}';const u=encodeURIComponent(window.location.href);const t=encodeURIComponent(document.title);window.open('https://github.com/'+r+'/issues/new?title=Add+Article:+'+t+'&body=URL:+'+u+'%0A%0A---%0ASent+via+Agents+%26+Aquifers+bookmarklet.&labels=article','_blank');})();`;
}

// Update bookmarklet href & details
function updateBookmarklet(repoPath) {
  const code = getBookmarkletCode(repoPath);
  bookmarkletLink.setAttribute('href', code);
}
