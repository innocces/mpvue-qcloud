// 测试数据库方法
const { mysql } = require('../qcloud')


async function db(ctx,next) {
  await next();
  ctx.body = {code:0,data:{}};
  await mysql('cAppinfo').select('*').then(data=>{ctx.body.data = data;});
}
module.exports = {db};
