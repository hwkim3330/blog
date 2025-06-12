---
layout: default
---

# 전체 글 목록

<ul>
{% for doc in site.articles %}
  <li><a href="{{ doc.url | relative_url }}">{{ doc.basename }}</a></li>
{% endfor %}
</ul>

<hr>
<p><b>[디버깅 정보]</b> articles 컬렉션에 포함된 문서 개수: {{ site.articles | size }}</p>
```*   `site.posts` 가 아니라 `site.articles` 로 변경했습니다.

---

### 최종 요약

1.  **폴더 이름 변경**: `posts` → `_articles`
2.  **`_config.yml` 수정**: `collections`와 `defaults` 설정을 `articles`용으로 변경
3.  **`index.md` 수정**: 목록을 만드는 코드가 `site.articles`를 보도록 변경

이제 1~2분 기다린 후 블로그 페이지를 새로고침 해보세요. 디버깅 정보에 문서 개수가 `3`으로 표시되고, 그 위에 파일명으로 된 글 목록 3개가 링크와 함께 나타날 겁니다.

여러 번 번거롭게 해드려서 정말 죄송합니다. 이번에는 제가 틀릴 리 없습니다.
