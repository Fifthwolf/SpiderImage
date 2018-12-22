let mainForm = $('main-form'),
    submit = $('submit'),
    reset = $('reset'),
    server = $('server');

let data = {
  images: []
};

let ajax = {
  post: (url, data, fn) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
        fn(xhr.responseText);
      }
    };
    xhr.send(data);
  }
}

submit.addEventListener('click', function() {
  ajax.post(server.value, serializeForm(mainForm), result);
});

reset.addEventListener('click', resetEvent);

function resetEvent() {
  data = {};
  submit.disabled = false;
  imagesDown.disabled = true;

  //页面地址栏清空
  pageAddressInput = mainForm.getElementsByClassName('pageAddress');
  for (var i = pageAddressInput.length - 1; i >= 1; i--) {
    mainForm.removeChild(pageAddressInput[i]);
  }

  //结果清空
  resultItem = resultDiv.getElementsByClassName('item');
  for (var i = resultItem.length - 1; i >= 0; i--) {
    resultDiv.removeChild(resultItem[i]);
  }
}

function result(e) {

  console.log(e)

  try {
    var result = JSON.parse(e);
    for (var i of result) {
      for (var index in i.images) {
        data.images.push([i.images[index], i.title]);
      }
      _createDom(i, resultDiv);
    }
    imagesDown.disabled = false;
  } catch (err) {
    console.log(err);
  }

  function _createDom(info, parent) {
    var item = _createElementHaveClass('div', 'item', '', parent)
    _createHead(info, item);
    if (info.title != '无效地址') {
      _createImgwrapper(info, item);
    }

    function _createHead(info, parent) {
      var itemHead = _createElementHaveClass('div', 'item-head', '', parent);
      _createElementHaveClass('p', 'title', info.title, itemHead);
      _createElementHaveClass('a', 'url', '<a href="' + info.url + '">' + info.url + '</a>', itemHead);
    }

    function _createImgwrapper(info, parent) {
      var imgWrapper = _createElementHaveClass('div', 'img-wrapper', '', parent);
      for (var image of info.images) {
        var img = document.createElement('img');
        img.setAttribute('src', image);
        imgWrapper.appendChild(img);
      }
    }

    function _createElementHaveClass(type, className, content, parent) {
      var ele = document.createElement(type);
      ele.setAttribute('class', className);
      ele.innerHTML = content;
      parent.appendChild(ele);
      return ele;
    }
  }
}

function imagesResult(e) {
  if (e == 1) {
    alert('下载成功！');
    imagesDown.innerHTML = '下载成功';
    imagesDown.disabled = false;
    reset.disabled = false;
  }
}

// 序列化页面地址
function serializeForm(form) {
  let url_list = [];

  for (let key in form) {
    if (form.hasOwnProperty(key) && form[key].name != '') {
      switch (form[key].name) {
        case 'pageUrls':
          let urls = form[key].value.split('\n');
          for (let i in urls) {
            url_list.push(urls[i]);
          }
          break;
      }
    }
  }

  return JSON.stringify(url_list);
}

function serializeImages(images) {
  var imagesdata = '';
  for (var i = 0; i < images.length; i++) {
    imagesdata += 'images=' + encodeURIComponent(images[i]) + '&';
  }
  imagesdata += 'path=' + encodeURIComponent(imagesDownAddress.value);
  return imagesdata;
}

function $(id) {
  return document.getElementById(id);
}
