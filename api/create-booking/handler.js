const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.AWS_REGION
});
const documentClient = new AWS.DynamoDB.DocumentClient();
const {v4:uuid} = require('uuid');

module.exports.create = async event => {

    const body = JSON.parse(event.body);

    //== pega os dados do usuario logado (que vem no nó authorizer)
    const user = event.requestContext.authorizer;
    //== tira algumas informações que não interessam 
    delete user.iat;
    delete user.integrationLatency;
    delete user.principalId;

    try{
        await documentClient.put({
            TableName: process.env.DYNAMODB_BOOKINGS,
            Item:{
                id: uuid(),
                date: body.date,
                user_id: user.id,
                user_map: user
            }            
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({message:'Agendado com sucesso!'})
        }

    }catch(error){
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({message:'Erro interno do Servidor'})
        }
    }


}
