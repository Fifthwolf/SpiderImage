# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse

from bs4 import BeautifulSoup

from HtmlParser import views as htmlParser

# Create your views here.
def get_read(url):
    images = []

    html_cont = htmlParser.download(url)
    soup = BeautifulSoup(html_cont, 'html.parser', from_encoding='utf-8')
    title = soup.find('div', {"class": "head-container"}).find('h1', {"class": "title"}).get_text()
    images_list = soup.find('div', {"class": "article-holder"}).find_all('img')
    for image in images_list:
        images.append('http:' + image['data-src'])

    result = {
        'domain': 'bilibili',
        'type': 'read',
        'title': title,
        'url': url,
        'images': images
    }

    return result