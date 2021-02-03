const jwt = require('jsonwebtoken')

exports.authorizer =  function(event, context, callback) {
    const token = event.authorizationToken;
    
    try{
        // faz a verificação e ja decodifica o hash
        const user = jwt.verify(token, process.env.JWT_SECRET)

        // chama o callback e manda o objeto user para a funcao (ultimo parametro)
        callback(null, generatePolicy('user', 'Allow', event.methodArn, user));
    
    }catch(e){

    }
    
    callback(null, generatePolicy('user', 'Deny', event.methodArn));
    
};

const generatePolicy = function(principalId, effect, resource, user) {
    const authResponse = {};
    
    authResponse.principalId = principalId;

    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    if(user){
        // Caso venha user é porque o token foi decodificado
        // e validado, neste caso, intercepta a requisão e manda de volta
        // o token decodificado para quem chamou (economizar processamento)
        authResponse.context = user;
    }
    
    return authResponse;
}