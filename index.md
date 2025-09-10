---
layout: default
title: Home
---

<div class="hero">
    <div class="container">
        <h1>Research & Development</h1>
        <p>Time-Sensitive Networking | AI/ML | Embedded Systems</p>
    </div>
</div>

<div class="container">
    <h2>Recent Posts</h2>
    
    <ul class="post-list">
        {% for post in site.posts limit:10 %}
        <li class="post-item">
            <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
            <div class="post-meta">
                <time datetime="{{ post.date | date_to_xmlschema }}">
                    <i class="far fa-calendar"></i> {{ post.date | date: "%Y년 %m월 %d일" }}
                </time>
            </div>
            <div class="post-excerpt">
                {{ post.excerpt | strip_html | truncate: 200 }}
            </div>
            {% if post.tags %}
            <div class="post-tags">
                {% for tag in post.tags %}
                <span class="tag">{{ tag }}</span>
                {% endfor %}
            </div>
            {% endif %}
        </li>
        {% endfor %}
    </ul>
</div>
