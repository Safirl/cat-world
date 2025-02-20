# Cat World

## Pitch

Cat world is a student project. You can send letters to your friends, even if they are far away, and tell them about your life ! And, of course, your avatar is a cat.

## Install project on your machine

```bash
# 1. install dependancies :
npm i
cd backend/
npm i
cd../frontend/
npm i

# 2. To start dev server (from the root directory)
npm run dev
```

## Install MongoDB instance

Go to : https://www.mongodb.com/try/download/community and download mongodb community server. You can also download compass to have a GUI.

## Modify .env files

# 1. Backend

Create a .env file and copy/paste the content of the .env example of the backend. Then replace the values with your own mongoDB database URI and app port.

# 2. Frontend

Just copy/paste the .env example, it already has the correct URL to the API.

## How to test project ?

You can launch test on the backend with the following commands. Please add tests when creating new methods in the backend controllers.

```bash
cd backend/
npm run test
```

## How to contribute ?

Create a branch to work on your feature. When you're done, create a pull request onto main. Once its merged, you can create another pull request from main to production if you want to push in prod your feature.

Before creating your pull request, please check that builds are working.

```bash
cd backend/
npm run build
cd ../frontend
npm run build
```
