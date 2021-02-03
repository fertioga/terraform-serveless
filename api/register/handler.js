'use strict';

const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION
});
const documentClient = new AWS.DynamoDB.DocumentClient()
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

module.exports.register = async (event) => {

  //parciar o que vem o API para Json
  const body = JSON.parse(event.body);

  await documentClient.put({
    TableName: process.env.DYNAMODB_USERS,
    Item: {
      id: uuid(),
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password,10),
      role: 'user'
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Usuário Criado com sucesso!"
    })
  }

};
