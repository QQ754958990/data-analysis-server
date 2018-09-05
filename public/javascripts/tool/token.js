const jwt = require('jsonwebtoken')
const secret = 'shenluotianzheng' //撒盐：加密的时候混淆

module.exports = {
  source_args: {},
  set_token: function (args) {
    //jwt生成token
    const token = jwt.sign(args, secret, {
      expiresIn: 900 //秒到期时间
    })
    return token
  },
  get_args: function (token) {
    //解密token
    var token_obj = null
    jwt.verify(token, secret, function (err, decoded) {
      if (!err) {
        token_obj = decoded
      }
    })
    return token_obj
  },
  validate: function (args) {
    if (!args) return false

    var result = true

    for (var key in this.source_args) {
      if (this.source_args.hasOwnProperty(key)) {
        if (this.source_args[key] !== args[key]) {
          result = false
        }
      }
    }
    return result
  }
}

