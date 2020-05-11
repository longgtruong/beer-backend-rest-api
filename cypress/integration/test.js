describe('Users', function(){
	it('retrieves list of users', function(){
		cy.request({
			url:'/users'
		}).then(function(response){
			expect(response.body).to.be.an('array')	
		})
	})
	it('receive a JWT token, based on correct username and password', function(){
		cy.request({
			method:'POST',
			url:'/login',
			body:{
				username:"user", 
				password:"user"
			},
			failOnStatusCode: false
		}).then(function(response){
			expect(response.body).to.have.property('token');
		})
	})
	it('retrieve list of beers', function(){
		cy.request({
			'url':'/beers',
			headers:{
				'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJ1c2VyIiwiYmNyeXB0UGFzc3dvcmQiOiIkMmIkMTIkYVNDNGkwcHVIbUJoRU9QZG0vb2NLT0pENFNlM0tpYWpXTXpudmR4NHZOLnAuL3lFV2Z1ZWUiLCJsZXZlbCI6MX0sImlhdCI6MTU2OTgzNDc1OH0.4oRcIMHoZxAjfXZU9vFaK0616N2be6VZljdqR-UlNNY'
			}
		}).then(function(response){
			expect(response.body).to.be.an('array');
		})
	})
	it('retrieve list of liked beers', function(){
		cy.request({
			'url':'/likes',
			headers:{
				'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJ1c2VyIiwiYmNyeXB0UGFzc3dvcmQiOiIkMmIkMTIkYVNDNGkwcHVIbUJoRU9QZG0vb2NLT0pENFNlM0tpYWpXTXpudmR4NHZOLnAuL3lFV2Z1ZWUiLCJsZXZlbCI6MX0sImlhdCI6MTU2OTg0MzAyMH0.1gM1EgXyTB7MKpzXEsuOGl0u7fFbjxbgpMBD_ltcmd4'
			}
		}).then(function(response){
			expect(response.body).to.be.an('array');
		})
	})
	it('liked a beer', function(){
		cy.request({
			'method':'POST',
			'url':'/likes',
			qs:{
				'beerId':'4'
			},
			headers:{
				'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJ1c2VyIiwiYmNyeXB0UGFzc3dvcmQiOiIkMmIkMTIkYVNDNGkwcHVIbUJoRU9QZG0vb2NLT0pENFNlM0tpYWpXTXpudmR4NHZOLnAuL3lFV2Z1ZWUiLCJsZXZlbCI6MX0sImlhdCI6MTU2OTg0MzAyMH0.1gM1EgXyTB7MKpzXEsuOGl0u7fFbjxbgpMBD_ltcmd4'
			}
		}).then(function(response){
			expect(response.body.message).to.eq('successfully liked beer with id: 4');
		})
	})
	it('unliked a beer', function(){
		cy.request({
			'method':'DELETE',
			'url':'/likes',
			qs:{
				'beerId':'1'
			},
			headers:{
				'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJ1c2VyIiwiYmNyeXB0UGFzc3dvcmQiOiIkMmIkMTIkYVNDNGkwcHVIbUJoRU9QZG0vb2NLT0pENFNlM0tpYWpXTXpudmR4NHZOLnAuL3lFV2Z1ZWUiLCJsZXZlbCI6MX0sImlhdCI6MTU2OTg0MzAyMH0.1gM1EgXyTB7MKpzXEsuOGl0u7fFbjxbgpMBD_ltcmd4'
			}
		}).then(function(response){
			expect(response.body.message).to.eq('successfully unliked beer with id: 1');
		})
	})
})

describe('Admin', function(){
	it('create new users', function(){
		cy.request({
			method:'POST',
			url:'/users',
			body:{
				username:'long',
				password:'long',
				level:9
			},
			failOnStatusCode: false,
			headers:{
				'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJhZG1pbiIsImJjcnlwdFBhc3N3b3JkIjoiJDJiJDEyJDlCd3l6cmtDQmlvZWRjNi5ZTGg2eE84aldwSGZNZU42aHJndU1SN3FBWTdtOENTR3J0OFNpIiwibGV2ZWwiOjl9LCJpYXQiOjE1Njk4MjkwOTR9.xy2CB1zET9tnV3n2pe7sopu9crXXDT2IVEdAsz59xi4'
			}
		}).then(function(response){
			expect(response.body.message).to.eq('successfully posted');
		})
	})
	it('create new beers', function(){
		cy.request({
			method:'POST',
			url:'/beers',
			body:{
				"name":"Beer1",
				"percentage":30,
				"brewery":"BrewDog",
				"category":"India Pale Ale"
			},
			headers:{
				'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJhZG1pbiIsImJjcnlwdFBhc3N3b3JkIjoiJDJiJDEyJDlCd3l6cmtDQmlvZWRjNi5ZTGg2eE84aldwSGZNZU42aHJndU1SN3FBWTdtOENTR3J0OFNpIiwibGV2ZWwiOjl9LCJpYXQiOjE1Njk4MjkwOTR9.xy2CB1zET9tnV3n2pe7sopu9crXXDT2IVEdAsz59xi4'
			},
			failOnStatusCode: false,
		}).then(function(response){
			expect(response.body.message).to.eq('successfully posted');
		})
	})
})