import bcrypt from 'bcryptjs';

const user = [
  {
    name: 'Manish Mandal',
    email: 'manish@growmart.com',
    password: bcrypt.hashSync('mandal123', 10),
    isAdmin: true,
  },
  {
    name: 'Diya Mandal',
    email: 'diya@example.com',
    password: bcrypt.hashSync('diya123', 10),
  },
  {
    name: 'John Doe',
    email: 'jhon@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default user;
