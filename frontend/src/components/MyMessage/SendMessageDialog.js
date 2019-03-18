import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { AppContext } from '../../contexts/appContext';

import apiClient from '../../helpers/apiClient';

const styles = {
  appBar: {
    position: 'relative',
  },

  flex: {
    flex: 1,
  },

  dialogBody:{
    margin: '30px 15px',
    width: 'calc(100% - 30px)',
  },

  dialogTextField:{
    margin: '8px',
    width: 'calc(100% - 16px)'
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SendMessageDialog extends Component {
  static contextType = AppContext;

  constructor(props){
    super(props);

    this.state = {
      messageTitle: null,
      messageBody: null,
      sendMessageTo: null,
    };

    this.setToInitialState = this.setToInitialState.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleTextFieldOnBlur = this.handleTextFieldOnBlur.bind(this);
  }

  sendMessage(){
    const {sendMessageTo, messageTitle, messageBody} = this.state;
    apiClient.post('/messages/send',{recipientEmail: sendMessageTo, messageTitle: messageTitle, messageBody: messageBody, senderId: this.context.state.signInInfo.id})
    .then(res=> {
      this.context.actions.snackbarOpenHandler(res.message,res.state,{
        vertical: 'bottom',
        horizontal: 'left',});
      if (res.state === 'success')
        //this.props.handleOpen('snackbar');
        this.props.handleClose('messageSendDialog');
 
    })
    .catch(err => {console.log(err)});
  }

  handleTextFieldOnBlur(e){
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    });
  }

  setToInitialState(to = null){
    this.setState({
      ...this.state,
      messageTitle: null,
      messageBody: null,
      sendMessageTo: to,
    });
  }

  render() {
    const { classes } = this.props;

    return (
        <Dialog
          fullScreen
          open={this.props.open}
          onClose={()=> this.props.handleClose()}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={()=> this.props.handleClose()} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                쪽지 작성
              </Typography>
              <Button color="inherit" onClick={()=> this.props.handleClose()}>
                확인
              </Button>
            </Toolbar>
          </AppBar>
          <div className = {classes.dialogBody}>
          
          <TextField
            id="outlined-full-width"
            label="받는 사람"
            name = 'sendMessageTo'
            defaultValue = {this.props.initialRecipientEmail}
            className = {classes.dialogTextField}
            placeholder= "아이디"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={this.handleTextFieldOnBlur}
          />

          <TextField
            id="outlined-full-width"
            label="제목"
            name = 'messageTitle'
            autoFocus
            className = {classes.dialogTextField}
            placeholder="내용"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={this.handleTextFieldOnBlur}
          />

          <TextField
            id="outlined-full-width"
            label="내용"
            name = 'messageBody'
            multiline
            rows = "15"
            className = {classes.dialogTextField}
            placeholder="내용"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={this.handleTextFieldOnBlur}
        />

        <DialogActions>
            <Button onClick = {this.sendMessage} color="primary">
              전송
            </Button>
          </DialogActions>
        </div>
        </Dialog>
    );
  }
}

SendMessageDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  initialRecipientEmail: PropTypes.string.isRequired,
};

export default withStyles(styles)(SendMessageDialog);