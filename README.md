
<h1 align="center">
    <img src="./public/assets/chef.png" width="150">
</h1>

<h1 align="center">Foodfy 🍝</h1>

![GitHub repo size](https://img.shields.io/github/repo-size/LeonardoCampello-dev/Foodfy?color=red)
![GitHub package.json version](https://img.shields.io/github/package-json/v/LeonardoCampello-dev/Foodfy?color=red)
![License](https://img.shields.io/github/license/LeonardoCampello-dev/Foodfy?color=red)

## 📌 Resources 

- 👨‍🍳 Explore recipes and find amazing chefs.
- 🦸‍♂️ Admin mode.

## 🚀 Technologies used

The following technologies were used

- [x] [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [x] [Node.js](https://nodejs.org/en/)
- [x] [PostgreSQL](https://www.postgresql.org/)

### 📜 **Libraries**

- [x] [browsersync](https://www.browsersync.io/)
- [x] [npm-run-all](https://www.npmjs.com/package/npm-run-all)
- [x] [method-override](https://www.npmjs.com/package/method-override)
- [x] [node-postgres](https://www.npmjs.com/package/pg) 
- [x] [nodemon](https://www.npmjs.com/package/nodemon) 
- [x] [multer](https://www.npmjs.com/package/multer)
- [x] [nodemailer](https://nodemailer.com/about/) 
- [x] [express-session](https://www.npmjs.com/package/express-session) 
- [x] [lottie web](https://github.com/airbnb/lottie-web)

## 🎨 Layout

**Home** 🏠

![home](./.github/Home.png)

---

**Recipes** 🥘

![recipes](./.github/Recipes.png)

---

**Recipe** 🍝

![recipe](./.github/Recipe.png)

---

**Chefs** 👩‍🍳👨‍🍳

![chefs](./.github/Chefs.png)

---

**Chef** 👨‍🍳

![chef](./.github/Chef.png)

---

**Filter** 🔎

![filter](.github/Filter.png)

---

**Login** ✅

![login](./.github/Login.png)

---

**Forgot password** 🔑

![forgot](./.github/Forgot.png)

---

**Sending emails** 📩

![sending-emails](./.github/Emails.png)

---

**Success / error messages** ❌

![sending-emails](./.github/Messages.gif)

---

**GIF demonstration** 🎥

![gif](./.github/Foodfy.gif)

---

## Project installation 👷‍♂️

First you need to have [Node.js](https://nodejs.org/en/) installed, **then perform the following steps:**

Primeiro você precisa ter o [Node.js](https://nodejs.org/en/) instalado e, em seguida, **execute as seguintes etapas:**

``` bash 
## Clone the project
## Clone o projeto

git clone https://github.com/LeonardoCampello-dev/Foodfy.git
```

``` bash 
## Install the dependencies
## Instale as dependências 

npm install
```

``` bash
## Add your database access credentials to the src/config/db.js file (The database used in this project is PostgreSQL)

## Adicione suas credenciais de acesso ao banco de dados no arquivo src/config/db.js (o banco de dados usado neste projeto é PostgreSQL)
```

``` bash
## With the database active, run the following command at the root of the project to populate the tables:

## Com o banco de dados ativo, execute o seguinte comando na raiz do projeto para preencher as tabelas:

node seeds.js
```

``` bash
## Add, if it does not already exist, an image in the public/images folder and use the name 'placeholder.png'. This file will serve as an image for all application entities.

## Adicione, se ainda não existir, uma imagem na pasta public/images e use o nome 'placeholder.png'. Este arquivo servirá como uma imagem para todas as entidades do aplicativo.
```

``` bash 
## Finally, execute the command to start the application: 

## Por fim, execute o comando para iniciar o app:

npm start
```

---

## 📜 License 

Released in 2020. This project is under the [MIT license](/LICENSE).

## Made with love by Leonardo Campello 💚 