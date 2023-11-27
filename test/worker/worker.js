onmessage = async function (event) {
  console.log('worker接手消息', event.data.info)
  let info = 'worker-info'
  let asyncInfo = await asyncFunc()
  postMessage({ asyncInfo })
}

function asyncFunc() {
  return new Promise(reslove => {
    setTimeout(() => {
      reslove('worker-async-info')
    }, 2000)
  })
}
