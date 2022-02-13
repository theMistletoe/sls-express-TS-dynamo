// const serverless = require("serverless-http");
// const serverlessExpress = require('@vendia/serverless-express');
// const express = require("express");
import serverlessExpress from '@vendia/serverless-express';
// import serverless from "serverless-http";
import express from "express";
import AWS  from "aws-sdk"
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { ScanInput } from 'aws-sdk/clients/dynamodb';
// import { GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb';
const app = express();

// console.log(app);

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = process.env.IS_OFFLINE ? new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
  secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
}) : new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  // region: 'ap-northeast-1',
})

app.get("/", async (_req, res, _next) => {
  const name = new Name('john');
  const x = name.func();
  console.log(x);
  


  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", async (_req, res, _next) => {
  
  const params: ScanInput = {
    TableName: USERS_TABLE!,
  };
  const response = await dynamoDbClient.scan(params).promise();
  console.log(JSON.stringify(response));
  
  
  
  // const { Item } = await dynamoDbClient.get(params).promise();
  // console.log(Item);
  
  return res.status(200).json({
    message: "Hello from path!!!!!!!"+JSON.stringify(response),
  });
});
app.get("/hello2", async (_req, res, _next) => {
  const putParams: DocumentClient.PutItemInput = {
    TableName: USERS_TABLE!,
    Item: {
      email: "sam@example.com"
    },
    ReturnValues: 'ALL_OLD', // 同じプライマリキーの値があったら、過去の値を返す
    // ReturnConsumedCapacity: "TOTAL",
  };
  const result = await dynamoDbClient.put(putParams).promise();
  console.log(result);
  return res.status(200).json({
    message: "Hello2 from path!",
  });
});

app.use((_req, res, _next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverlessExpress({app});


class Name {
  constructor(private name: string) {
  }
  func = () => {
    console.log(this.name);
    
    return 'xxx';
  }
}