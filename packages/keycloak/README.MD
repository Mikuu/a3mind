Launch and Set up Keycloak
--

a3mind using Keycloak to do the authN & authZ and account management, there are mainly three steps to set up a working keycloak service:
1. Launch keycloak service with docker,
2. Create realm by importing realm configuration file,
3. Create minimal user account

# Launch keycloak service
```commandline
./run-keycloak.sh
```

> the launching process may need some seconds, be patient

This launch keycloak service at `http://localhost:8080` with admin username=`admin` and password=`admin`, access http://localhost:8080 you can get below initial page
![keycloak-initial](../../documents/images/a3m-keycloak-initial.png)

Click `Administration console` redirect to login page, log in with the admin credentials to get into the admin page
![keycloak-admin](../../documents/images/a3m-keycloak-admin.png)

Here, the keycloak service is ready for function.

# Create realm
in the admin page, click the `Create Realm` button to create realm,
![keycloak-create-realm](../../documents/images/a3m-keycloak-create-realm.png)

then create realm by importing the configuration file `automid-realm.json`,
![keycloak-import-realm](../../documents/images/a3m-keycloak-import-realm.png)

lastly, you can find a new realm named `automind` is created,
![keycloak-realm-imported](../../documents/images/a3m-keycloak-realm-imported.png)

click the `Clients` button, there should be clients `automind-app` and `automind-backend` which are our frontend client and backend client.
![keycloak-clients](../../documents/images/a3m-keycloak-clients.png)

# Create user account
Now we need to create user which can log in to our a3mind web application. Click `Users` button and then click `Add user` button,
![keycloak-add-user](../../documents/images/a3m-keycloak-add-user.png)

then fill the necessary information to create a user, e.g.
- Username: ariman
- Email: biaofu@thgouthworks.com
- Email verified: Yes
- First Name: Miku
- Last Name: Ariman

![keycloak-add-user-info](../../documents/images/a3m-keycloak-add-user-info.png)

then click the `Credentials` tab to add credential for this user,
![keycloak-add-credential](../../documents/images/a3m-keycloak-add-credential.png)

you can only input simple initial password and enable the `Temporary` option, this will require user to update its password on its first login,
![keycloak-add-password](../../documents/images/a3m-keycloak-add-password.png),

continue to save the password, then you will get the new user ready for logging in to `a3mind` web application,
![keycloak-password-added](../../documents/images/a3m-keycloak-password-added.png)

## Configure access control for user
A user created till now only has a username and its password, which can log in the web application, but still not able to access any resource from backend service, access rights should be granted to user for that.

### Config access right for Web resource
Click the `Role mapping` tab,
![keycloak-roleMapping](../../documents/images/a3m-keycloak-roleMapping.png)

then click `Assign role` button to open the assign role modal,
![keycloak-assignRole](../../documents/images/a3m-keycloak-assignRole-modal.png)

in the modal, select `Filter by clients`, and then select `automind-app app-user` and click `Assign` button,
![keycloak-clientRole](../../documents/images/a3m-keycloak-clientRole-modal.png)

after that, the role should be added to the user, and the user should be able to access resource from the web application.
![keycloak-clientRole-added](../../documents/images/a3m-keycloak-clientRole-added.png)

### Config access right for API resource
a3mind backend supports updating test case result with API calls, that API call needs access token to be provided in the request header, otherwise the access will be rejected.

In the admin page, select `Clients` in the left hand menu, then click `automind-backend` in the client list, in the client details page, click `Credentials` tab, then select `Client Id and Secret` for Client Authenticator, and generate the Client secret,
![keycloak-clientSecret](../../documents/images/a3m-keycloak-backend-clientSecret.png)

Now we have the client secret, this secret can be used to switch access token when call API to backend service direct to update the test cases results.
