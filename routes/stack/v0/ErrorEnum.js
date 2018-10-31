let map = new Map([
  [4001, '登陆失败']
])

var ee = {}

ee.getPhrase = function(code){
  return map.get(code)
}

module.exports = ee
