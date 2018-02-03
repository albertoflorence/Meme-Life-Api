const googleStorage = require('@google-cloud/storage')
const { FB_PROJECT_ID, FB_BUCKET } = require('../SECRETS')

module.exports = (req, res, next) => {
  const { file } = req
  if (!file) return next()

  const storage = googleStorage({
    projectId: FB_PROJECT_ID,
    keyFilename: './credentials.json'
  })
  const bucket = storage.bucket(FB_BUCKET)

  const extIndex = file.originalname.lastIndexOf('.')
  const ext = file.originalname.slice(extIndex)
  const fileName = new Date().getTime() + ext

  const fileUpload = bucket.file(fileName)

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  })

  stream.on('error', error => {
    next({
      status: 500,
      message: 'Something is wrong! Unable to upload at the moment.',
      error
    })
  })

  stream.on('finish', () => {
    fileUpload.makePublic().then(() => {
      const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      req.file = {
        ...file,
        publicUrl: url
      }
      next()
    })
  })
  stream.end(file.buffer)
}
