const express = require('express')
const router = express.Router()
const fetchAdmin = require('../middleware/fetchadmin')
const Post = require('../models/post')
const Portfolio = require('../models/portfolio')

const CLOUDINARY_CLOUD_NAME = 'jvwuwauz'
const CLOUDINARY_UPLOAD_PRESET = 'for_migration'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const isMigratedCloudinaryUrl = (url) => (
  typeof url === 'string' && url.includes(`res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/`)
)

const uploadImageToCloudinary = async (imageUrl) => {
  const formData = new FormData()
  formData.append('file', imageUrl)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  console.log('fetch request started')

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData
  })
  console.log('fetch request finished')

  const data = await response.json()
  console.log(data)

  if (!response.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  return data.secure_url || data.url
}

const getCloudinaryFetchUrl = (imageUrl) => (
  `https://res.cloudinary.com/jvwuwauz/image/fetch/q_60/w_1000/h_1000/${imageUrl}`
)

const slugify = (s = '') => s.toString().toLowerCase().trim()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-')

// Create post (admin)
router.post('/', fetchAdmin, async (req, res) => {
  try {
    const { metaTitle, metaDescription, title, category, image, description, date } = req.body
    const slug = slugify(metaTitle || title || '')
    const post = await Post.create({ slug, metaTitle, metaDescription, title, category, image, description, date })
    res.status(201).json(post)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to create post' })
  }
})

// Get all posts
router.get('/', async (_req, res) => {
  try {
    const posts = await Post.find({}).sort({ date: -1 })
    res.json(posts)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to fetch posts' })
  }
})

// Get single post by slug (derived from metaTitle)
router.get('/slug/:slug', async (req, res) => {
  try {
    const slug = decodeURIComponent(req.params.slug || '')
    const post = await Post.findOne({ slug })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to fetch post' })
  }
})

router.post('/migrate-images', async (req, res) => {
  const summary = {
    portfoliosChecked: 0,
    portfoliosUpdated: 0,
    postsChecked: 0,
    postsUpdated: 0,
    imagesMigrated: 0,
    imagesSkipped: 0,
    imagesFailed: 0,
    failures: []
  }

  try {
    const portfolios = await Portfolio.find()
    summary.portfoliosChecked = portfolios.length

    for (const portfolio of portfolios) {
      let portfolioChanged = false
      const images = Array.isArray(portfolio.images) ? portfolio.images : []

      for (let index = 0; index < images.length; index++) {
        const image = images[index]
        const currentUrl = image && image.url

        if (!currentUrl || isMigratedCloudinaryUrl(currentUrl)) {
          summary.imagesSkipped++
          continue
        }

        try {
          console.log('started')

          const cloudinaryUrl = await uploadImageToCloudinary(getCloudinaryFetchUrl(currentUrl))
          console.log(cloudinaryUrl)
          images[index].url = cloudinaryUrl
          portfolioChanged = true
          summary.imagesMigrated++
        } catch (error) {
          summary.imagesFailed++
          summary.failures.push({
            portfolioId: portfolio._id,
            imageIndex: index,
            url: currentUrl,
            error: error.message
          })
        }
      }

      if (portfolioChanged) {
        portfolio.markModified('images')
        await portfolio.save()
        summary.portfoliosUpdated++
      }
    }

    const posts = await Post.find()
    summary.postsChecked = posts.length

    for (const post of posts) {
      const currentUrl = post.image

      if (!currentUrl || isMigratedCloudinaryUrl(currentUrl)) {
        summary.imagesSkipped++
        continue
      }

      try {
        console.log('started')

        const cloudinaryUrl = await uploadImageToCloudinary(getCloudinaryFetchUrl(currentUrl))
        console.log(cloudinaryUrl)
        post.image = cloudinaryUrl
        await post.save()
        summary.postsUpdated++
        summary.imagesMigrated++
      } catch (error) {
        summary.imagesFailed++
        summary.failures.push({
          postId: post._id,
          field: 'image',
          url: currentUrl,
          error: error.message
        })
      }
    }

    res.send(summary)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({
      message: 'Internal Server Error',
      summary
    })
  }
})

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to fetch post' })
  }
})

// Update post (admin)
router.put('/:id', fetchAdmin, async (req, res) => {
  try {
    const { metaTitle, metaDescription, title, category, image, description, date } = req.body
    const slug = slugify(metaTitle || title || '')
    const update = { slug, metaTitle, metaDescription, title, category, image, description, date }
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to update post' })
  }
})

// Delete post (admin)
router.delete('/:id', fetchAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to delete post' })
  }
})

module.exports = router
