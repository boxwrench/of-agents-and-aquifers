#!/usr/bin/env python3
import os
import sys
import re
import json
import datetime
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

def clean_filename(title):
    # Convert to lowercase, replace non-alphanumeric with hyphens
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')

def extract_url(text):
    # Regex to find a URL in the text
    url_match = re.search(r'(https?://[^\s\)]+)', text)
    if url_match:
        return url_match.group(1)
    return None

def scrape_metadata(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    metadata = {
        'title': '',
        'description': '',
        'site_name': '',
        'image': '',
        'date_published': '',
        'url': url
    }
    
    # Parse domain as fallback site name
    parsed_url = urlparse(url)
    metadata['site_name'] = parsed_url.netloc.replace('www.', '')
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        html = response.text
        soup = BeautifulSoup(html, 'lxml')
        
        # 1. Title
        og_title = soup.find('meta', property='og:title') or soup.find('meta', name='twitter:title')
        if og_title and og_title.get('content'):
            metadata['title'] = og_title['content'].strip()
        elif soup.title:
            metadata['title'] = soup.title.string.strip()
        else:
            h1 = soup.find('h1')
            if h1:
                metadata['title'] = h1.text.strip()
            else:
                metadata['title'] = metadata['site_name'] + " Article"
                
        # 2. Description
        og_desc = (soup.find('meta', property='og:description') or 
                   soup.find('meta', name='description') or 
                   soup.find('meta', name='twitter:description'))
        if og_desc and og_desc.get('content'):
            metadata['description'] = og_desc['content'].strip()
            
        # 3. Site Name
        og_site = soup.find('meta', property='og:site_name')
        if og_site and og_site.get('content'):
            metadata['site_name'] = og_site['content'].strip()
            
        # 4. Image
        og_img = soup.find('meta', property='og:image') or soup.find('meta', name='twitter:image')
        if og_img and og_img.get('content'):
            metadata['image'] = og_img['content'].strip()
            
        # 5. Date Published
        date_meta = (soup.find('meta', property='article:published_time') or
                     soup.find('meta', itemprop='datePublished') or
                     soup.find('meta', name='pubdate') or
                     soup.find('meta', name='publish-date'))
        if date_meta and date_meta.get('content'):
            try:
                # Standardize date format (YYYY-MM-DD)
                raw_date = date_meta['content'].split('T')[0]
                datetime.date.fromisoformat(raw_date) # validate
                metadata['date_published'] = raw_date
            except Exception:
                metadata['date_published'] = date_meta['content']
                
    except Exception as e:
        print(f"Warning: Failed to scrape {url}. Error: {e}", file=sys.stderr)
        metadata['title'] = metadata['title'] or (metadata['site_name'] + " Link")
        
    return metadata

def main():
    # Read issue body from env variable (GitHub Actions passes it)
    issue_body = os.environ.get('ISSUE_BODY', '')
    issue_labels_raw = os.environ.get('ISSUE_LABELS', '')
    
    if not issue_body:
        # For local testing, read from file if passed
        if len(sys.argv) > 1:
            try:
                with open(sys.argv[1], 'r') as f:
                    issue_body = f.read()
            except Exception as e:
                print(f"Error reading file {sys.argv[1]}: {e}")
                sys.exit(1)
        else:
            print("Error: No input provided via ISSUE_BODY env variable or arguments.")
            sys.exit(1)
            
    url = extract_url(issue_body)
    if not url:
        print("Error: No URL found in the issue body.")
        print("Please ensure the issue contains a valid URL starting with http:// or https://")
        sys.exit(1)
        
    print(f"Processing URL: {url}")
    
    # Parse tags from labels
    tags = []
    if issue_labels_raw:
        # Split comma separated labels and clean them
        labels = [l.strip().lower() for l in issue_labels_raw.split(',') if l.strip()]
        # Ignore workflow trigger label 'article' or 'add-article'
        tags = [l for l in labels if l not in ('article', 'add-article', 'add article')]
    
    # Scrape web page
    metadata = scrape_metadata(url)
    title = metadata['title']
    description = metadata['description']
    site_name = metadata['site_name']
    image = metadata['image']
    date_pub = metadata['date_published'] or datetime.date.today().isoformat()
    
    # Prepare Slug and Filename
    slug = clean_filename(title)
    if not slug:
        slug = "article-" + str(int(datetime.datetime.now().timestamp()))
        
    md_filename = f"{slug}.md"
    md_relative_path = f"research/{md_filename}"
    md_abs_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'research', md_filename)
    
    # Create the markdown notes file
    print(f"Creating notes file: {md_relative_path}")
    md_content = f"""# {title}

> [!NOTE]
> **Source:** [{site_name}]({url})  
> **Date Added:** {datetime.date.today().isoformat()}  
> {"**Published:** " + date_pub if date_pub else ""}

## Summary
{description if description else "*No summary scraped. Add your notes here.*"}

## 💧 Relevance to Of Agents and Aquifers
*Why is this important for water systems, agentic modeling, or aquifer management?*
- 

## 🤖 Agentic Aspects
*What autonomous or intelligence features does this research touch upon?*
- 

## 📓 Personal Notes & Key Takeaways
- 
"""
    
    # Write the markdown file
    with open(md_abs_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
        
    # Update docs/data/articles.json
    json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docs', 'data', 'articles.json')
    articles = []
    
    if os.path.exists(json_path):
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                articles = json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load existing articles.json: {e}. Reinitializing.", file=sys.stderr)
            
    # Check if URL already exists to avoid duplicates
    existing_article = None
    for art in articles:
        if art.get('url') == url:
            existing_article = art
            break
            
    new_article_entry = {
        "title": title,
        "url": url,
        "site_name": site_name,
        "description": description,
        "image": image,
        "date_published": date_pub,
        "date_added": datetime.date.today().isoformat(),
        "notes_file": md_relative_path,
        "tags": tags
    }
    
    if existing_article:
        print(f"Article already exists. Updating metadata.")
        existing_article.update(new_article_entry)
    else:
        print(f"Adding new article entry to JSON.")
        articles.insert(0, new_article_entry) # Add to the top
        
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
        
    # Write GitHub Action outputs
    # Using GITHUB_OUTPUT environment file if available
    github_output = os.environ.get('GITHUB_OUTPUT')
    if github_output:
        with open(github_output, 'a') as f:
            f.write(f"article_title={title}\n")
            f.write(f"notes_path={md_relative_path}\n")
            f.write(f"slug={slug}\n")
            
    # Print final markdown statement (will be used to reply on the issue)
    print("\n--- ACTION OUTPUT FOR GITHUB COMMENT ---")
    print(f"### 🎉 Article Successfully Added!")
    print(f"**Title:** [{title}]({url})  ")
    print(f"**Source:** {site_name} | **Date:** {date_pub}  ")
    print(f"**Notes File:** [{md_filename}](../blob/main/research/{md_filename})  ")
    if tags:
        print(f"**Tags:** {', '.join([f'`{t}`' for t in tags])}")
    print("\nNext, edit the research notes file to add water/agentic insights!")

if __name__ == '__main__':
    main()
