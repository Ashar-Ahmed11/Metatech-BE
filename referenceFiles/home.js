const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')
const Home = require('../models/home')
const fetchAdmin = require('../middleware/fetchadmin')
const Category = require('../models/category')

const CLOUDINARY_CLOUD_NAME = 'nplofwvm'
const CLOUDINARY_UPLOAD_PRESET = 'for_migration'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const CATEGORY_IMAGE_FIELDS = [
    'mainCarousalImgDesktop',
    'mainCarousalImgPhone'
]

const HOME_IMAGE_FIELDS = [
    'mainCarousalImgDesktop',
    'mainCarousalImgPhone',
    'bodyImg',
    'footerCarousalImgDesktop',
    'footerCarousalImgPhone'
]

const isMigratedCloudinaryUrl = (url) => (
    typeof url === 'string' && url.includes(`res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/`)
)

const uploadImageToCloudinary = async(imageUrl) => {
    const formData = new FormData()
    formData.append('file', imageUrl)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error?.message || 'Cloudinary upload failed')
    }

    return data.secure_url || data.url
}

const migrateImageFields = async(document, fields, type, summary) => {
    let documentChanged = false

    for (const field of fields) {
        const currentUrl = document[field]

        if (!currentUrl || isMigratedCloudinaryUrl(currentUrl)) {
            summary.imagesSkipped++
            continue
        }

        try {
            document[field] = await uploadImageToCloudinary(`https://res.cloudinary.com/jvwuwauz/image/fetch/q_60/${currentUrl}`)
            documentChanged = true
            summary.imagesMigrated++
        } catch (error) {
            summary.imagesFailed++
            summary.failures.push({
                type,
                documentId: document._id,
                field,
                url: currentUrl,
                error: error.message
            })
        }
    }

    if (documentChanged) {
        await document.save()
        summary.documentsUpdated++
    }
}
router.post('/createhome', async(req, res) => {

    try {

        const admin = await Admin.findOne({ username: 'admin@raisakbar.com' })

        const data = {
            user: admin._id,
            mainCarousalImgDesktop:'https://res.cloudinary.com/jvwuwauz/image/upload/v1678537550/knpz1pszgqkze7iwv3hm.avif',
          mainCarousalImgPhone: 'https://res.cloudinary.com/jvwuwauz/image/upload/v1677446793/piefl0qw89izkoh300fd.png',
            firstHeading: 'Fresh Arrivals',
            secondSmallPara: 'A Newly Updated Look',
            secondSmallHead: 'Nukhba',
            secondSmallParaTwo: 'Now designed for a seamless experience, your daily dose of leather.',
            secondSmallParaThree: 'We are getting ready for a "grand gesture" with new products under development and a brand-new definition of lifestyle under creation.',
            bodyImg: 'https://res.cloudinary.com/jvwuwauz/image/upload/v1676748951/xyxuzlzsmnyr7mbjse4m.png',
            thirdSmallPara: 'Designed for Simplicity',
            thirdSmallHead: 'Crafts that age elegantly',
            thirdSmallParaTwo: 'Our trademark is a traditional cut presented in a contemporary serving style, created to meet the demands of todays dynamic world.',
            fourSmallHead: 'Core Values',
            fourSmallPara: 'When Nukhba was established, it had big plans:',
            fourSmallParaTwo: 'To successfully enter the local market with goods that most closely match the description of international manufacturing standards while keeping the price cap within the means of the average domestic customer, and this trip has a narrative...',
            secondHeading: 'Featured Ones',
            footerCarousalImgDesktop: 'https://res.cloudinary.com/jvwuwauz/image/fetch/f_webp/q_60/https://res.cloudinary.com/jvwuwauz/image/upload/v1676748976/tbgvwfdtgixrwqoj0ldn.png',
            footerCarousalImgPhone: 'https://res.cloudinary.com/jvwuwauz/image/fetch/f_webp/q_60/https://res.cloudinary.com/jvwuwauz/image/upload/v1676748998/aikg308x1vsartenlm4p.png'
        }

        const home = await Home.create(data)
        home.save()
        res.send(home)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})

router.post('/createcategory', async (req, res) => {

    try {

        const admin = await Admin.findOne({ username: 'admin@raisakbar.com' })

        const data = {
            user: admin._id,
            mainCarousalImgDesktop: 'https://res.cloudinary.com/jvwuwauz/image/upload/v1767213381/b7jwkdkux1dhiytkqhuh.jpg',
            mainCarousalImgPhone: 'https://res.cloudinary.com/jvwuwauz/image/upload/v1767213394/hknpzfukkaxnueyyqair.jpg',
            mainHeading: req.body.mainHeading,
            firstHeading: req.body.mainHeading,
            firstSmallPara: "The best addition to any kitchen is high-quality spices. For those who value authentic taste and rich aroma, premium spices are an essential choice. There is a reason why carefully sourced spices are trusted worldwide; they are considered a symbol of purity, freshness, and superior quality.",

firstSmallParaTwo: "They enhance the flavor of every dish and perfectly complement your cooking style, whether you are preparing traditional recipes or modern cuisine. With high-quality spices, you don’t need to worry about freshness or storage, as they retain their natural aroma and taste in all conditions. Being easy to use and versatile, they effortlessly blend into your daily cooking routine.",

firstSmallParaThree: "At Memon Foods & Spices, we go the extra mile to serve our customers with the finest quality spices and food products. We invest significant time in understanding our customers’ needs, carefully selecting premium raw ingredients, and processing them under strict quality standards. As one of Pakistan’s trusted spice brands, you can be confident about the purity and consistency of our products.",

secondHeading: "Buy Premium Quality Spices Online in Pakistan",

secondSmallPara: "Memon Foods & Spices offers a wide range of premium spices for households, restaurants, and food lovers. Our spices are expertly processed with attention to detail, ensuring rich flavor and long-lasting freshness. Available in a variety of blends and single spices, our products are designed to meet diverse taste preferences across Pakistan.",

secondSmallParaTwo: "Our spices are sourced from the best farms and processed to preserve their natural oils and aroma, instantly elevating the taste of your meals. Built on quality and trust, our products are made to be enjoyed for a long time, bringing authentic flavors to every generation. Whether you are cooking daily meals or special dishes, there is a spice for every recipe at Memon Foods & Spices.",

secondSmallParaThree: "Moreover, we offer customized spice packaging for businesses and bulk buyers as well. From basic everyday spices to premium blends and specialty seasonings, we provide it all. So, you can easily buy the best and affordable spices in Pakistan from Memon Foods & Spices without any hassle!"

        }

        const home = await Category.create(data)
        home.save()
        const updatedCategory = await Category.find()
        res.send(updatedCategory)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})

router.get('/gethome', async (req, res) => {
    const home = await Home.findById("698b7f5af25bb96d03d5e3f6")
    res.send(home)
})
router.get('/getcategory/:id', async (req, res) => {
    const home = await Category.findById(req.params.id)
    res.send(home)
})
router.get('/getcategories', async (req, res) => {
    const home = await Category.find()
    res.send(home)
})
router.delete('/deletecategory/:id', async (req, res) => {

    try {


        const result = await Category.findByIdAndRemove(req.params.id)
        const getCategories = await Category.find()
        res.send(getCategories)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Internal Server Error")
    }
})

router.put('/edithome', fetchAdmin, async (req, res) => {

    try {

        const home = await Home.findOne({ user: req.user })
        if (!home) {
            return res.status(402).send("Not allowed!")
        }
        const newComponent = {}
        if (req.body.mainCarousalImgDesktop) { newComponent.mainCarousalImgDesktop = req.body.mainCarousalImgDesktop }
        if (req.body.mainCarousalImgPhone) { newComponent.mainCarousalImgPhone = req.body.mainCarousalImgPhone }
        if (req.body.firstHeading) { newComponent.firstHeading = req.body.firstHeading }
        if (req.body.secondSmallPara) { newComponent.secondSmallPara = req.body.secondSmallPara }
        if (req.body.secondSmallHead) { newComponent.secondSmallHead = req.body.secondSmallHead }
        if (req.body.secondSmallParaTwo) { newComponent.secondSmallParaTwo = req.body.secondSmallParaTwo }
        if (req.body.secondSmallParaThree) { newComponent.secondSmallParaThree = req.body.secondSmallParaThree }
        if (req.body.bodyImg) { newComponent.bodyImg = req.body.bodyImg }
        if (req.body.thirdSmallPara) { newComponent.thirdSmallPara = req.body.thirdSmallPara }
        if (req.body.thirdSmallHead) { newComponent.thirdSmallHead = req.body.thirdSmallHead }
        if (req.body.thirdSmallParaTwo) { newComponent.thirdSmallParaTwo = req.body.thirdSmallParaTwo }
        if (req.body.fourSmallHead) { newComponent.fourSmallHead = req.body.fourSmallHead }
        if (req.body.fourSmallPara) { newComponent.fourSmallPara = req.body.fourSmallPara }
        if (req.body.fourSmallParaTwo) { newComponent.fourSmallParaTwo = req.body.fourSmallParaTwo }
        if (req.body.secondHeading) { newComponent.secondHeading = req.body.secondHeading }
        if (req.body.footerCarousalImgDesktop) { newComponent.footerCarousalImgDesktop = req.body.footerCarousalImgDesktop }
        if (req.body.footerCarousalImgPhone) { newComponent.footerCarousalImgPhone = req.body.footerCarousalImgPhone }
        const note = await Home.findByIdAndUpdate('698b7f5af25bb96d03d5e3f6', { $set: newComponent }, { new: true })

        res.send(note)
        // const home = await Home.create(data)
        // home.save()
        // res.send(home)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})


router.post('/migrate-cover-images', async(req, res) => {
    const summary = {
        homeDocumentsChecked: 0,
        categoryDocumentsChecked: 0,
        documentsUpdated: 0,
        imagesMigrated: 0,
        imagesSkipped: 0,
        imagesFailed: 0,
        failures: []
    }

    try {
        const homeDocuments = await Home.find()
        const categoryDocuments = await Category.find()

        summary.homeDocumentsChecked = homeDocuments.length
        summary.categoryDocumentsChecked = categoryDocuments.length

        for (const homeDocument of homeDocuments) {
            await migrateImageFields(homeDocument, HOME_IMAGE_FIELDS, 'home', summary)
        }

        for (const categoryDocument of categoryDocuments) {
            await migrateImageFields(categoryDocument, CATEGORY_IMAGE_FIELDS, 'category', summary)
        }

        res.send(summary)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send({
            message: 'Internal Server Error',
            summary
        })
    }
})


router.put('/editcategory/:id', fetchAdmin, async (req, res) => {

    try {

        const home = await Category.findOne({ user: req.user })
        if (!home) {
            return res.status(402).send("Not allowed!")
        }
        const newComponent = {}
        if (req.body.mainCarousalImgDesktop) { newComponent.mainCarousalImgDesktop = req.body.mainCarousalImgDesktop }
        if (req.body.mainCarousalImgPhone) { newComponent.mainCarousalImgPhone = req.body.mainCarousalImgPhone }
        if (req.body.mainHeading) { newComponent.mainHeading = req.body.mainHeading }
        if (req.body.firstHeading) { newComponent.firstHeading = req.body.firstHeading }
        if (req.body.firstSmallPara) { newComponent.firstSmallPara = req.body.firstSmallPara }
        if (req.body.firstSmallParaTwo) { newComponent.firstSmallParaTwo = req.body.firstSmallParaTwo }
        if (req.body.firstSmallParaThree) { newComponent.firstSmallParaThree = req.body.firstSmallParaThree }
        if (req.body.secondHeading) { newComponent.secondHeading = req.body.secondHeading }
        if (req.body.secondSmallPara) { newComponent.secondSmallPara = req.body.secondSmallPara }
        if (req.body.secondSmallParaTwo) { newComponent.secondSmallParaTwo = req.body.secondSmallParaTwo }
        if (req.body.secondSmallParaThree) { newComponent.secondSmallParaThree = req.body.secondSmallParaThree }


        const note = await Category.findByIdAndUpdate(req.params.id, { $set: newComponent }, { new: true })

        res.send(note)
        // const home = await Home.create(data)
        // home.save()
        // res.send(home)


    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Some Internal Server Error")
    }
})


module.exports = router