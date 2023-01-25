
const handleRegister = (db, bcrypt)=> (req, res)=>{
   const  {username, email, password} = req.body; 
   if(!username || !email || !password){
      return res.status(400).json('empty input');
   }
   const hash = bcrypt.hashSync(password);  //just store the password as hash
   db.transaction( trx => {
   	trx.insert({
   		hash:hash,
   		email:email
   	})
   	.into('login')
   	.returning('email') //return an array
   	.then(loginEmail => {
   		return trx('users')
   		.returning('*')     //specifiy which column should be returned
   		.insert({
		   	username: username,
		   	email: loginEmail[0].email,
		   	joined: new Date()
   		})
   		.then(user => {
   			res.json(user[0]);
   		})
   	})
   	.then(trx.commit)
   	.catch(trx.rollback)
   })
   .catch(err => res.status(400).json('unable to register'))
}

// module.exports = {
//    handleRegister
// };

export default handleRegister;