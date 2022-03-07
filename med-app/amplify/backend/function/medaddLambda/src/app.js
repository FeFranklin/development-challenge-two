/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "medAppClients";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const path = "/clients";

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, function(req, res) {
  const queryParams = {
    TableName: tableName,
    limit: 100
  }

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items.length ? data.Items : 'empty table');
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/:name/:email', function(req, res) {
  const params = {
    TableName: tableName,
    Key: {
      name: req.params.name,
      email: req.params.email,
    }
  }
  console.log('this is called');
  dynamodb.get(params,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(req, res) {
  let putItemParams = {
    TableName: tableName,
    Item: {
      ...req.body,
    },
    Key: {
      name: req.body.name,
      email: req.body.email,
    },
    UpdateExpression: "set #name=:name, email=:email, addr=:addr, brith=:brith",
    ExpressionAttributeNames: { '#name': 'name' },
    ExpressionAttributeValues:{
      ":name": req.body.name,
      ":email": req.body.email,
      ":addr": req.body.addr,
      ":brith": req.body.brith,
    },
    ReturnValues: 'ALL_OLD',
    ConditionExpression: 'attribute_exists(birth) AND attribute_exists(#name) AND attribute_exists(email) AND attribute_exists(addr)',
  }

  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else{
      res.json({ success: 'put call succeed!', url: req.url, data: data, body: JSON.stringify(res.Attributes) })
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(
  path,
  body('email').isEmail(),
  body('name').not().isEmpty(), 
  function(req, res) {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const putItemParams = {
    TableName: tableName,
    Item: {
      ...req.body,
      id: uuidv4(),
    }
  }

  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else {
      res.json({success: 'client added successfully!', url: req.url, data: data})
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/:name', function(req, res) {
  const dbParams = {
    TableName: tableName,
    Key: {
      name: req.params.name,
      email: req.body.email,
    }
  }

  dynamodb.delete(dbParams, (err, data)=> {
    if (err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
