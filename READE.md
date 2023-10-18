# Users and Business Cards API

A server-side project who was written in Node.js, that manages requests (and errors) of creating users with different permission levels, the users can create business cards with several characteristics, each user according to his permission level.

## Order of project installation operations

1. Clone the project from Git.
1. Type the following code in the terminal to install all the required libraries for the project.

```
npm i
```

3. Create a cloned file to the .env.example file only without the .example extension, with the help of this file you can create a connection to a local (mongoDB) or global (mongoDB Atlas) database by inserting values ​​for the parameters in the .env file you created.

4. For the development process, write the following code in the terminal:

```
npm run dev
```

5. For the development process, write the following code in the terminal:

```
npm run start
```

## Initial data

There is an option to seed initial information to the project, the operation empties the database (if there is anything in it) and creates 3 users according to different permission levels (normal, business, manager) and three business cards that will be associated with the user who has business permission but not administrative permission.
To perform this operation, write the following code in the terminal:

```
npm run seed-initialData
```

# Usage

## Models

Fixing the data model that the database expects to receive in order to create an object, if a mistake is made in inserting the data, an error will be given to the user by the 'mongoose' library that communicates with the database.

### User Model

```
{
  name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    middle: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  image: {
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      minlength: 11,
      maxlength: 1024,
    },
    alt: {
      type: String,
      minlength: 6,
      maxlength: 255,
      default: "User Image",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  address: {
    state: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    country: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    city: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    street: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    houseNumber: {
      type: String,
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    zip: {
      type: String,
      minlength: 0,
      maxlength: 12,
      default: "",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
```

### Card Model

```
{
  title: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  subtitle: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  description: {
    type: String,
    minlength: 6,
    maxlength: 1024,
    required: true,
  },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 10,
    required: true,
  },
  email: {
    type: String,
    minlength: 6,
    maxlength: 255,
    required: true,
  },
  web: {
    type: String,
    minlength: 11,
    maxlength: 1024,
    required: true,
  },
  image: {
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      minlength: 11,
      maxlength: 1024,
    },
    alt: {
      type: String,
      minlength: 6,
      maxlength: 255,
      default: "Card Image",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  address: {
    state: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    country: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    city: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    street: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    houseNumber: {
      type: String,
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    zip: {
      type: String,
      minlength: 0,
      maxlength: 12,
      default: "",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  bizNumber: {
    type: String,
    minlength: 3,
    maxlength: 999_999_999,
    required: true,
    unique: true,
  },
  likes: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}
```

## Routes

### User routes

| No. | URL          | Method | Authorization                | Action                     | Notice       | Return          |
| --- | ------------ | ------ | ---------------------------- | -------------------------- | ------------ | --------------- |
| 1.  | /users       | POST   | all                          | Register a user            | Unique email | User            |
| 2.  | /users/login | POST   | all                          | login                      |              | Encrypted token |
| 3.  | /users       | GET    | admin                        | Get all users              |              | Array of users  |
| 4.  | /users/id    | GET    | The registered user or admin | Get user                   |              | User            |
| 5.  | /users/id    | PUT    | The registered user          | Edit user                  |              | User            |
| 6.  | /users/id    | PATCH  | The registered user          | Change 'isBusiness' status |              | User            |
| 7.  | /users/id    | DELETE | The registered user or admin | Delete user                |              | Deleted user    |

The minimum details (The rest of the details are filled in automatically by the database or are not mandatory) that need to be transferred in order to register or edit a user:

```
{
    "name":{
        "first":"Israel",
        "last": "Israeli"
    },
    "phone":"0505555555",
    "email": "israel@israeli.com",
    "password": "Aa123456",
    "isBusiness": true,
    "address": {
        "state": "",
        "country":"Israel",
        "city":"Tel-Aviv",
        "street":"Rothschild",
        "houseNumber":"10"
    }
}
```

### Card routes

| No. | URL                       | Method | Authorization                          | Action           | Notice                                                                                                                        | Return         |
| --- | ------------------------- | ------ | -------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 1.  | /cards                    | GET    | all                                    | All cards        |                                                                                                                               | Cards          |
| 2.  | /cards/my-cards           | GET    | The registered user                    | Get user cards   |                                                                                                                               | Array of cards |
| 3.  | /cards/id                 | GET    | all                                    | Get card         |                                                                                                                               | Card           |
| 4.  | /cards                    | POST   | Business user                          | Create new card  |                                                                                                                               | Card           |
| 5.  | /cards/id                 | PUT    | The user who created the card          | Edit card        |                                                                                                                               | Card           |
| 6.  | /cards/id                 | PATCH  | The registered user                    | Like card        |                                                                                                                               | Card           |
| 7.  | /cards/id                 | DELETE | The user who created the card or admin | Delete card      |                                                                                                                               | Deleted card   |
| 8.  | /cards/changeBizNumber/id | PATCH  | Admin                                  | Change bizNumber | You can write any number you want (as long as it is not occupied by another card) or it will generate a random number for you | Card           |

The minimum details (The rest of the details are filled in automatically by the database or are not mandatory) that need to be transferred in order to create or edit a card:

```
{
    "title": "card title",
    "subtitle": "card subtitle",
    "description": "card description",
    "phone":"0509999999",
    "email": "card@biz.com",
    "web": "BizCards_Web",
    "address": {
        "state": "",
        "country":"Israel",
        "city":"Tel-Aviv",
        "street":"Ben Gurion Avenue",
        "houseNumber":"13"
    }
}
```

## Libraries

#### Libraries used by the project and their uses:

1. "nodemon": for a development process
1. "bcrypt": to encrypt passwords
1. "chalk": Paints messages in the console
1. "config": configuration
1. "cors": cors policy
1. "dotenv": environment variables
1. "express": requests for routes
1. "joi": validation
1. "jsonwebtoken": manage web token
1. "lodash": Built-in functions that shorten the code
1. "mongoose": Interfacing and running against mongoDB
1. "morgan": logging response messages
