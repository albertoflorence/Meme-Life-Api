const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/')
  },
  filename(req, file, cb) {
    const extIndex = file.originalname.lastIndexOf('.')
    const ext = file.originalname.slice(extIndex)
    cb(null, new Date().getTime() + ext)
  }
})
const upload = multer({ storage })

module.exports = upload
