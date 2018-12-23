# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse

from bs4 import BeautifulSoup

from HtmlParser import views as htmlParser

# Create your views here.
def get_article(url):
    images = []

    html_cont = htmlParser.download(url)
    soup = BeautifulSoup(html_cont, 'html.parser', from_encoding='utf-8')
    title = soup.find('div', {"class": "art-title-head"}).find('div', {"class": "caption"}).get_text()
    images_list = soup.find('div', {"class": "article-content"}).find_all('img')
    for image in images_list:
        images.append(image['src'])

    result = {
        'domain': 'acfun',
        'type': 'article',
        'title': title,
        'url': url,
        'images': images
    }

    return result