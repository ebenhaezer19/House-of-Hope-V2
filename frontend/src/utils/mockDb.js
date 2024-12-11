export const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Administrator',
    role: 'Admin',
    avatar: 'https://ui-avatars.com/api/?name=Administrator&background=4F46E5&color=fff'
  },
  {
    id: 2,
    email: 'staff@example.com',
    password: 'staff123',
    name: 'Staff User',
    role: 'Staff',
    avatar: 'https://ui-avatars.com/api/?name=Staff+User&background=4F46E5&color=fff'
  }
]

export const findUser = (email, password) => {
  return users.find(user => user.email === email && user.password === password)
} 