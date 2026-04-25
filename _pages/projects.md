---
layout: page
title: use cases
permalink: /use-cases/
description: Example application areas for NatureDesk.
nav: true
nav_order: 2
horizontal: true
---

<div class="projects">
{% assign sorted_projects = site.projects | sort: "importance" %}
<div class="container">
  <div class="row row-cols-1 row-cols-md-2">
  {% for project in sorted_projects %}
    {% include projects_horizontal.liquid %}
  {% endfor %}
  </div>
</div>
</div>
