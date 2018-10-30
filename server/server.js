let express = require('express');
let bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let app = express();

app.listen(3000, () => {
	console.log('Listening on port 3000');
});

app.use(bodyParser.json());

app.get('/todos', (req, res) => {

	Todo.find().then((todos) => {
		res.send({
			todos
		});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {

	let todoId = req.params.id;
	if(!ObjectID.isValid(todoId)){
		res.status(404).send();
	}

	Todo.findById(todoId).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send()
	});
	

});

app.post('/todos', (req, res) => {
	let newTodo = new Todo({
		text:req.body.text
	});

	newTodo.save().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.delete('/todos/:id', (req, res) => {

	let todoId = req.params.id;
	if(!ObjectID.isValid(todoId)){
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(todoId).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		return res.status(400).send(e);
	});
});

module.exports.app = app;

//create new object based on the model
// let newTodo = new Todo({
// 	text:'Make Breakfast',
// 	completed:true
// });
// let newUser = new User({
// 	email:'test@gmail.com',
// 	age:24
// });

//save to the database
// newTodo.save().then((doc) => {
// 	console.log('Todo saved');
// }, (e) => {
// 	console.log('unable to save todo', doc);
// });
// newUser.save().then((doc) => {
// 	console.log('User saved');
// }, (e) => {
// 	console.log('unable to save User', doc);
// });