# 글 목록

<ul>
{% for file in site.static_files %}
  {% if file.path contains '/posts/' and file.extname == '.md' %}
    <li>
      <a href="{{ file.url | relative_url }}">{{ file.basename }}</a>
    </li>
  {% endif %}
{% endfor %}
</ul>
