A3mind
--

# Start Develop Environment
To launch the development environment, it requires:
- prepare keycloak service
- prepare backend service and database
- prepare frontend application

## Prepare keycloak service
Follow the guide at `packages/keycloak/README.MD` to launch and set up keycloak service. 

## Prepare backend service and database
Follow the guide at `packages/backend/README.MD` to launch the backend service and mongodb database.

## Prepare frontend application
Launch the application with below command
```commandline
npm run dev -w @a3mind/minding
```
If things all run well, you should be able to access `http://localhost:3000` and login with the user account and password created in keycloak.

