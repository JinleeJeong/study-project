import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import apiClient from '../../helpers/apiClient';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green,red } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';


const style = theme => ({
  container: {
    display: 'flex',
    flexDirection: "column",
    margin: 20,
  },

  input:{
    width: 100
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
  }
});

class SignInForm extends Component {

  constructor(props){
    super(props);
    // formFieldInput : 해당 객체의 property에 사용자가 각 칸에 입력한 값들을 저장한다.
    // formFieldValid : 각 칸에 입력된 값 (formFiledInput 객체의 properties)의 상태를 저장한다(null, error, warning etc)  
    // formFieldMessage : 유효성 검사를 통과하지 못한 칸 아래에 나타낼 오류 메시지를 저장한다. 
    this.state = {
      formFieldInput : 
      {
        email: '',
        password:'',
      },
      formFieldValid :
      {
        emailValid : null,
        passwordValid : null,
      },
      formFieldMessage :
      {
        emailValError : '',
        passwordValError : '',
      }
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

setValidationResult (validationResult){
  
  let {formFieldValid, formFieldMessage} = this.state;

  formFieldValid[validationResult['fieldName'] + 'Valid'] = validationResult['isCorrect'];
  formFieldMessage[validationResult['fieldName'] + 'ValError'] = validationResult['message'];
  
  this.setState (
    prevState => ({
      ...prevState,
      formFieldValid :  formFieldValid,
      formFieldMessage : formFieldMessage
    }))
}

  onChange = name => e =>{
    const value = e.target.value;
  
    this.setState(prevState =>({
        formFieldInput:{
            ...prevState.formFieldInput,
            [name] : value
        }
    }));
  }

  onSubmit(e){
    //you cannot return false to prevent default behavior in React. You must call preventDefault explicitly. 
    e.preventDefault();
  
    const {emailValid,passwordValid} = this.state.formFieldValid;
    const {email,password} = this.state.formFieldInput;

    if (emailValid === null && passwordValid === null) {
      apiClient.post('/users/signin',{
        email: email,
        password: password,
      })
      .then(res => {
        console.log(res.message)
        console.log(res.url);
        this.props.history.push(res.url)
      })
      .catch(err=> console.log(err));
    }
    else
      console.log('Submit conditions are not satisfied..');
  }
  
  render (){
    const { classes } = this.props;

    return (
      <Card
      alignItems ="center"
    >
      <CardHeader style={{ textAlign: 'center' }} component="h5" title ="로그인"/>
      <form onSubmit = {this.onSubmit} className={classes.container}>
        <TextField
          id= "emailInp"
          label= "이메일 주소"
          className= {classes.textField}
          value= {this.state.formFieldInput.email}
          error= {this.state.formFieldValid.emailValid !== null ? true : null}
          helperText = {this.state.formFieldMessage.emailValError}
          onChange= {this.onChange('email')}
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
            로그인
          </Button>
          <a className = {`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/google_auth"><Button variant="contained" className={`${classes.GoogleCol} ${classes.Button}`}>구글 계정으로 시작하기</Button></a>
          <a className = {`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/naver_auth"><Button variant="contained" className={`${classes.NaverCol} ${classes.Button}`}>네이버 계정으로 시작하기</Button></a>
      </form>

    </Card>
    );
  }
}

SignInForm.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles (style)(withRouter(SignInForm));

      // <form  noValidate autoComplete= "off">
      //   <TextField
      //     id= "email"
      //     label= "Email"
      //     className= {classes.textField}
      //     value= {this.state.formFieldInput.email}
      //     error= {this.state.formFieldValid.emailValid !== null ? true : null}
      //     helperText = {this.state.formFieldMessage.emailValError}
      //     onChange= {this.onChange('email')}
      //     margin="normal"
      //   >
      //   </TextField>
      // </form>
/*      <div>
        <Form  onSubmit = {this.onSubmit}>
        <h1 className = "FormHeader">로그인</h1>
          <FormGroup
            validationState = {this.state.formFieldValid.emailValid}
          >
            <ControlLabel>아이디</ControlLabel>
              <FormControl
                value = {this.state.formFieldInput.email}
                onChange={this.onChange}
                type = "text"
                name="email"
                placeholder = "이메일">
              </FormControl>
              <FormControl.Feedback/>
                <HelpBlock>{this.state.formFieldMessage.emailValError}</HelpBlock>
              </FormGroup>
            <FormGroup
              style = {{marginBottom: '50px'}}
              validationState = {this.state.formFieldValid.passwordValid}
            >
            <ControlLabel>비밀번호</ControlLabel>
            <FormControl
              value = {this.state.formFieldInput.password}
              onChange={this.onChange}
              type = "password"
              name="password"
              placeholder="특수문자 포함 최소 8자 ~ 최대 20자 이내로 입력합니다.">
            </FormControl>
            <FormControl.Feedback/>
              <HelpBlock>{this.state.formFieldMessage.passwordValError}</HelpBlock>
            </FormGroup>
            <FormGroup>
              <Button bsStyle="primary" block type = "submit">
                확인
              </Button>
            </FormGroup>
          </Form>
          <div>
            <a className = "removeLinkDec" href = "http://localhost:8080/api/users/google_auth"><Button style = {{marginBottom: '15px'}} bsStyle ="danger" block>구글 계정으로 시작하기</Button></a>
            <a className = "removeLinkDec" href = "http://localhost:8080/api/users/naver_auth"><Button style = {{marginBottom: '15px'}} bsStyle ="success" block>네이버 계정으로 시작하기</Button></a>
          </div>
        </div>
 */