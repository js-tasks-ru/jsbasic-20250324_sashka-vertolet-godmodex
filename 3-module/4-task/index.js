function showSalary(users, age) {
  
  const filteredUsers = users
   .filter(user => user.age <= age)
   .map(user => `${user.name}, ${user.balance}`);

 return filteredUsers.join(`\n`)  
}