let map = new Map([
  [4001, 'login failed'],
  [4002, 'you are missing?!'],
  [5001, 'failed to init captcha...'],
  [5002, 'captcha expired, retry please'],
])

var ee = {}

ee.getPhrase = function(code){
  return map.get(code)
}

module.exports = ee
