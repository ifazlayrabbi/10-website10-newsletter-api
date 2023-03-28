'use strict'

const express = require('express')
const app = express()
require('dotenv').config() 

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server listening on port ' + port)
})

app.use(express.static(__dirname + '/public'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

const https = require('https')







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

  const url_get = 'https://us21.api.mailchimp.com/3.0/lists/3b06d50b03/members?count=1000'
  const options_get = {
    auth: 'anystring123:'+api_key,
    method: 'GET'
  }

  



  https.get(url_get, options_get, (resp) => {
    console.log('Data getting statusCode: '+resp.statusCode)

    let dataA = ''
    resp.on('data', (d) => {
      dataA += d
    })

    resp.on('end', () => {
      dataA = JSON.parse(dataA)
      let total = dataA.total_items

      let found = 0
      for(let i=0; i<total; i++){
        if(email == dataA.members[i].email_address){
          res.sendFile(__dirname+'/same_email.html')
          found = 1
        }
      }
      
      if(found == 0)
        new_member()

    })
  })






  function new_member(){
    const postData = https.request(url, options, (postingData) => {
      console.log('Data posting statusCode: ' + postingData.statusCode)
  
      postingData.on('data', (d) => {
        console.log(d)
        // console.log(JSON.parse(dataA))
      })
  
      postingData.on('end', () => {
        console.log('All data are sent.')
      })
  
      if(postingData.statusCode == 200)
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
  }

})







app.post('/same_email', (req, res) => {
  res.redirect('/')
})

app.post('/failure', (req, res) => {
  res.redirect('/')
})

app.post('/success', (req, res) => {
  res.redirect('/')
})




