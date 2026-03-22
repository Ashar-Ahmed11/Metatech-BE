const express = require('express')
const router = express.Router()
const fetchAdmin = require('../middleware/fetchadmin')
const Portfolio = require('../models/portfolio')

router.post('/', fetchAdmin, async (req, res) => {
  try {
    const { title, description, images, websiteUrl, date } = req.body
    const portfolio = await Portfolio.create({ title, description, images: images || [], websiteUrl, date })
    res.status(201).json(portfolio)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to create portfolio' })
  }
})

router.get('/', async (_req, res) => {
  try {
    const portfolios = await Portfolio.find({}).sort({ date: -1 })
    res.json(portfolios)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to fetch portfolios' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' })
    res.json(portfolio)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to fetch portfolio' })
  }
})

router.put('/:id', fetchAdmin, async (req, res) => {
  try {
    const { title, description, images, websiteUrl, date } = req.body
    const update = { title, description, images: images || [], websiteUrl, date }
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' })
    res.json(portfolio)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to update portfolio' })
  }
})

router.delete('/:id', fetchAdmin, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id)
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to delete portfolio' })
  }
})

module.exports = router