/* eslint-disable */

class RequestQueue {
  constructor(...argvs) {
    this.chain = Promise.resolve();
  }

  push(request) {
    this.handler(request);
  }

  handler(request) {
    const { queue = [], ret } = request;

    this.chain = this.chain
      .then(() => ret.then(value => value))
      .then(value => queue.reduce((prevRet, current) => current(prevRet), value));
  }
}

// 为了保证不更改请求API, 这里需要做Promise API的粘合剂
class RequestRet {
  constructor(ret, queue = []) {
    this.ret = ret;
    this.queue = [];
  }

  then(callback) {
    this.queue.push(callback);

    return this;
  }
}

function requestFactory(request) {
  const queue = new RequestQueue();

  return function(...argvs) {
    const ret = new RequestRet(request(...argvs));

    queue.push(ret);

    return ret;
  }
}

  // axios.get('update/count', { params: { count: 0 } })
  // axios.get('update/count', { params: { count: 1 } })
  // axios.get('update/count', { params: { count: 2 } })
  // axios.get('update/count', { params: { count: 3 } })
  // axios.get('update/count', { params: { count: 4 } })
  // axios.get('update/count', { params: { count: 5 } })
  // axios.get('update/count', { params: { count: 6 } })
  // axios.get('update/count', { params: { count: 7 } })
  // axios.get('update/count', { params: { count: 8 } })

document.addEventListener('DOMContentLoaded', function() {

  function bindHanderlSection() {
    const count = document.querySelector('#handler .count');
    const responseCount = document.querySelector('#handler .response_count');
    const button = document.querySelector('#handler .button');

    let countText = 0;
    let responseCountText = 0;

    count.innerText = countText;
    responseCount.innerText = responseCountText;

    request = requestFactory(axios.get);

    button.addEventListener('click', clickHandler);

    function clickHandler() {
      countText += 1; 

      count.innerText = countText;

      request('update/count', { params: { count: countText } })
        .then(res => {
          responseCount.innerText = res.data.count;
        });
    };
  }

  function bindUnHandlerSection() {
    const count = document.querySelector('#un_handler .count');
    const responseCount = document.querySelector('#un_handler .response_count');
    const button = document.querySelector('#un_handler .button');

    let countText = 0;
    let responseCountText = 0;

    count.innerText = countText;
    responseCount.innerText = responseCountText;

    button.addEventListener('click', clickHandler);

    function clickHandler() {
      countText += 1; 

      count.innerText = countText;

      axios.get('update/count', { params: { count: countText } })
        .then(res => {
          responseCount.innerText = res.data.count;
        });
    };
  }

  bindHanderlSection();
  bindUnHandlerSection();
});
