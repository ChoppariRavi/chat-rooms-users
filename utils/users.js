const users = [];

const userJoin = (id, username, room) => {
  const user = {
    id,
    username,
    room
  };
  users.push(user);
  return user;
};

const getCurrentUser = id => {
  return users.find(user => user.id === id);
};

const userLeave = id => {
  const idx = users.map(user => user.id).indexOf(id);
  if (idx !== -1) {
    return users.splice(idx, 1);
  }
};

const getRoomUsers = room => {
  return users.filter(user => user.room === room);
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
