const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


let dummyTodos = [{
	_id: new ObjectID(),
	text: "first sample"
},{
	_id: new ObjectID(),
	text: "second sample"
}
]

beforeEach((done) => {
	// Todo.remove({}).then(() => done());

	Todo.remove({}).then(() => {
		return Todo.insertMany(dummyTodos);
	}).then(() => done());
});

describe('GET /todos', () => {

	it('should return all todo documents', (done) => {

		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});

	it('should return one todo document', (done) => {

		request(app)
			.get(`/todos/${dummyTodos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(dummyTodos[0].text);
			})
			.end(done);
	});

	it('should return 404 if not found', (done) => {
		const phonyId = new ObjectID().toHexString;
		request(app)
			.get(`/todos/${phonyId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non object ids', (done) => {

		request(app)
			.get(`/todos/123`)
			.expect(404)
			.end(done);
	});
});

describe('POST /todos', () => {

	// it('should create a new todo document', (done) => {
	// 	let text = 'testing123';

	// 	request(app)
	// 		.post('/todos')
	// 		.send({
	// 			text
	// 		}) // sends the body expected of a POST
	// 		.expect(200)
	// 		.expect((res) => {
	// 			expect(res.body.text).toBe(text);
	// 		})
	// 		.end((err, res) => { // testing to check if something made it into the db
	// 			if(err){
	// 				return done(err);
	// 			}

	// 			Todo.find({text}).then((todos) => {
	// 				expect(todos.length).toBe(1);
	// 				expect(todos[0].text).toBe(text);
	// 				done();
	// 			}).catch((e) => done(e));
	// 		});
	// });

	it('should not create todo with invalid body data', (done) => {

		request(app)
			.post('/todos')
			.send({}) // sends the body expected of a POST
			.expect(400)
			.end((err, res) => { // testing to check if something made it into the db
				if(err){
					done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});

});

describe('DELETE /todos', () => {

	it('should delete one todo document', (done) => {
		let selectedDeleteId = dummyTodos[0]._id.toHexString();
		request(app)
			.delete(`/todos/${selectedDeleteId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(selectedDeleteId);
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}
				Todo.findById(selectedDeleteId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 for non object ids', (done) => {

		request(app)
			.delete(`/todos/123`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if not found', (done) => {
		const phonyId = new ObjectID().toHexString;
		request(app)
			.delete(`/todos/${phonyId}`)
			.expect(404)
			.end(done);
	});
});