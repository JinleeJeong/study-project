import React, {Component} from 'react';
import './Login.css';
import {withRouter} from 'react-router';
import apiClient from '../../helpers/apiClient';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import Paper from '@material-ui/core/Paper';
import { green,red } from '@material-ui/core/colors';
import withStyles from '@material-ui/core/styles/withStyles';
import {Link} from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Modal from '@material-ui/core/Modal';
import img from '../../images/studyhub_vertical.PNG'
const styles = theme => ({
	container: {
		display: 'flex',
		flexDirection: "column",
		margin: 20,
		},
		labelRoot: {
			fontSize: 15
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
		marginTop: theme.spacing.unit * 17,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[10],
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: 0,
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

function getModalStyle() {
	const top = 60

	return {
		top: `${top}%`,
		position : "absolute",
		left : "39%"
	};
}

class login extends Component {

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
			},
			open : false,
		}
	
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	  }
	
		handleOpen = () => {
			this.setState({ open: true });
		};
	
		handleClose = () => {
			this.setState({ open: false });
		};
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
			<div className="login" style={{minHeight : "100vh" ,margin: "0"}}>
				<main className={classes.main}>
					<CssBaseline />
					<Paper className={classes.paper} style={{width:350, height: 450}}>
						

						 <img src={img} alt="logo" width ="100px"></img>	

							<form onSubmit = {this.onSubmit} className={classes.form} style={{width : "70%"}}>
							<FormControl margin="normal" required fullWidth style={{ marginTop : "2vh", marginBottom : 0}}>
								<TextField
								id= "emailInp"
								InputLabelProps={{
									FormLabelClasses : {
										root : classes.labelRoot
									}
								}}
								label="Email*"
								className= {classes.textField}
								value= {this.state.formFieldInput.email}
								error= {this.state.formFieldValid.emailValid !== null ? true : null}
								helperText = {this.state.formFieldMessage.emailValError}
								onChange= {this.onChange('email')}
								margin="normal"
								>
								</TextField>
							</FormControl>
							<FormControl margin="normal" required fullWidth style={{margin : 0}}>
								<TextField
								id= "passwordInp"
								label= "Password*"
								type="password"
								InputLabelProps={{
									FormLabelClasses : {
										root : classes.labelRoot
									}
								}}
								className= {classes.textField}
								value= {this.state.formFieldInput.password}
								error= {this.state.formFieldValid.passwordValid !== null ? true : null}
								helperText = {this.state.formFieldMessage.passwordValError}
								onChange= {this.onChange('password')}
								margin="normal"
								>
								</TextField>
								</FormControl>
								<div style={{textAlign : "center"}}>
								<Button
									style = {{marginTop: "3vh", height: 20, width: "100%"}}
									className = {`${classes.Button} ${classes.ItemCenter}`}
									type="submit"
									fullWidth
									color="primary"
									variant="contained"
								>
									<div style={{fontSize : 15, color : "#37383a"}}>로그인</div>
								</Button>

								<Link to="/templates">
								<Button
									style = {{marginTop : 10, height: 20, width: "100%"}}
									className = {`${classes.Button} ${classes.ItemCenter}`}
									fullWidth
									color="primary"
									variant="contained"
									
								>
								<div style={{fontSize : 15, color : "#37383a"}}>비회원 로그인</div>
								</Button>
								</Link>
								<div style={{}}>
								<Button
									style = {{marginTop : 10, height: 20, width:'100%'}}
									color="secondary"
									variant="contained"
									onClick={this.handleOpen}
								>
								<div style={{fontSize : 15, color : "white"}}>구글 {"&"} 네이버 로그인</div>
								</Button>
								<Modal
									aria-labelledby="simple-modal-title"
									aria-describedby="simple-modal-description"
									open={this.state.open}
									onClose={this.handleClose}
								>
									<div style={getModalStyle()} className={classes.paper}>
									<a style={{textDecoration : "none"}} className = {`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/google_auth"><Button style = {{marginTop : 10, height: 40}} variant="contained" className={`${classes.GoogleCol} ${classes.Button}`}><div style={{fontSize : 15}}>구글 계정으로 시작하기</div></Button></a>
									<a style={{textDecoration : "none"}} className = {`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/naver_auth"><Button  style = {{marginTop : 10, height: 40}} variant="contained" className={`${classes.NaverCol} ${classes.Button}`}><div style={{fontSize : 15}}>네이버 계정으로 시작하기</div></Button></a>
									</div>
								</Modal>
								</div>
								</div>
							</form>
					</Paper>
					</main>
					<p style={{textAlign : "center", color : "rgba(0, 0, 0, 0.54)", marginRight :"3vh"}}>Welcome to Study Hub<FavoriteBorder style={{marginLeft : "5px", fontSize : "12px", color : "red"}}/></p>
			</div>
		);
	}
};


login.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
  };
export default withStyles(styles)(withRouter(login));