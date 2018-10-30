let mongoose = require('mongoose');

const User = mongoose.model('User', {
	email:{
		type:String,
		required:true,
		minlength:1,
		trim: true
	},
	age:{
		type:Number,
		default: null
	}
});

module.exports = {
	User
};