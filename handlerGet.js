const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

module.exports.getUser = async (event) => {
  try {
    const id = parseInt(event.pathParameters.id); 

    if (isNaN(id)) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "ID inválido: debe ser un número" }) 
      };
    }

    const params = {
      TableName: "sls-users",
      Key: marshall({ id: id })
    };

    const { Item } = await dynamoClient.send(new GetItemCommand(params));
    
    return Item 
      ? { statusCode: 200, body: JSON.stringify(unmarshall(Item)) }
      : { statusCode: 404, body: JSON.stringify({ error: "Usuario no encontrado" }) };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Error al consultar DynamoDB" }) 
    };
  }
};
