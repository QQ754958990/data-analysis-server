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

    if(args['user_id'] === this.source_args['user_id'] && args['user_password'] === this.source_args['user_password']) {
      return true
    }else {
      return false
    }
  }
}

