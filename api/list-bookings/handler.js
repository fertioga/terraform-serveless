const AWS = require('aws-sdk');
AWS.config.update({
    region:process.env.AWS_REGION
});
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.list = async (event) => {

    //== somente admin pode listar os agendamentos
    if(event.requestContext.authorizer.role === 'admin'){
       
       const data =  await documentClient.scan({
            TableName: process.env.DYNAMODB_BOOKINGS
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({data:data.Items})
        }

    }else{
        
        return {
            statusCode: 403,
            body: JSON.stringify({message: 'Você não tem acesso'})
        }
    }
    
}