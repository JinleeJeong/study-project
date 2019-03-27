import React, {Component} from 'react';
import {withRouter} from 'react-router'
import PropTypes from 'prop-types';
import apiClient from '../../helpers/apiClient';
import InputValidator from '../../helpers/InputValidator';
import FormChecker from '../../helpers/FormChecker';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green,red } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { AppContext } from '../../contexts/appContext';


const style = theme => ({
  container: {
    display: 'flex',
    flexDirection: "column",
    margin: 20,
  },

  input:{
    width: '100%'
  },

  TextField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },

  Button:{
    width: 300,
  },

  ButtonMargin:{
    marginTop:theme.spacing.unit,
  },

  ItemCenter: {
    alignSelf:'center'
  },

  GoogleCol:{
    color: 'white',
    backgroundColor : red[600],
    '&:hover': {
      backgroundColor: red[800],
    },
  },

  NaverCol:{
    color: 'white',
    backgroundColor: green[600],
    '&:hover': {
      backgroundColor: green[800],
    },
  },
  removeLinkDec: {
    textDecoration : 'none !important' 
  }
});

class SignUpForm extends Component {
  static contextType = AppContext;

  constructor(props){
    super(props);
    // formFieldInput : 해당 객체의 property에 사용자가 각 칸에 입력한 값들을 저장한다.
    // formFieldValid : 각 칸에 입력된 값 (formFiledInput 객체의 properties)의 상태를 저장한다(null, error, warning etc)  
    // formFieldMessage : 유효성 검사를 통과하지 못한 칸 아래에 나타낼 오류 메시지를 저장한다. 
    this.state = {
      formFieldInput : 
      {
        userName : '' ,
        email: '',
        password:'',
        passwordConfirmation : ''
      },
      formFieldValid :
      {
        userNameValid : null,
        emailValid : null,
        passwordValid : null,
        passwordConfirmationValid : null,
      },
      formFieldMessage :
      {
        userNameValError : '',
        emailValError : '',
        passwordValError : '',
        passwordConfirmationValError : ''
      }
    }

  this.onBlur = this.onBlur.bind(this);
  this.onChange = this.onChange.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
}

registrationApiCall (){
  apiClient.post('/users/register',{
    email: this.state.formFieldInput.email,
    password: this.state.formFieldInput.password,
    name: this.state.formFieldInput.userName,
  })
  .then(res => {
    this.context.actions.snackbarOpenHandler(res.message,res.state);
    
    if(res.message === "중복된 아이디입니다.")
      this.setValidationResult({
        fieldName: 'email',
        isCorrect: 'error',
        message: "이미 존재하는 아이디입니다."
      });
    this.props.history.push(res.url);
  })
  .catch(err=> console.log(err));
}

setValidationResult (validationResult){
  
  let {formFieldValid, formFieldMessage} = this.state;

  formFieldValid[validationResult['fieldName'] + 'Valid'] = validationResult['isCorrect'];
  formFieldMessage[validationResult['fieldName'] + 'ValError'] = validationResult['message'];
  
  return new Promise(resolve => this.setState (
    prevState => ({
      ...prevState,
      formFieldValid :  formFieldValid,
      formFieldMessage : formFieldMessage
    }), ()=> resolve(this.state)));
}

// 회원가입 버튼을 누를 때 실행되는 함수로서 사용자 입력 값의 유효성을 검사한 후 state를 업데이트한다. 
async validateChangedField(fieldName,value){
  
  let formChecker,validationResult;

  switch (fieldName){
    case 'userName' :
      // FormChecker 객체의 3번째 parameter는 만족해야 하는 유효성 정보 객체의 list이다. 
      // list에서 n번째 객체의 조건이 만족되어야 n+1번째 조건을 검사하게 된다.
      // 따라서 우선하여야 할 조건 순서를 고려하여 list를 구성해야 한다는 점에 유의해야 한다.
      formChecker = new FormChecker (fieldName,value,[
          {
            method : InputValidator.isNotEmpty,
            args : [],
            message : '공란일 수 없습니다'
          },
          {
            method : InputValidator.letterCondition,
            args : ['hangul','alphabet','number'],
            message : '한글, 알파벳, 숫자만 입력 가능합니다.'
          },
          {
            method : InputValidator.strLengthCondition,
            args : [{min : 2, max : 10}],
            message : 2 + ' 글자 이상 ' + 10 + ' 글자 이하여야 합니다' 
          }
      ]);
      break;

    case 'email' :
      formChecker = new FormChecker (fieldName,value,[
        {
          method : InputValidator.isNotEmpty,
          args : [],
          message : '공란일 수 없습니다'
        },
        {
          method : InputValidator.validate.isEmail,
          args : [],
          message : '올바른 이메일 형식이 아닙니다'
        }
      ]);
      break

  case 'password' :
    formChecker = new FormChecker (fieldName,value,[
      {
        method : InputValidator.isNotEmpty,
        args : [],
        message : '공란일 수 없습니다'
      },
      {
        method : InputValidator.passwordStrengthCondition,
        args : [],
        message : '특수문자 포함 최소 8자 ~ 최대 20자 이내로 입력합니다.'
      }
    ]);
    break;

  case 'passwordConfirmation' :

    formChecker = new FormChecker (fieldName,value,[
      {
        method : InputValidator.isNotEmpty,
        args : [],
        message : '공란일 수 없습니다'
      },
      {
        method : InputValidator.sameAsPassword,
        args : [{confirmationStr : this.state.formFieldInput.password}],
        message : '비밀번호가 일치하지 않습니다'
      }
    ]);
    break;

  default :
    break;

  }
      
  validationResult = formChecker.validate();  
  return await this.setValidationResult(validationResult);
}

onChange = name => e => {
  const value = e.target.value;

  this.setState(prevState =>({
      formFieldInput:{
          ...prevState.formFieldInput,
          [name] : value
      }
  }));
}

onBlur = name => e => {
  const value = e.target.value;

  this.validateChangedField (name,value)
}

onSubmit(e){
  //you cannot return false to prevent default behavior in React. You must call preventDefault explicitly. 
  e.preventDefault();

  for (const [field, value] of Object.entries(this.state.formFieldInput)){
    this.validateChangedField(field,value);
  }

  const {emailValid, userNameValid, passwordValid, passwordConfirmationValid} = this.state.formFieldValid;

  if (emailValid === null && 
      userNameValid === null && 
      passwordValid === null &&
      passwordConfirmationValid === null) {
        this.registrationApiCall();
  }
}

render (){
  const { classes } = this.props;

  return (
    <Card
      style ={{alignItems : "center"}}
    >
      <CardHeader style={{ textAlign: 'center' }} component="h5" title ="회원가입"/>
      <form onSubmit = {this.onSubmit} className={classes.container}>
        <TextField
          id= "nameInp"
          label= "닉네임"
          className= {classes.textField}
          value= {this.state.formFieldInput.userName}
          error= {this.state.formFieldValid.userNameValid !== null ? true : null}
          helperText = {this.state.formFieldMessage.userNameValError}
          onChange= {this.onChange('userName')}
          onBlur = {this.onBlur('userName')}
          margin="normal"
          InputProps={{classes: {input: classes.input}}}
        >
        </TextField>
        <TextField
          id= "emailInp"
          label= "이메일 주소"
          className= {classes.textField}
          value= {this.state.formFieldInput.email}
          error= {this.state.formFieldValid.emailValid !== null ? true : null}
          helperText = {this.state.formFieldMessage.emailValError}
          onChange= {this.onChange('email')}
          onBlur = {this.onBlur('email')}
          InputProps={{classes: {input: classes.input}}}
          margin="normal"
        >
        </TextField>
        <TextField
          id= "passwordInp"
          label= "비밀번호"
          type="password"
          className= {classes.textField}
          value= {this.state.formFieldInput.password}
          error= {this.state.formFieldValid.passwordValid !== null ? true : null}
          helperText = {this.state.formFieldMessage.passwordValError}
          onChange= {this.onChange('password')}
          onBlur = {this.onBlur('password')}
          margin="normal"
        >
        </TextField>
        <TextField
          id= "passwordConfirmationInp"
          label= "비밀번호 확인"
          type="password"
          className= {classes.textField}
          value= {this.state.formFieldInput.passwordConfirmation}
          error= {this.state.formFieldValid.passwordConfirmationValid !== null ? true : null}
          helperText = {this.state.formFieldMessage.passwordConfirmationValError}
          onChange= {this.onChange('passwordConfirmation')}
          onBlur = {this.onBlur('passwordConfirmation')}
          margin="normal"
        >
        </TextField>
          <Button
            style = {{marginTop: 50}}
            className = {`${classes.Button} ${classes.ItemCenter}`}
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
          >
            가입
          </Button>
          <a className = {`${classes.removeLinkDec} ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/google_auth"><Button variant="contained" className={`${classes.GoogleCol} ${classes.Button}`}>구글 계정으로 시작하기</Button></a>
          <a className = {`${classes.removeLinkDec} ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/naver_auth"><Button variant="contained" className={`${classes.NaverCol} ${classes.Button}`}>네이버 계정으로 시작하기</Button></a>
      </form>

    </Card>
    );
  }
}

SignUpForm.propTypes = {
  history: PropTypes.object.isRequired
}

export default withStyles (style)(withRouter(SignUpForm))