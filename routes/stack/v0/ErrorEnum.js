let map = new Map([
  [4001, 'login failed']
])

var ee = {}

ee.getPhrase = function(code){
  return map.get(code)
}

module.exports = ee
