let users = [
  { id: 1, nombre: "Juan", email: "juan@example.com" },
  { id: 2, nombre: "Maria", email: "maria@example.com" }
];

module.exports.createUser = async (event) => {
  try {
    let newUser = JSON.parse(event.body);
    
    if (users.some(u => u.id === newUser.id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "ID de usuario ya existe" })
      };
    }
    
    users.push(newUser);
    return {
      statusCode: 201,
      body: JSON.stringify(newUser)
    };
    
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Formato de solicitud inválido" })
    };
  }
};


