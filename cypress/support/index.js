beforeEach(function () {
	// Ask the API to reset the database before each test
	cy.request('PUT', '/resetDatabase');
});

// This is the way to add your own methods to the Cypress `cy` object, for
// easy use in all of your tests.
// You can modify the following example in order to help you make
// authenticated requests.
Cypress.Commands.add("userRequest", function(credentials, requestObj) {

	// Make a login request, returning a JWT token
	cy.request({
		method: '?', // your API's HTTP method for logging in
		url: '/?', // your API's path for logging in
		body: credentials // user name and password?
	}).then(function(response) {
		// Assuming your api returned a 'token' key in the response body object,
		// we could:
		requestObj.headers = requestObj.headers || {};
		requestObj.headers.Authentication = response.body.token;
		// Now issue the actual request
		return cy.request(requestObj);
	});

	// For speedy testing, you may want to cache authorization tokens, as logging
	// in with bcrypt is (intentionally) slow.
});

