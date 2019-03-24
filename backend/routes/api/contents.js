
const express = require('express');
const router = express.Router();
const Contents = require('../../models/Contents.js');
const multer = require('multer');
const maxSize = 5 * 1024 * 1024;
const basicImgPath = 'coverImg\\study-basic.jpg';

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './coverimg/');
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
        
    }
});
const upload = multer({
    storage: storage, 
    limits : { fileSize : maxSize },
    fileFilter : (req, file, callback) => {
      if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/bmp') {
        console.log(file);
        req.fileValidationError = '이미지 파일 형식이 아닙니다.';
        return callback(null, false, new Error('이미지 파일 형식이 아닙니다.'));
      }
      callback(null, true);
    }
}).single('coverImg');

/* GET ALL Contents */
router.get('/', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    res.json(contents);
  });
});

/* SAVE Contents formData로 들어온 데이터 저장 + imageUrl스키마 필드에 파일 경로 저장*/
router.post('/', upload, (req, res, next) => {
  const imageUrl = req.file ? req.file.path : basicImgPath;
  Contents.create({ ...req.body, categories: req.body.categories.split(","), imageUrl: imageUrl }, (err, post) => {
    if (err) return next(err);
    req.file ?
    upload(req, res, () => {
      if(req.fileValidationError) {
          return res.send(req.fileValidationError);
      }
      else
          return res.send('/coverimg/' + req.file.filename);
    }) : res.send('/coverimg/study-basic.jpg');
  });
});

router.get('/representation1', (req, res, next) => { 
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  }).sort({views : -1})   
    .where('categories').in(['면접'])
    .limit(4);
});

router.get('/representation2', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  .sort({views : -1})
  .where('categories').in(['영어'])
  .limit(4);
});

router.get('/new', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  .sort({id : -1})
  .limit(4);
});

router.get('/attention1', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  // .sort({createdAt : 1})
  .limit(4);
});

router.get('/attention2', (req, res, next) => {
  Contents.find((err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })
  // .sort({views : -1})
  // .where('category').in(['면접'])
  .limit(4);
});

router.get('/context/:id', (req, res, next) => { 
  Contents.find({categories : req.params.id},(err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  }); 
});

router.get('/detail/:id', (req,res,next) => {
  Contents.findOneAndUpdate({ id: req.params.id },{ $inc: { views: 1 } }, (err, contents) => {
    if (err) return next(err);
    //console.log(res);
    res.json(contents);
  })});
  

module.exports = router;