const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

module.exports.createUser = async (event) => {
  try {
    const body = JSON.parse(event.body);

    
    if (typeof body.id !== "number") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El ID debe ser un número (Ej: 123)" })
      };
    }

    
    const requiredFields = ["id", "nombre", "email"];
    const missingFields = requiredFields.filter(field => !(field in body));
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Faltan campos: ${missingFields.join(", ")}` })
      };
    }

    
    const params = {
      TableName: "sls-users",
      Item: marshall({
        id: body.id, 
        nombre: body.nombre,
        email: body.email
      }),
      ConditionExpression: "attribute_not_exists(id)"
    };

    await dynamoClient.send(new PutItemCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify(body)
    };

  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return { 
        statusCode: 409, 
        body: JSON.stringify({ error: "El ID ya existe" }) 
      };
    }
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Error interno al crear el usuario" }) 
    };
  }
};


