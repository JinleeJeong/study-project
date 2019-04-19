const express = require('express');
const Messages = require('../../models/Message');
const router = express.Router();
const User = require('../../models/Users');
const {ensureAuthenticatedErrorMessage,ensureAuthenticatedRedirect} = require('../../config/passport');

// 특정 유저에게 온 message를 보내주는 router
router.post('/', ensureAuthenticatedErrorMessage ,(req,res,next) => {
  const {total, showNum, page} = req.body;
  if (total === null){
    Messages.find({recipient : ObjectId(req.user.id)}).sort({$natural : -1})
      .populate('sender', 'email name image')
      .exec((err,data) =>{
        if (err)
          next(err);
        
        res.send({ 
          data:{
            list: data.slice(0,showNum),
            total: data.length,
            page : page
          },
          state: 'success',
          message: ''
          });
      });
  }else {
    Messages.find({recipient: ObjectId(req.user.id)}).sort({$natural : -1}).skip((page-1) * showNum).limit(showNum)
      .populate('sender', 'email name image')
      .exec((err,data) =>{
        if (err)
          next(err);
        
        res.send({
          data:{
            list: data,
            total: total,
            page: page
          },
          state:'success',
          message:''
        });
      });
  }
});

// 현재 읽지 않은 message의 개수를 반환하는 router
router.post('/unseenmessages',ensureAuthenticatedErrorMessage,(req,res,next)=>{
  if (req.user){
    Messages.countDocuments({recipient: ObjectId(req.user.id), seen: false})
      .then(num=> res.send({unseenNumber: num}))
      .catch(err=> next(err));   
  }else{
    res.send("로그인이 필요합니다.")
  }
});

router.post('/remove',ensureAuthenticatedErrorMessage,(req,res,next)=>{
  const messageObj = req.body;
  const objToList = Object.keys(messageObj).map((each)=> (ObjectId(each)));

  Messages.deleteMany({_id : {'$in': objToList}})
    .then((opRes)=> res.send({state: 'success', number: opRes.deletedCount ,message:'메시지 삭제를 완료했습니다.'}))
    .catch(err=> next(err));  
});

router.post('/send',ensureAuthenticatedErrorMessage,(req,res,next)=> {
  const {recipientEmail, messageTitle, messageBody, senderId} = req.body;
  
  User.findOne({email: recipientEmail}, '_id')
    .exec((err, data) => {
      if (err)
        next(err);
      if (!data)
        res.send({state: 'error', message: '존재하지 않는 아이디입니다.'});
      else{
        console.log(data);
        const message = {
          title: messageTitle,
          body: messageBody,
          recipient: data._id,
          sender: senderId
        };

        newMessage = new Messages(message);
        
        newMessage.save()
          .then(message=> {
            res.send({state: 'success', message: '쪽지 전송을 완료했습니다.'});
          })
          .catch(err=> next(err));
      }
      
    })
});

router.post('/seenCheck',ensureAuthenticatedErrorMessage,(req,res,next)=>{
  const {messageId} = req.body;
  Messages.update({_id: messageId}, {seen: true})
    .exec((err) =>{
      if(err)
        next(err);
      res.send("success");
    });
});

module.exports = router;