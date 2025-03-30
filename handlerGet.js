let users = [
  { id: 1, nombre: "Juan", email: "juan@example.com" },
  { id: 2, nombre: "Maria", email: "maria@example.com" }
];

module.exports.getUser = async (event) => {
  let user = users.find(u => u.id == event.pathParameters.id);
  return user ? { statusCode: 200, body: JSON.stringify(user) } : { statusCode: 404, body: "User not found" };
};
