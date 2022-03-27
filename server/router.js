const express = require("express");
const router = express.Router();
//引入数据模型模块
const jwtAuth = require("./jwt")
const controller = require('./controller/index')

router.use(jwtAuth)

// 中间件
router.use((req, res, next) => {
	console.log('url', req.path)
	// 如果url包含“add”，就添加一个创建时间
	if (req.path.includes('/add')) {
		req.body.createAt = +new Date()
	}
	next()
})


router.post("/audit/add", controller.audit.add)
router.post("/audit/del", controller.audit.del)
router.get("/audit/list", controller.audit.list);
router.post("/audit/fastReject", controller.audit.fastReject);

router.get("/index", controller.nav.index)
router.post("/nav/add", controller.nav.add)
router.post("/nav/del", controller.nav.del)
router.post("/nav/edit", controller.nav.edit)
router.post("/nav/find", controller.nav.info)

router.post("/category/add", controller.category.add)
router.post("/category/del", controller.category.del)
router.post("/category/edit", controller.category.edit)
router.get("/category/list", controller.category.list)

router.post("/login", controller.user.login)


// 处理 404
router.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 处理500
router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      code: 401,
      message: 'invalid token',
      data: err
    });
  } else {
    res.status(err.status || 500).json({
      code: err.status || 500,
      message: err.message,
      data: err
    });
  }
});

module.exports = router;