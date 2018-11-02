let map = new Map([
  [4001, 'login failed'],
  [4002, 'you are missing?!']
])

var ee = {}

ee.getPhrase = function(code){
  return map.get(code)
}

module.exports = ee
