- [X] Design a complete authentication system of Login, Registration and Forgot Password.

- [X] The Following are user details should be collected and stored in the database.
    - [X] The username should be unique(email id)
    - [X] First name and last name
    - [X] The password should be encrypted
    - [X] Type of user is going to be used the system(Admin/Managaer/Employee).


- [X] The system should allow either admin/manager to add users.

- [X] The admin should have an administrator-level of access to all the functionalities.

- [x] The manager should have a managing level of access to all the functionalities.

- [ ] The employee should have the rights to create, updating, searching for leads, contacts, service requests.

- [ ] The employee who doesn't have any rights can be allowed to view only the leads, contacts, service requests.

- [ ] For the access rights design the system with necessary middlewares.

- [ ] The sysytem should allow the users to send/receive requests/responses from a particular domain only.

- [ ] The activated users are only able to login with the system.
    - [ ] If a user is not registered should not be allowed to login and a valid message should be displayed to the user.
<br/>
- [ ] The following are the process flows in forgot password

    - [ ] The user clicks on a forgot password link that redirects the user to forgot my password page.
    - [ ] On the verify and validate the user's email address then allow the user to click the forgot password button.
    - [ ] Once the user email address is valid, then the system sends an email containing the randomly generated token encoded url for the new password page and the token URL is stored in a database for a temporary use.
    - [ ] The client on the URL to reset his/her password.
    - [ ] Once the password is created. then the randomly generated token url should be deactivated in the database and a new password should be updated to the database for the corresponding user's email address.
    - [ ] After the successful creation of the new password, a valid message should be displayed ot the user.