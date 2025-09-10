# 글 목록

<ul>
{% for file in site.static_files %}
  {% if file.path contains '/posts/' and file.extname == '.md' %}
    {% assign post_url = file.path | remove_first: '/' | replace: '.md', '.html' %}
    <li>
      <a href="{{ post_url | relative_url }}">{{ file.basename }}</a>
    </li>
  {% endif %}
{% endfor %}
</ul>
