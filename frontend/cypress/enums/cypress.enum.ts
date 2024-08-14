export enum CypressEnum {

  // Depending on the test, uncomment on the one you need LoginEmail

  // This is the super administrator's email and we do all the testing on it.
  LoginEmail = 'andypetrov114@gmail.com',

  // This email is used to test AccountSettingsDialogTest, before using it, you need to create it first using AddUserDialogTest
  // LoginEmail = 'andypetrov114+113@gmail.com',


  RegisterEmail = 'andypetrov114+112@gmail.com',
  RegisterFirstName = 'RegisterFirstName',
  RegisterLastName = 'RegisterLastName',

  NewUserEmail = 'andypetrov114+116@gmail.com',
  NewUserFirstName = 'NewUserFirstName',
  NewUserLastName = 'NewUserLastName',

  TestExampleEmail = 'test@example.com',

  Password = 'test123456',
  CurrentPassword = 'test123456',
  NewPassword = 'test123456',

  Country = 'United States',
  BirthDate = '2000-01-01',

  SuperAdmin = 'Super Admin',
  ProjectAdmin = 'Project Admin',
  Manager = 'Manager',
  Client = 'Client',

  NewCategory = 'New Category',
  UpdatedCategory = 'Updated Category'
}
