import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'

//There's a lot of code commented out, it's for our stretch goal to upload profile picture, hence
//it's not deleted and just commented out. Will be cleaned up as soon as we get it to work.

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/authAPI'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex'),
  },
  // profilePic: {
  //   name: String,
  //   desc: String,
  //   img: {
  //     data: Buffer,
  //     contentType: String,
  //   },
  // },
})

const User = mongoose.model('User', UserSchema)

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.set('view engine', 'ejs')

// const multer = require('multer')
// const imgModel = require('./model')

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now())
//   },
// })

// const upload = multer({ storage: storage })

// Lägg till origin domain

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization')
  try {
    const user = await User.findOne({ accessToken })
    if (user) {
      next()
    } else {
      res.status(401).json({ response: 'Please log in', success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
}

// When user is authenticated they are directed to this endpoint
app.get('/home', authenticateUser)
app.get('/home', (req, res) => {
  res.json('Hello world')

  // User.find({}, (err, items) => {
  //   if (err) {
  //     console.log(err)
  //     res.status(500).send('An error occurred', err)
  //   } else {
  //     res.render('imagesPage', { items: items })
  //   }
  // })
})

// app.post('/home', upload.single('image'), (req, res, next) => {
//   const obj = new User({
//     img: {
//       data: obj.fs.readFileSync(
//         path.join(__dirname + '/uploads/' + req.file.filename)
//       ),
//       contentType: 'image/png',
//     },
//   })
//   const obj = {
//     img: {
//       data: fs.readFileSync(
//         path.join(__dirname + '/uploads/' + req.file.filename)
//       ),
//       contentType: 'image/png',
//     },
//   }
//   User.create(obj, (err, item) => {
//     if (err) {
//       console.log(err)
//     } else {
//       // item.save();
//       res.redirect('/home')
//     }
//   })
// })

app.post('/signup', async (req, res) => {
  const { username, password } = req.body

  try {
    const salt = bcrypt.genSaltSync()

    if (password.length < 5) {
      throw 'Password must be at least 5 characters long'
    }

    const newUser = await new User({
      username,
      password: bcrypt.hashSync(password, salt),
    }).save()

    res.status(201).json({
      response: {
        userId: newUser._id,
        username: newUser.username,
        accessToken: newUser.accessToken,
      },
      success: true,
    })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.post('/signin', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        response: {
          userId: user._id,
          username: user.username,
          accessToken: user.accessToken,
        },
        success: true,
      })
    } else {
      res.status(404).json({
        response: 'Username or password does not match',
        success: false,
      })
    }
  } catch (error) {
    res.status(404).json({ response: error, success: false })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
