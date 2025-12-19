const express = require('express')
const router = express.Router()
const fetchAdmin = require('../middleware/fetchadmin')
const Post = require('../models/post')

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

