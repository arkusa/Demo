# README

## Struct

模拟HTTP/1.1和HTTP/2由于并发导致同一个请求的响应并不总是有序的

以及一个解决思路

## Install

```shell
git clone ${url} --depth=1

npm install

npm start

# 开启2个chrome tab
# http://localhost:8001
# https://localhost
```

## Fix

只是一个思路需要完善

```javascript
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
```
