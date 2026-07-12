const express = require('express')
const router = express.Router()
const Products = require('../models/product')

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
  console.log('fetch request started');
  
  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData
  })
  console.log('fetch request finished');
  
  const data = await response.json()
  console.log(data);
  

  if (!response.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  return data.secure_url || data.url
}
//COMMERCEJS TO MONGO CONVERTER!
// router.post('/createproduct', async (req, res) => {
//   const products = [

//     "prod_bWZ3l8bNONokpE",
//     "prod_QG375vMvZWorMO",
//     "prod_0egY5ee4rQ53Qn",
//     "prod_RqEv5xpx205Zz4",
//     "prod_8XxzoBKNV15PQA",
//     "prod_L1vOoZPnkPlRa8",
//     "prod_4OANwROnxqovYL",
//     "prod_nPEVlNGXOywa7d",
//     "prod_9BAmwJnj33weXd",
//     "prod_mOVKl46EyLoprR",
//     "prod_kd6Ll2mEPG5V2m",
//     "prod_bWZ3l8brmBokpE",
//     "prod_kd6Ll2mEDn5V2m",
//     "prod_ZM8X5nq4YPopv4",
//     "prod_p6dP5gMZqRwn7k",
//     "prod_G6kVw7vaBOl2eD",
//     "prod_Kvg9l68p3mo1bB",
//     "prod_DWy4oGEQJMl6Jx",
//     "prod_VKXmwD49JJwrgD",
//     "prod_LvJjoPKEjawe0n",
//     "prod_gnZO5kYdOWw7MN",
//     "prod_VPvL5zj4QK5AQk",
//     "prod_mOVKl460EdoprR",
//     "prod_p6dP5gMZZMwn7k",
//     "prod_ypbroEykk8o8n4",
//     "prod_4WJvlKR22a5bYV",
//     "prod_DWy4oGEQQzl6Jx",
//     "prod_QG375vM4DRorMO",
//     "prod_0egY5eeQmM53Qn",
//     "prod_gnZO5kY1mxw7MN",
//     "prod_zkK6oLQ32z5Xn0",
//     "prod_RyWOwmGjaK5nEa",
//     "prod_Kvg9l68gXvo1bB",
//     "prod_r2LM5QQY8r5ZV1",
//     "prod_G6kVw7vYRRl2eD",
//     "prod_O3bR5XD6e85nzd",
//     "prod_Kvg9l68Kqbo1bB",
//     "prod_Op1YoVDWjVlXLv",
//     "prod_eN1ql938X2oz3y",
//     "prod_0YnEoqjmj65e7P",
//     "prod_kd6Ll2mWmz5V2m",
//     "prod_9BAmwJnWnYweXd",
//     "prod_AYrQlWDrmbwnbR",
//     "prod_9BAmwJnWkEweXd",
//     "prod_mOVKl46WVMoprR",
//     "prod_bO6J5aMDO85Ejp",
//     "prod_31q0o3EWDklDdj",
//     "prod_ypbroEyWR8o8n4",
//     "prod_8XO3wpe4BAoYAz",
//     "prod_Kvg9l68WE2o1bB",
//     "prod_QG375vMp8RorMO",
//     "prod_0egY5ee1XM53Qn",
//     "prod_8XxzoBKWeK5PQA",
//     "prod_VKXmwD4WBewrgD",
//     "prod_LvJjoPKmNdwe0n",
//     "prod_eN1ql93WYYoz3y",
//     "prod_gnZO5kYR13w7MN",
//     "prod_kpnNwAxWrXlmXB",
//     "prod_8XO3wpe4PZoYAz",
//     "prod_bO6J5aMD0V5Ejp",
//     "prod_L1vOoZPLNglRa8",
//     "prod_kd6Ll2mWRY5V2m",
//     "prod_4OANwRO6QkovYL",
//     "prod_p6dP5gMy0Kwn7k",
//     "prod_AYrQlWDZXRwnbR",
//     "prod_G6kVw7v23ml2eD",
//     "prod_O3bR5XDqBG5nzd",
//     "prod_RyWOwmGydp5nEa",
//     "prod_ypbroEya67o8n4"

//   ]
//   products.map(async (e) => {
//     const url = `https://api.chec.io/v1/products/${e}`
//     // Default options are marked with *
//     const response = await fetch(url, {
//       method: "GET", // *GET, POST, PUT, DELETE, etc.
//       mode: "cors", // no-cors, *cors, same-origin
//       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//       credentials: "same-origin", // include, *same-origin, omit
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "*",
//         "X-Authorization": "sk_499300ddcd1ee967ae83993df0a32f3c2c4c42b267e31"
//       },

//       //   body: JSON.stringify(data), // body data type must match "Content-Type" header
//     });
//     const data = await response.json(); // parses JSON response into native JavaScript objects
//     const mongoProduct = await Products.create({
//       name: data.name,
//       description: data.description,
//       price: data.price.raw,
//       assets: data.assets.map((e) => { return { url: e.url } }),
//       createdAt: data.image.created_at,
//       youtubeLink: data.thank_you_url,
//       theTitle: data.seo.title,
//       homePreview: false,
//       category:data.categories[0].slug

//     })
//   })
//   res.send('Success!')
// })

router.get('/allproducts', async (req, res) => {
  try {

    const allProducts = await Products.find()
    res.send(allProducts)
    
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

router.get('/singleproduct/:id', async (req, res) => {
  try {

    const allProducts = await Products.findById(req.params.id)
    res.send(allProducts)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})

router.post('/migrate-images', async (req, res) => {
  const summary = {
    productsChecked: 0,
    productsUpdated: 0,
    imagesMigrated: 0,
    imagesSkipped: 0,
    imagesFailed: 0,
    failures: []
  }

  try {
    const products = await Products.find()
    summary.productsChecked = products.length
    let productCount = 0
    for (const product of products) {
      productCount++
      console.log(productCount)
      let productChanged = false
      const assets = Array.isArray(product.assets) ? product.assets : []

      for (let index = 0; index < assets.length; index++) {
        const asset = assets[index]
        const currentUrl = asset && asset.url

        if (!currentUrl || isMigratedCloudinaryUrl(currentUrl)) {
          summary.imagesSkipped++
          continue
        }

        try {
          console.log('started');
          
          const cloudinaryUrl = await uploadImageToCloudinary(`https://res.cloudinary.com/dextrzp2q/image/fetch/q_60/w_1000/h_1000/${currentUrl}`)
          console.log(cloudinaryUrl)
          assets[index].url = cloudinaryUrl
          productChanged = true
          summary.imagesMigrated++
        } catch (error) {
          summary.imagesFailed++
          summary.failures.push({
            productId: product._id,
            assetIndex: index,
            url: currentUrl,
            error: error.message
          })
        }
      }

      if (productChanged) {
        product.markModified('assets')
        await product.save()
        summary.productsUpdated++
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


router.post('/createproduct', async (req, res) => {
  try {

    const newProduct = await Products.create(req.body)
    res.send(newProduct)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})
router.post('/editproduct/:id', async (req, res) => {
  try {

    const newProduct = await Products.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    res.send(newProduct)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})
router.delete('/deleteproduct/:id', async (req, res) => {
  try {

    const newProduct = await Products.findByIdAndDelete(req.params.id)
    res.send(newProduct)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Some Internal Server Error')
  }
})


router.put('/createfield',async(req,res)=>{
  try {
   
  const updateField = await Products.update({},{$set:{"priceAED":50}},{upsert:false,multi:true})
  res.send(updateField)
     
} catch (error) {
  console.error(error.message)
  res.status(500).send('Internal Server Error')
}
})

module.exports = router