'use strict'

const express = require('express')
const app = express()

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server listening on port ' + port)
})

app.use(express.static(__dirname + '/public'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

const https = require('https')
require('dotenv').config()







app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
  const firstName = req.body.name1st
  const lastName = req.body.name2nd
  const email = req.body.email

  const data = JSON.stringify({
    members: [{
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  })

  console.log(data)

  


  // nodejs api https post
  // https://nodejs.org/api/https.html
  // https://nodejs.org/api/https.html#httpsrequesturl-options-callback

  // https://mailchimp.com/developer/marketing/docs/fundamentals/

  const api_key = process.env.API_KEY
  const url = 'https://us21.api.mailchimp.com/3.0/lists/3b06d50b03'
  const options = {
    auth: 'anystring123:'+api_key,
    method: 'POST'
  }

  const postData = https.request(url, options, (post_Data) => {
    console.log('statusCode: ' + post_Data.statusCode)

    post_Data.on('data', (dataA) => {
      console.log(dataA)
      // console.log(JSON.parse(dataA))
    })

    post_Data.on('end', () => {
      console.log('All data are shown.')
    })

    if(post_Data.statusCode == 200)
      res.sendFile(__dirname + '/success.html')
    else
      res.sendFile(__dirname + '/failure.html')

  })

  postData.on('error', (e) => {
    console.error('Problem with request: ' + e.message)
    res.sendFile(__dirname + '/failure.html')
  })

  postData.write(data)
  postData.end() 

})



app.post('/failure', (req, res) => {
  res.redirect('/')
})

app.post('/success', (req, res) => {
  res.redirect('/')
})




