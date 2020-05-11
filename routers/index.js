let router = module.exports = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// You code goes here!! (and of course in files you'll require() from here)

const verifyToken = function(req,rsp,next) {
	var bearerHeader = req.headers['authorization']
	if (bearerHeader) {
		var token=bearerHeader.split(' ')[1];
		req.token=token
		next();
	} else {
		rsp.sendStatus(403);
	}
}


router.post('/login', function(req,rsp){
	req.db.get(
		'select * from users where (name=$name)',
		{
			$name:req.body.username,
		},
		function(err, data) {
			bcrypt.compare(req.body.password, data.bcryptPassword, function(err, res) {
				if (res) {		
					jwt.sign({data},'secretkey',function(err,token) {
					rsp.json({token});
					})	
				} else {
					rsp.json({message:"incorrect password / username"});
				}
			});			
		}
	)
})

router.get('/users', function(req,rsp){
	req.db.all('select * from users', function(err,data){
		if(data) rsp.json(data)
		else rsp.status(404).json(err)
	})
})

router.post('/users', verifyToken, function(req,rsp){
	const { username, password, level } = req.body
	jwt.verify(req.token,'secretkey', function(err,authData){
		if (authData.data.level<9) {
			rsp.sendStatus(403);
		} else {
			if (username && password && level) {
				bcrypt.hash(password,saltRounds,function(err,hash){
					req.db.run(
						'insert into users(name,bcryptPassword,level) values($name,$password,$level)',
						{
							$name:username,
							$password:hash,
							$level:level
						}, function(err) {
							if(err) rsp.json({message:"error in post /users"})
							else rsp.status(200).json({message:"successfully posted"});
						}
					);
				})
			} else {
				rsp.status(404).json("error");
			}
		}
	})
})


router.get('/beers', verifyToken, function(req,rsp) {
	jwt.verify(req.token,'secretkey',function(err,auth) {
		if (err) {
			rsp.sendStatus(403);
		} else {
			var minPercentage,maximumPercentage;
			if(req.query.min) {
				 minPercentage = req.query.min; 
			} else {
				minPercentage=0;
			}
			if (req.query.max) {
				maximumPercentage = req.query.max
			} else {
				maximumPercentage = 9999999999999;
			}
			req.db.all(
				'select id,name,percentage,brewery,category, count(beerId) as likes from beers left join likes on beers.id=likes.beerId where (brewery=$brewery or $brewery is null) and (category=$category or $category is null) and (percentage > $min and percentage < $max) group by id order by likes desc',
				{
					$brewery:req.query.brewery,
					$category:req.query.category,
					$min:minPercentage,
					$max:maximumPercentage
				},
				function(err, data) {
				if (data) rsp.status(200).json(data);
				else rsp.status(404).json({error: "error"});
			})
		}
	})
})

router.post('/beers', verifyToken, function(req,rsp){

	const { name, percentage, brewery, category } = req.body;
	jwt.verify(req.token,'secretkey', function(err,authData) {
		if (err) {
			rsp.status(403).json({message:"failed to authenticate"});
		} else {
			// check regular users
			if(authData.data.level<9){
				rsp.json("Regular users are not allowed to add new beer");
			} else {
				if (typeof name === 'string' && typeof percentage === 'number' && typeof brewery === 'string' && typeof category === 'string' ) {
				req.db.run(
					'insert into beers(id,name,percentage,brewery,category) values($id,$name,$percentage,$brewery,$category)',
					{
						$id:this.lastID++,
						$name:name,
						$percentage:percentage,
						$brewery:brewery,
						$category:category
					}, function(err) {
						if(err) rsp.json({message:"error in post /beers"})
						else rsp.status(200).json({message:"successfully posted"});
					}
				);
				} else {
					rsp.json({message:"invalid beer"})
				}
			}
		}
	})
})

router.get('/likes', verifyToken, function(req,rsp){
	jwt.verify(req.token,'secretkey', function(err,authData) {
		if (err) {
			rsp.status(403).json({message:"failed to authenticate"});
		} else {
			req.db.all(
				'select * from likes', function(err,data) {
					if (data) rsp.status(200).json(data);
					else rsp.status(404).json({message:"error"});
				}
			)
		}
	})

})

router.get('/tests', function(req,rsp){
	req.db.all(
		'select id,name,percentage,brewery,category, count(beerId) as likes from beers left join likes on beers.id=likes.beerId group by id', function(err,data){
			if(data) rsp.json(data)
			else rsp.sendStatus(404);
		}
	)
})

router.post('/likes', verifyToken, function(req,rsp){
	var { beerId } = req.query
	jwt.verify(req.token,'secretkey', function(err,authData) {
		if (err) {
			rsp.status(403).json({message:"failed to authenticate"});
		} else {
			req.db.get(
				'select * from beers where id=$beerId',{$beerId:beerId}, function(err,data){
					if (data) {
						req.db.run(
							'insert into likes(userName,beerId) values($username,$beerId)',
							{
								$username:authData.data.name,
								$beerId:beerId
							}, function(err) {
								if(err) rsp.json({message:"user has already liked"})
								else rsp.status(200).json({message:"successfully liked beer with id: " + beerId})
							}
						)
					} 
					else {
						rsp.status(404).json({message:"no such beer"})
					}
				}
			)
		}
	})
})

router.delete('/likes', verifyToken, function(req,rsp){
	var { beerId } = req.query
	jwt.verify(req.token,'secretkey',function(err, authData){
		if (err) {
			rsp.status(403).json({message:"failed to authenticate"});
		} else {
			req.db.get(
				'select * from likes where userName=$name',
				{
					$name:authData.data.name
				}, function(err,data) {
					if (data) {
						req.db.run(
							'delete from likes where beerId=$beerId',
							{
								$beerId:beerId
							}, function(err) {
								if(err) rsp.json({message:"error in delete /likes"})
								else rsp.status(200).json({message:"successfully unliked beer with id: "+ beerId})
							}
						)
					} else {
						rsp.status(404).json({message:"user hasn't liked this beer"})
					}
				}
			)
		}
	})
})

router.use(function(req,rsp) {
	rsp.status(404).json({error: "No such route"})
});


