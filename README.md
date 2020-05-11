# beer-backend-rest-api
=========================

Design, implement and automatically test a backend REST API for a craft beer enthousiasts app.


### Run the application

- `git clone` the repo onto your laptop.
- Make sure you have (a recent version of) [https://nodejs.org](Node.js) installed.
- Within the project directory run `npm install` once. After that, you can start the project using `npm run watch`.
- Start the Cypress testing environment using `npm run cypress`.


### Requirements

#### Functional

*Users*
- Clients should be able to receive a JWT token, based on a correct user name and password pair. This JWT token **must be part of all other requests** (as either a header or a query parameter) for authentication and authorization.
- Any user should be able to retrieve a list of all users.
- Admins (and not regular users) should be able to create new users, specifying name, password and whether the new user should be admin. 

*Beers*
- Any user should be able to retrieve a list of beers. Besides the obvious list of fields, each entry should contain the beer's popularity (number of likes). The following additional features should be combinable:
  - Filtering to only include beers from a given brewery. 
  - Filtering to only include beers of a given category.
  - Filtering to only include beers with a given maximum alcohol percentage.
  - Filtering to only include beers with a given minimum alcohol percentage.
  - Ordering the output either by name or popularity.
- Admins (and not regular users) should be able to create new beers. All fields should be checked for presence and type ('string'/'number'). The beer id should be generated by the database (hint: lastInsertRowid) and returned as part of the response body.
- Admins (and not regular users) should be able to delete beers by id.

*Likes*
- Any user should be able to retrieve the list of liked beers for any (other) user by id.
- Users should be able to 'like' a beer.
- Users should be able to 'unlike' a beer.
