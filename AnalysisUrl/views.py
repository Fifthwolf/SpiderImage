# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse

import json

from Acfun import views as acfun


# Create your views here.
def init(request):
    results = []
    json_result = json.loads(request.body)

    for url in json_result:
        if get_attribute(url).get('domain') == 'acfun':
            result = acfun.get_article(url)
            results.append(result)

    return HttpResponse(json.dumps(results, ensure_ascii=False), content_type="application/json,charset=utf-8")

def get_attribute(url):
    attribute = {
        'domain': 'acfun',
        'type': 'article'
    }

    return attribute