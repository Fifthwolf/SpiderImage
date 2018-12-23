# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse

import json, re

from Acfun import views as acfun
from Bilibili import views as bilibili


# Create your views here.
def init(request):
    results = []
    url_list = json.loads(request.body)

    for url in url_list:
        domain = get_attribute(url).get('domain')
        if domain == 'acfun':
            result = acfun.get_article(url)
            results.append(result)
        elif domain == 'bilibili':
            result = bilibili.get_read(url)
            results.append(result)

    return HttpResponse(json.dumps(results, ensure_ascii=False), content_type="application/json,charset=utf-8")

def get_attribute(url):
    regexpMatchs = [{
        'regexp': r'acfun\.cn\/a\/ac\d+',
        'domain': 'acfun',
        'type': 'article'
    }, {
        'regexp': r'bilibili\.com\/read\/cv\d+',
        'domain': 'bilibili',
        'type': 'read'
    }]

    attribute = {
        'domain': 'common',
        'type': None
    }

    for regexpMatch in regexpMatchs:
        if re.search(regexpMatch.get('regexp'), url):
            attribute['domain'] = regexpMatch.get('domain')
            attribute['type'] = regexpMatch.get('type')
            break

    return attribute