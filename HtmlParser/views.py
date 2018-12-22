# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

import urllib2

# Create your views here.
def download(url):
    req = urllib2.Request(url)  
    req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36 Maxthon/5.1.5.2000")
    req.add_header("GET", url)
    req.add_header("Referer", url)
    response = urllib2.urlopen(req)

    if response.getcode() != 200:
        return None

    return response.read()