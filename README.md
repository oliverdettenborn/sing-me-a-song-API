<p align="center">
  <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f3bc.svg" width="100" alt="RepoProvas" />
</p>

# Sing me a Song (BackEnd)

 ![license](https://img.shields.io/github/license/thaliadettenborn/sing-me-a-song-API?style=flat-square) ![total lines](https://img.shields.io/tokei/lines/github/thaliadettenborn/sing-me-a-song-API) ![last commit](https://img.shields.io/github/last-commit/thaliadettenborn/sing-me-a-song-API?style=flat-square) ![issues](https://img.shields.io/github/package-json/v/thaliadettenborn/sing-me-a-song-API?style=flat-square) ![forks](https://img.shields.io/github/forks/thaliadettenborn/sing-me-a-song-API?style=flat-square) 

<br><br>
## About
<p>
  API to provide music recommendation.<br><br>
</p>


<br><br><br>
<p align="center">
  <a style='color:inherit' href="#pré-requisites">Pre-requisites</a> •
  <a style='color:inherit' href="#running-the-web-applications">Running the web application</a> •
  <a style='color:inherit' href="#features">Features</a> •
  <a style='color:inherit' href="#rest">REST API</a> •
  <a style='color:inherit' href="#tech">Tech Stack</a> •
  <a style='color:inherit' href="#deploy">Deploy</a> •
  <a style='color:inherit' href="#contributors">Contributors</a> •
  <a style='color:inherit' href="#author">Author</a>
</p>

<br><br>
## Pre-requisites

Before you begin, you will need to have the following tools installed on your machine: [Git] (https://git-scm.com), [Node.js] (https://nodejs.org/en/). In addition, it is good to have an editor to work with the code like [VSCode] (https://code.visualstudio.com/)

<br><br>
## Running the web application
```bash
# Clone this repository
$ git clone <https://github.com/thaliadettenborn/sing-me-a-song-API.git>

# Access the project folder cmd/terminal
$ cd sing-me-a-song-API

# Install the dependencies
$ npm install

# Create a file of environment variables at the root of the project
$ touch .env

# Set the database port and link as environment variable according to the ".env.example" file

# Run the app
$ npm start

# The server will automatically start

# Run the tests
$ npm test

```

<br><br>
## Features
- [x] Create a new music genre<br>
- [x] List all registered genres<br>
- [x] Create a new musical recommedation<br> 
- [x] Vote on a recommendation whether you liked it or not (upvote / downvote)<br> 
- [x] Recommendations with a score less than -5 are automatically excluded<br> 
- [x] Receive a song recommendation at random<br> 
- [x] Receive a song recommendation at random from a specific genre<br> 
- [x] List all recommendations for a specific genre<br> 
- [x] List a specific amount of songs with the highest score<br> 

<br><br>

<br><br>
## REST API
<br>
Documentation: https://documenter.getpostman.com/view/13440732/TVzPnKCb
<br><br>

### `GET /genres`

#### Request
    curl --location --request GET 'https://sing-me-a-song.herokuapp.com/api/genres'

#### Response

    HTTP/1.1 200 OK
    Sat, 02 Jan 2021 21:11:47 GMT
    Status: 200 OK
    Connection: keep-alive
    application/json; charset=utf-8
    X-Powered-By: Express

    [
      {
        "id": 1,
        "name": "forró"
      }
    ]

<br><br>

### `POST /genres`

#### Request
    curl --location --request POST 'https://sing-me-a-song.herokuapp.com/api/genres' \
    --data-raw '{"name": "Forró"}'
#### Response

    HTTP/1.1 201 Created
    Sat, 02 Jan 2021 21:11:47 GMT
    Status: 201 Created
    Connection: keep-alive
    application/json; charset=utf-8
    X-Powered-By: Express

    {
      "id": 1,
      "name": "forró"
    }


<br><br>

### `POST /recomendations`

#### Request
    curl --location --request POST 'https://sing-me-a-song.herokuapp.com/api/recomendations' \
    --data-raw '{
          "name": "Barões da Pisadinha - Recairei",
          "genresIds": [1],
          "youtubeLink": "https://www.youtube.com/watch?v=k4xGU8xoA6w"
    }'
#### Response

    HTTP/1.1 201 Created
    Sat, 02 Jan 2021 21:11:47 GMT
    Status: 201 Created
    Connection: keep-alive
    application/json; charset=utf-8
    X-Powered-By: Express

    {
      "id": 2,
      "name": "Barões da Pisadinha - Recairei",
      "youtubeLink": "https://www.youtube.com/watch?v=k4xGU8xoA6w",
      "score": 0,
      "genres": [
        {
          "id": 1,
          "name": "forró"
        }
      ]
    }

<br><br>

### `GET /recomendations/random`

#### Request
  curl --location --request GET 'https://sing-me-a-song.herokuapp.com/api/recomendations/random'
#### Response

    HTTP/1.1 200 OK
    Sat, 02 Jan 2021 21:11:47 GMT
    Status: 200 OK
    Connection: keep-alive
    application/json; charset=utf-8
    X-Powered-By: Express

    {
      "id": 1,
      "name": "Barões da Pisadinha - Basta você me ligar",
      "youtubeLink": "https://www.youtube.com/watch?v=k4xGU8xoA6w",
      "score": 0,
      "genres": [
        {
          "id": 1,
          "name": "forró"
        }
      ]
    }


<br><br>

### `POST /recomendations/:id/upvote`

#### Request
  curl --location --request POST 'https://sing-me-a-song.herokuapp.com/api/recomendations/1/upvote'

#### Response

    HTTP/1.1 200 OK
    Sat, 02 Jan 2021 21:11:47 GMT
    Status: 200 OK
    Connection: keep-alive
    application/json; charset=utf-8
    X-Powered-By: Express

<br><br>

### `POST /recomendations/:id/downvote`

#### Request
  curl --location --request POST 'https://sing-me-a-song.herokuapp.com/api/recomendations/2/downvote'
#### Response

    HTTP/1.1 200 OK
    Sat, 02 Jan 2021 21:11:47 GMT
    Status: 200 OK
    Connection: keep-alive
    application/json; charset=utf-8
    X-Powered-By: Express

<br><br>

### `GET /api/genres/:id`

#### Request
  curl --location --request GET 'https://sing-me-a-song.herokuapp.com/api/genres/1'
#### Response

    HTTP/1.1 200 OK
    Sat, 02 Jan 2021 21:11:47 GMT
    Status: 200 OK
    Connection: keep-alive
    application/json; charset=utf-8
    X-Powered-By: Express

    {
      "id": 1,
      "name": "forró",
      "recomendations": [
        {
          "id": 1,
          "name": "Barões da Pisadinha - Basta você me ligar",
          "youtubeLink": "https://www.youtube.com/watch?v=k4xGU8xoA6w",
          "score": 3
        },
        {
          "id": 2,
          "name": "Barões da Pisadinha - Recairei",
          "youtubeLink": "https://www.youtube.com/watch?v=k4xGU8xoA6w",
          "score": -1
        }
      ],
      "scoreGenre": 2
    }

<br><br>

### `GET /recomendations/genres/:id/random`

#### Request
  curl --location --request GET 'https://sing-me-a-song.herokuapp.com/api/recomendations/genres/1/random'
#### Response

    HTTP/1.1 200 OK
    Sat, 02 Jan 2021 21:11:47 GMT
    Status: 200 OK
    Connection: keep-alive
    application/json; charset=utf-8
    X-Powered-By: Express

    {
      "id": 1,
      "name": "Barões da Pisadinha - Basta você me ligar",
      "youtubeLink": "https://www.youtube.com/watch?v=k4xGU8xoA6w",
      "score": 3,
      "genres": [
        {
          "id": 1,
          "name": "forró"
        }
      ]
    }




<br><br>
## Tech Stack
Languages:<br>
<p align="center">
  <img src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>
  <img src="https://img.shields.io/badge/markdown-%23000000.svg?&style=for-the-badge&logo=markdown&logoColor=white"/>
</p>
<br>


The following tools and frameworks were used in the construction of the project:<br>
<p align="center" style='display: flex; justify-content: center; flex-wrap:wrap; align-items: center; margin: 0 50px;'>
  <img style='margin: 5px;' src="https://img.shields.io/badge/node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/express.js%20-%23404d59.svg?&style=for-the-badge"/>
  <img style='margin: 5px;' src='https://img.shields.io/badge/cors%20-%2314354C.svg?&style=for-the-badge&logo=cors&logoColor=white"'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/dotenv-%2300ADD8.svg?&style=for-the-badge&logo=dotenv&logoColor=white'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/jest%20-%235B2F33.svg?&style=for-the-badge&logo=jest&logoColor=white'>
  <img style='margin: 5px;' src="https://img.shields.io/badge/joi-%23276DC3.svg?&style=for-the-badge&logo=joi&logoColor=white"/>
  <img style='margin: 5px;' src='https://img.shields.io/badge/nodemon%20-%23239120.svg?&style=for-the-badge&logo=nodemon&logoColor=4F4D3F'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/pg%20%20-%232E7EEA.svg?&style=for-the-badge&logo=pg&logoColor=4F4D3F'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/string-strip%20html%20%20-%232E7EEA.svg?&style=for-the-badge&logo=string_strip_html&logoColor=4F4D3F'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/supertest%20-%23000.svg?&style=for-the-badge&logo=supertest&logoColor=4F4D3F'>
  <img style='margin: 5px;' src="https://img.shields.io/badge/eslint%20-%234B275F.svg?&style=for-the-badge&logo=eslint"/>


</p>

<br>
  Database:
  <img style='margin-left: 10px;' src ="https://img.shields.io/badge/postgres-%23316192.svg?&style=for-the-badge&logo=postgresql&logoColor=white"/>

<br>
Version Control:
<img style='margin-left: 10px;' src="https://img.shields.io/badge/git%20-%23F05033.svg?&style=for-the-badge&logo=git&logoColor=white"/>
<img style='margin-left: 5px;'  src="https://img.shields.io/badge/github%20-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white"/>

<br><br>
## Deploy

The application layout is available on Heroku:
<a style='margin-left: 10px;' href='https://sing-me-a-song.herokuapp.com/'><img src="https://img.shields.io/badge/heroku%20-%23430098.svg?&style=for-the-badge&logo=heroku&logoColor=white"/></a>

<br><br>
## Contributors
<table>
  <tr>
    <td align="center"><a href="https://github.com/responde-ai"><img style="border-radius: 50%;" src="https://avatars3.githubusercontent.com/u/40724166?s=200&v=4" width="100px;" alt=""/><br /><sub><b>Responde Aí</b></sub></a><br />
  </tr>
</table>

<br><br>
## Author
---
<br>
<p align='center'>
  <img src="https://avatars0.githubusercontent.com/u/70967247?s=460&u=0684339f0717ae41ce18689351f0215fdf270590&v=4" width="100px;" style="border-radius: 50%;"/>
  <br><br>
  Made by Thalia Roberta Dettenborn 👋🏽 Get in Touch!<br>
  <a href="https://www.linkedin.com/in/thaliarobertadettenborn/"><img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white"/></a>
  <a href="mailto:thalia.born@gmail.com"><img src="https://img.shields.io/badge/gmail-D14836?&style=for-the-badge&logo=gmail&logoColor=white"/></a>
  <a href="https://github.com/thaliadettenborn"><img src="https://img.shields.io/badge/github-%23100000.svg?&style=for-the-badge&logo=github&logoColor=white" /></a>
</p>
