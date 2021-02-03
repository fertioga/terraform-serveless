'use strict';
const AWS = require('aws-sdk');
AWS.config.update({
  region:process.env.AWS_REGION
})
const SNS = new AWS.SNS
const converter = AWS.DynamoDB.Converter

const moment = require('moment')
moment.locale('pt-br')

module.exports.listen = async (event) => {

  //== faz um array de promises
  const snsPromises = [];

  for (const record of event.Records) {

    if(record.eventName === 'INSERT'){
      
      const dadosDB = converter.unmarshall(record.dynamodb.NewImage);
      
      //== joga a promise Asincrona do SNS no array
      snsPromises.push(
        SNS.publish({
          TopicArn: process.env.SNS_NOTIFICATIONS_TOPIC,
          Message: `Reserva efetuada: o usuário: ${dadosDB.user_map.name} (${dadosDB.user_map.email}) agendou um horário em: ${moment(dadosDB.date).format('LLLL')}`
        }).promise()
      );
      
    }

  }

  await Promise.all(snsPromises);

  console.log('Mensagen(s) enviada(s) com sucesso!')

};
