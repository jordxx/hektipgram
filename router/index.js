const Controller = require("../controller/user")
const router = require("express").Router()
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.get("/", Controller.login)
router.post("/", Controller.postLogin)

router.get("/register", Controller.register)
router.post("/register", Controller.postRegister)

router.use((req, res, next) => {
    if (!req.session.userId) {
        const err = "LOGIN DULU!"
        return res.redirect((`/?err=${err}`))
    } else {
        next()
    }
})

router.get("/admin", Controller.admin)
router.get("/home", Controller.home)
router.get("/post", Controller.addPost)
router.get("/profile", Controller.profile)
router.post("/post", upload.single("imageUrl"), Controller.postAddPost)
router.get("/logout", Controller.logout)
router.get("/profile/edit/:id", Controller.editProfile)
router.post("/profile/edit/:id", Controller.postProfile)
router.get("/comment/:PostId", Controller.commentSection)
router.post("/comment/:PostId/:userId", Controller.addCommentPostId)
router.get('/post/:id/edit', Controller.editPost)
router.post('/post/:id/edit', Controller.postEditPost)
router.get('/post/:id/delete', Controller.deletePost)
router.get("/user/:id/delete", Controller.deleteUser)

module.exports = router