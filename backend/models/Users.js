const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  interests: {
    type: Array,
  },
  image: {
    type: String
  },
  sex: {
    type : String,
  },
  birth: {
    type : Date,
  },
  about: {
    type : String,
  },
  date :{
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  strategy : {
    type: String,
    default : 'local',
  }
});

UserSchema.pre('remove',function (next){
  console.log(this);
  this.model('messages').remove({$or:[
    {sender: this._id},
    {recipient: this._id}
  ]},(err,res)=>{
    console.log("triggered2");
    next();
  });
  // + 자신이 쓴 게시글, 자신이 참여한 스터디에서 참여 취소하기
})

let User = module.exports = mongoose.model('users',UserSchema);

module.exports.hashPassword = (password) => {

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password,salt);
  return hash;
}

module.exports.checkExistingUser = (user) => {
  
  return User.findOne({email : user.email})
    .then((err,user) => {
      if (err)
        return new Error('계정 중복 검사 실패');
      if (!user) // 이미 가입하지 않은 경우
        return false;
      else // 가입한 경우
        return true;
    });  
}