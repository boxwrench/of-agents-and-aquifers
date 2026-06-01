#!/usr/bin/env python3
import os
import re
import json
import datetime
from urllib.parse import urlparse

def clean_filename(title):
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')

def get_site_name(url):
    domain = urlparse(url).netloc.replace('www.', '').lower()
    if 'vtechworks.lib.vt.edu' in domain:
        return 'Virginia Tech'
    elif 'nature.com' in domain:
        return 'Nature'
    elif 'arxiv.org' in domain:
        return 'arXiv'
    elif 'pubmed.ncbi.nlm.nih.gov' in domain:
        return 'PubMed'
    elif 'doi.org' in domain:
        return 'DOI'
    elif 'nvidia.com' in domain:
        return 'NVIDIA'
    elif 'acs.org' in domain:
        return 'ACS'
    elif 'openai.com' in domain:
        return 'OpenAI'
    elif 'github.com' in domain:
        return 'GitHub'
    elif 'matteovillosio.com' in domain:
        return 'Matteo Villosio'
    elif 'anthropic.com' in domain:
        return 'Anthropic'
    elif 'kdnuggets.com' in domain:
        return 'KDnuggets'
    elif 'huggingface.co' in domain:
        return 'Hugging Face'
    elif 'gitbutler.com' in domain:
        return 'GitButler'
    elif 'veralang.dev' in domain:
        return 'Vera'
    elif 'dbreunig.com' in domain:
        return 'DBreunig'
    elif 'ossature.dev' in domain:
        return 'Ossature'
    elif 'sciencedirect.com' in domain:
        return 'ScienceDirect'
    elif 'academia.edu' in domain:
        return 'Academia'
    elif 'skills.google' in domain or 'cloud.google' in domain or 'google.com' in domain:
        return 'Google'
    else:
        # Fallback to domain name
        parts = domain.split('.')
        if len(parts) > 1:
            return parts[-2].capitalize()
        return domain.capitalize()

def classify_tags(title, url, description):
    title_l = title.lower()
    url_l = url.lower()
    desc_l = description.lower()
    
    # 1. Datasets & Data
    if 'dataset' in title_l or 'dataset' in desc_l or 'bench' in title_l or 'bench' in url_l:
        return ['datasets', 'telemetry' if 'water' in title_l or 'water' in desc_l else 'data']
        
    # 2. Tooling & Harnesses
    if 'github.com' in url_l:
        water_related = 'water' in title_l or 'water' in desc_l or 'utility' in title_l or 'utility' in desc_l
        return ['tooling', 'water' if water_related else 'ai']
        
    if 'gitbutler' in url_l or 'veralang' in url_l or 'ossature' in url_l:
        return ['tooling', 'development']
        
    # 3. Tutorials & Guides
    is_tutorial = (
        'blog' in url_l or 'learn' in url_l or 'course' in url_l or 'training' in url_l or
        'tutorial' in url_l or 'academy' in url_l or 'guide' in url_l or 'skills' in url_l or
        'prompting' in title_l or 'how-to' in url_l or 'problems' in url_l
    )
    if is_tutorial:
        is_water = 'water' in title_l or 'water' in desc_l or 'utility' in title_l or 'utility' in desc_l
        return ['tutorials', 'water' if is_water else 'ai']
        
    # 4. Research & Cases (Default)
    is_water = 'water' in title_l or 'water' in desc_l or 'utility' in title_l or 'utility' in desc_l
    return ['research', 'water' if is_water else 'ai']

def main():
    repo_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_file = os.path.join(repo_dir, 'Collected Water AI Resources.md')
    json_path = os.path.join(repo_dir, 'docs', 'data', 'articles.json')
    
    if not os.path.exists(source_file):
        print(f"Error: Source file {source_file} not found.")
        return
        
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Split content by list markers or ### headers
    items_raw = re.split(r'###\s+\*\*(\d+)\\\.\s*', content)
    
    # First part is header
    header = items_raw[0]
    
    resources = []
    
    for i in range(1, len(items_raw), 2):
        if i + 1 >= len(items_raw):
            break
            
        index = items_raw[i].strip()
        item_body = items_raw[i+1]
        
        # Parse Title (first line of item_body, matching till the end of the line)
        title_line = item_body.split('\n')[0].strip().replace('**', '')
        
        # Parse Link
        link_match = re.search(r'\*\s+\*\*Link:\*\*\s*(.+?)(?:\s+\n|\n|\s*$)', item_body)
        url = link_match.group(1).strip() if link_match else ''
        
        # Parse Description
        desc_match = re.search(r'\*\s+\*\*Description:\*\*\s*(.+?)(?:\s+\n|\n|\s*$)', item_body)
        description = desc_match.group(1).strip() if desc_match else ''
        
        if not url or not title_line:
            continue
            
        # Clean markdown escaping in URL
        url = url.replace('\\_', '_')
        
        resources.append({
            'index': index,
            'title': title_line,
            'url': url,
            'description': description
        })
        
    print(f"Parsed {len(resources)} resources from Collected Water AI Resources.md")
    
    # Load existing articles
    existing_articles = []
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            existing_articles = json.load(f)
            
    # Track existing URLs
    existing_urls = {art['url'] for art in existing_articles}
    
    new_count = 0
    updated_count = 0
    
    for res in resources:
        title = res['title']
        url = res['url']
        description = res['description']
        site_name = get_site_name(url)
        tags = classify_tags(title, url, description)
        
        slug = clean_filename(title)
        if not slug:
            slug = "resource-" + str(res['index'])
            
        md_filename = f"{slug}.md"
        md_relative_path = f"research/{md_filename}"
        md_abs_path = os.path.join(repo_dir, 'research', md_filename)
        
        # Determine publishing date estimate or default to current date
        pub_date = "2026-06-01"
        if "2026" in title or "2026" in description:
            pub_date = "2026-01-01"
        elif "2025" in title or "2025" in description:
            pub_date = "2025-01-01"
        elif "2024" in title or "2024" in description:
            pub_date = "2024-01-01"
            
        # Write notes file if it doesn't already exist
        if not os.path.exists(md_abs_path):
            md_content = f"""# {title}

> [!NOTE]
> **Source:** [{site_name}]({url})  
> **Date Added:** {datetime.date.today().isoformat()}  
> **Published:** {pub_date}

## Summary
{description}

## 💧 Relevance to Of Agents and Aquifers
*Why is this important for water systems, agentic modeling, or utilities?*
- 

## 🤖 Agentic Aspects
*What autonomous or intelligence features does this research touch upon?*
- 

## 📓 Personal Notes & Key Takeaways
- 
"""
            with open(md_abs_path, 'w', encoding='utf-8') as f:
                f.write(md_content)
                
        # Build JSON entry
        article_entry = {
            "title": title,
            "url": url,
            "site_name": site_name,
            "description": description,
            "image": "",
            "date_published": pub_date,
            "date_added": datetime.date.today().isoformat(),
            "notes_file": md_relative_path,
            "tags": tags
        }
        
        if url in existing_urls:
            # Update existing metadata
            for art in existing_articles:
                if art['url'] == url:
                    # Update tags and description if missing
                    art['tags'] = list(set(art.get('tags', []) + tags))
                    art['description'] = description
                    updated_count += 1
                    break
        else:
            existing_articles.append(article_entry)
            new_count += 1
            
    # Write updated JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(existing_articles, f, indent=2, ensure_ascii=False)
        
    print(f"Database updated. Added {new_count} new entries, updated {updated_count} existing entries.")
    
    # Rebuild research/README.md Library Index table
    rebuild_library_index(repo_dir, existing_articles)

def rebuild_library_index(repo_dir, articles):
    readme_path = os.path.join(repo_dir, 'research', 'README.md')
    
    # Sort articles by date_added (descending) and then title
    sorted_articles = sorted(articles, key=lambda x: (x.get('date_added', ''), x.get('title', '')), reverse=True)
    
    table_rows = []
    for art in sorted_articles:
        notes_file = os.path.basename(art['notes_file'])
        row = f"| {art.get('date_added', '')} | [{art['title']}]({art['url']}) | {art['site_name']} | [{notes_file}]({notes_file}) |"
        table_rows.append(row)
        
    readme_content = f"""# Research Library // Of Agents and Aquifers

Welcome to the research library. This folder contains structured markdown notes for articles, academic papers, and essays related to water systems, hydrology, agentic AI, and resource management.

These files are automatically generated when you submit a new link using the automated issue workflow, or you can add them manually.

## 🗂️ Library Index

| Date Added | Title | Source | Notes File |
|---|---|---|---|
""" + "\n".join(table_rows) + """

---

> [!TIP]
> To add a new article automatically:
> 1. Use the **Add Article bookmarklet** in your browser.
> 2. Submit the issue in this repository.
> 3. The GitHub Action will scrape the webpage, update `docs/data/articles.json`, and create a new notes file in this directory.
"""

    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
        
    print("research/README.md library index table rebuilt successfully.")

if __name__ == '__main__':
    main()
