---
layout: default
---

# 전체 글 목록

<ul>
{% for doc in site.collections.posts %}
  <li><a href="{{ doc.url | relative_url }}">{{ doc.basename }}</a></li>
{% endfor %}
</ul>


<hr>
<p><b>[디버깅 정보]</b> posts 컬렉션에 포함된 문서 개수: {{ site.collections.posts | size }}</p>
