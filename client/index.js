let mainForm = $('main-form'),
    submitButton = $('submit'),
    resetButton = $('reset'),
    downloadButton = $('download'),
    resultDiv = $('result'),
    serverInput = $('server');

let images_list = [];

let ajax = {
  post: (url, data, fn) => {
    let xhr = new XMLHttpRequest();
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

submitButton.addEventListener('click', () => {
  resetEvent();
  ajax.post(`${serverInput.value}analysis/`, serializeForm(mainForm), generateResult);
});

resetButton.addEventListener('click', resetEvent);

downloadButton.addEventListener('click', () => {
  let data = JSON.stringify(images_list);
  ajax.post(`${serverInput.value}download/`, data, generateDownload);
});

function resetEvent() {
  images_list = [];

  //页面地址栏清空
  pageAddressInput = mainForm.getElementsByClassName('pageAddress');
  for (let i = pageAddressInput.length - 1; i >= 1; i--) {
    mainForm.removeChild(pageAddressInput[i]);
  }

  //结果清空
  resultItem = resultDiv.getElementsByClassName('item');
  for (let i = resultItem.length - 1; i >= 0; i--) {
    resultDiv.removeChild(resultItem[i]);
  }
}

// 创建结果列表
function generateResult(e) {
  try {
    let result = JSON.parse(e);
    for (let i of result) {
      for (let index in i.images) {
        // 当前所有图片信息
        images_list.push({
          title: i.title,
          url: i.images[index]
        });
      }
      _createDom(i, resultDiv);
    }
  } catch (err) {
    console.log(err);
  }

  function _createDom(info, parent) {
    let item = _createElementHaveClass('div', 'item', '', parent);

    _createHead(info, item);

    if (info.title != '无效地址') {
      _createImgWrap(info, item);
    }

    function _createHead(info, parent) {
      let itemHead = _createElementHaveClass('div', 'item-head', '', parent);
      _createElementHaveClass('p', 'title', info.title, itemHead);
      _createElementHaveClass('a', 'url', '<a target="_blank" href="' + info.url + '">' + info.url + '</a>', itemHead);
    }

    function _createImgWrap(info, parent) {
      let imgWrap = _createElementHaveClass('div', 'img-wrapper', '', parent);

      for (let image of info.images) {
        let img = document.createElement('img');
        img.setAttribute('src', image);
        imgWrap.appendChild(img);
      }
    }

    function _createElementHaveClass(type, className, content, parent) {
      let ele = document.createElement(type);
      ele.setAttribute('class', className);
      ele.innerHTML = content;
      parent.appendChild(ele);
      return ele;
    }
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

// 生成下载按钮
function generateDownload(e) {
  console.log(e)
}

function $(id) {
  return document.getElementById(id);
}
