import React, {Component} from 'react';
import './Login.css';
import {withRouter} from 'react-router';
import apiClient from '../../helpers/apiClient';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import { green,red } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {Link} from 'react-router-dom';
import google from '../../images/google.png'
import naver from '../../images/naver.png'
import { AppContext } from '../../contexts/appContext';
import icon from '../../images/icon.PNG'
const styles = theme => (
	{
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
		main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
		},
		paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
		},
		avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
		},
		form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
		},
		submit: {
		marginTop: theme.spacing.unit * 3,
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
  }});

class login extends Component {
	static contextType = AppContext;
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
        if (res.state !== 'success')
          this.context.actions.snackbarOpenHandler(res.message,res.state);
        
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
			<div className="login" style={{minHeight : "100vh" ,margin: "0", padding: "0"}}>
			<div style={{paddingTop: "10vh", marginLeft : "7vh"}}>
				<main className={classes.main}>
					<CssBaseline />
					
					<Paper className={classes.paper} style={{paddingTop : "0", marginTop: 0, width : "40vh"}}>
						<img style= {{borderRadius : "50%", marginTop : "1vh", width : "6vh"}} src = {icon} alt = "Logo"></img>
						<Typography component="h4" variant="h5">
						<div style={{fontWeight: "700", marginTop : "2vh", fontSize : "2vh"}}>로그인</div>
						</Typography>
							<form style = {{marginTop : 0}}onSubmit = {this.onSubmit} className={classes.container}>
								<TextField
								id= "emailInp"
								label= "Email"
								
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
								label= "Password"
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
									color="secondary"
									variant="contained"
								>
								<div style={{color: "white"}}>로그인</div>
								</Button>
								<Link to="/templates" onClick={() => window.location.refresh()}>
								<Button
									style = {{marginTop : 10}}
									className = {`${classes.Button} ${classes.ItemCenter}`}
									fullWidth
									color="secondary"
									variant="contained"
									
								>
								<div style={{color: "white"}}>비회원 로그인</div>
								</Button>
								</Link>
								<div style ={{ paddingBottom : "2.5vh",marginTop : "3vh", textAlign : "center" , color : "gray", borderBottom : "1.5px solid gray", height : "3vh"}}>또는 다른계정으로 로그인</div>
								<a className = {`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/google_auth"><Button style = {{textTransform: "none", background : "white", color : "black", marginTop: "0.3vh"}} variant="contained" className={`${classes.GoogleCol} ${classes.Button}`}><img src = {google} alt="Google" width = "30" height = "30" style={{position : "relative", right : "4vh"}}/><div style={{marginRight : "3vh"}}>Google</div></Button></a>
								<a className = {`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/naver_auth"><Button style = {{textTransform: "none", background : "#00ca3b", marginTop : "0.3vh"}} variant="contained" className={`${classes.NaverCol} ${classes.Button}`}><img src = {naver} alt="Naver" width = "30" height = "30" style={{position : "relative", right : "4.3vh"}}/><div style={{marginRight : "3vh"}}>Naver</div></Button></a>
								<Button 
								className = {`${classes.Button} ${classes.ItemCenter}`}
								style = {{marginTop : 10, width : "15vh", top : "2vh" ,position : "relative", left : "11vh"}}
								color="primary" 
								type="submit" 
								variant="contained"
								fullWidth
								component={Link} to="/signup"
								><div style={{color: "white"}}>회원가입</div></Button>
							</form>
					</Paper>

					</main>
					</div>
			</div>
		);
	}
};


login.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
  };
export default withStyles(styles)(withRouter(login));
