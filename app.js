const express = require('express')
const router = require('./router/index')
const session = require('express-session')
const app = express()
const port = 3000


app.set("view engine", "ejs")
app.use(express.static('images'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'super secret information',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})