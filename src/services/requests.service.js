let users = [];

exports.getAll = () => users;

exports.getById = (id) => {
  return users.find(u => u.id == id);
};

exports.create = (data) => {
  const user = {
    id: Date.now(),
    user: data.user
  };

  users.push(user);
  return user;
};

exports.update = (id, data) => {
  const index = users.findIndex(u => u.id == id);

  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...data
  };

  return users[index];
};

exports.remove = (id) => {
  const exists = users.some(u => u.id == id);
  if (!exists) return false;

  users = users.filter(u => u.id != id);
  return true;
};
