const { User, Profile, Post, Comment, Tag } = require("../models")
const bcrypt = require('bcryptjs')
const { timeSince } = require("../helper/helper")
const { Op } = require("sequelize")

class Controller {
    static register(req, res) {
        res.render('register')
    }

    static postRegister(req, res) {
        const { fullName, gender, dateOfBirth, userName, email, password } = req.body
        User.create({ userName, email, password })
            .then(user => {
                return Profile.create({ fullName, gender, dateOfBirth, UserId: user.id })
            })
            .then(userProfile => {
                res.redirect(`/`)
            })
            .catch(err => {
                res.send(err)
            })
    }

    static login(req, res) {
        res.render('login', { error: req.query.err })
    }

    static postLogin(req, res) {
        const { email, password } = req.body
        const inv = `invalid credentials`
        User.findOne({ where: { email } })
            .then(user => {
                if (user && user.length !== 0) {
                    if (bcrypt.compareSync(password, user.password)) {
                        req.session.userId = user.id;
                        req.session.role = user.role
                        if (req.session.role === false) return res.redirect('/home')
                        else return res.redirect('/admin')
                    } else {
                        return res.redirect(`/?err=${inv}`)
                    }
                } else {
                    return res.redirect(`/?err=${inv}`)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }

    static admin(req, res) {
        res.send('ok')
    }


    static home(req, res) {
        const search = req.query.search
        let param = {
            include: { all: true, nested: true },
            order: [["createdAt", "desc"]],
            where: {}
        }
        //res.send(post[0].User.userName)
        if (search) {
            param.where = {
                ...param.where,
                [Op.or]: [
                    {
                        caption: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                ]
            }
        }

        Post.findAll(param)
            .then(post => {
                res.render('home', { post, timeSince })
            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })

    }

    static addPost(req, res) {
        Tag.findAll()
            .then(tag => {
                res.render('add-post', { user: req.session.userId, tag })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static postAddPost(req, res) {
        let { TagId, UserId, caption } = req.body
        Post.create({ caption, imageUrl: req.file.path, like: 0, UserId, TagId })
            .then((_) => {
                res.redirect('/home')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static commentSection(req, res) {
        const id = +req.params.PostId
        const userId = req.session.userId
        Post.findByPk(id, { include: { all: true, nested: true } })
            .then(post => {
                res.render('post-comment', { post, timeSince, UserId: userId })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static likePost(req, res) {
        const id = +req.params.id
        Post.increment("like", { by: 1, where: { id: id } })
            .then(post => {
                res.redirect("/home")
            })
            .catch(err => {
                res.send(err)
            })
    }

    static unlikePost(req, res) {
        const id = +req.params.id
        Post.decrement("like", { by: 1, where: { id: id } })
            .then(post => {
                res.redirect("/home")
            })
            .catch(err => {
                res.send(err)
            })
    }

    static profile(req, res) {
        User.findByPk(+req.session.userId, { include: { all: true } })
            .then(user => {
                res.render('profile', { user })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static editProfile(req, res) {
        Profile.findByPk(+req.params.id, { include: User })
            .then(profile => {
                res.render('edit-profile', { profile })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static postProfile(req, res) {
        let { fullName, gender, dateOfBirth, UserId, userName, email } = req.body
        Profile.update({ fullName, gender, dateOfBirth, UserId }, { where: { id: +req.params.id } })
            .then((_) => {
                return User.update({ userName, email }, { where: { id: +UserId } })
            })
            .then((_) => {
                res.redirect('/profile')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static addCommentPostId(req, res) {
        const { PostId, userId } = req.params
        const { comment } = req.body
        Comment.create({ comment, PostId, UserId: userId })
            .then(result => {
                res.redirect(`/comment/${PostId}`)
            })
            .catch(err => {
                res.send(err)
            })
    }

    static editPost(req, res) {
        const id = +req.params.id
        let tag;
        Tag.findAll()
            .then(tags => {
                tag = tags;
                return Post.findByPk(id)
            })
            .then(post => {
                res.render("editPost", { tag, post })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static postEditPost(req, res) {
        const id = +req.params.id
        const { TagId, UserId, caption } = req.body
        Post.update({ TagId, UserId, caption }, { where: { id: id } })
            .then(result => {
                res.redirect(`/comment/${id}`)
            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })
    }

    static deletePost(req, res) {
        const postId = +req.params.id
        Post.findByPk(postId)
            .then(post => {
                if (post.UserId !== req.session.userId) {
                    res.redirect("/home")
                } else {
                    return Post.destroy({ where: { id: postId } })
                }
            })
            .then(result => {
                res.redirect("/home")
            })
            .catch(err => {
                res.send(err)
            })
    }

    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) return res.send(err)
            else return res.redirect('/')
        })
    }

    static admin(req, res) {

        User.findAll({ include: { all: true } })
            .then(user => {
                // res.send(user)
                res.render("deleteUser", { user, timeSince })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static deleteUser(req, res) {
        const id = +req.params.id
        if (req.session.role === false) {
            throw "anda bukan admin"
        }

        User.findByPk(id)
            .then(user => {
                if (!user || user.length === 0) {
                    throw "User not found"
                }
                return Profile.destroy({ where: { UserId: id } })
            })
            .then(result => {
                return Post.destroy({ where: { UserId: id } })
            })
            .then(result => {
                return User.destroy({ where: { id: id } })
            })
            .then(result => {
                res.redirect("/admin")
            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })
    }

}

module.exports = Controller