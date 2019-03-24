import React, {Component, Fragment} from 'react';
import Inbox from './Inbox';
import { AppContext } from '../../contexts/appContext';
import apiClient from '../../helpers/apiClient';
import List from '@material-ui/core/List';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import SendMessageDialog from './SendMessageDialog';
import Snackbar from '@material-ui/core/Snackbar';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SendIcon from '@material-ui/icons/Send';

const styles = theme => ({
  marginAuto:{
    margin : 'auto',
  },

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
  },

  page: {
    width: '70vw',
    minHeight: '60vh',
    margin: '10vh auto',
  },

  tableStyle: {
    width:  '100%',
    borderCollapse: 'collapse',
  },

  aboveList: {
    display: 'flex',
    marginBottom: '30px',
  },

  rightPager: {
    width: '200px',
    marginLeft: 'auto',
  },

  leftOptions: {
    marginLeft: '20px',
  },

  absolute: {
    position: 'fixed',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 8,
  },
});

class MyMessagePage extends Component {
    static contextType = AppContext;
    
    constructor (props){
      super(props);
      const showNum = 10;

      this.state = {
        messageSendDialogOpen: false,
        //initial value
        sendMessageTo: '',
        
        // 메세지 list와 pager를 위한 정보 
        messages: [],
        messagePagerInfo: {
          total : null,
          currentNum : null,
          showNum : showNum,
          page: 1
        },
        selectedElements : {},
        
        loading: true
        
      }
      // Dialog innerRef
      this.sendMessageDialog = null;

      this.handleClose = this.handleClose.bind(this);
      this.handleOpen = this.handleOpen.bind(this);
      this.getSelectedMessages = this.getSelectedMessages.bind(this);
      this.getMessagesApi = this.getMessagesApi.bind(this);
      this.getArrivalMessage = this.getArrivalMessage.bind(this);
      this.messagePagerHandler = this.messagePagerHandler.bind(this);
      this.removeMessages = this.removeMessages.bind(this);
      this.changeSeen = this.changeSeen.bind(this);
    }

    // message를 server로 부터 가져오기 위한 function
    getMessagesApi(data, type = null, num = 0){
      return apiClient.post('/messages',data)
        .then(res => {
          const total = type === "changeTotal" ? res.data.total + num : res.data.total;
          const selectedElements = num >= 0 ? this.state.selectedElements : {}
            this.setState({
              ...this.state,
              selectedElements: selectedElements,
              messages: res.data.list,
              messagePagerInfo: {
                ...this.state.messagePagerInfo,
                currentNum: res.data.list.length,
                total: total,
                page: res.data.page
              } 
            });
            return res;
        })
        .catch(err => {
          console.log(err);
          this.context.actions.snackbarOpenHandler('에러가 발생했습니다.','error');
        });
    }
    // change stream 이벤트 핸들러(메세지가 왔을 때)
    getArrivalMessage(data){
      if(!this.context.state.signInInfo.status || this.context.state.signInInfo.id !== data.recipient)
        return true

      this.getMessagesApi(this.state.messagePagerInfo, 'changeTotal', 1)
        .then(res => {console.log(res);this.context.actions.snackbarOpenHandler('메시지가 도착했습니다.','info');} );
    }

    getSelectedMessages(event,messageKey){
      console.log(messageKey)
      let checkedMessages = this.state.selectedElements;
      
      // 체크했을 때 
      if (event.target.checked){
        checkedMessages[messageKey] = true;
      }else{
        delete checkedMessages[messageKey];
      }

      this.setState({
        ...this.state,
        selectedElements: checkedMessages
      });
      event.stopPropagation();

    }

    changeSeen(expanded, listIdx, seen){
      if (expanded && !seen){
        setTimeout(() => {
          apiClient.post('/messages/seenCheck',{messageId : this.state.messages[listIdx]._id})
          .then(() => {
            let changedList = this.state.messages;
            changedList[listIdx].seen = true;
            this.setState({
              ...this.state,
              messages : changedList,
            });
            this.context.actions.getUnseenMessage();
          });
        }, 400);
      }
    }

    renderingList = ()=>{
      const messages = this.state.messages.map((message,index)=>{
        return <Inbox 
          key = {message._id}
          listIdx = {index}
          onChangeHandler = {this.getSelectedMessages}
          changeSeenHandler = {this.changeSeen}
          handleOpen = {this.handleOpen}
          handleClose = {this.handleClose}
          messageKey = {message._id}
          title = {message.title}
          body = {message.body}
          seen = {message.seen}
          sender = {message.sender}
          recipient = {message.recipient}
          sendedAt = {message.sendedAt}
          checkBoxCheck = {message._id in this.state.selectedElements ? true : false}
        ></Inbox>
      });

      return messages;
    }

    async componentDidMount(){
      this.context.actions.checkAuth()
        .then (()=> {

          if (!this.context.state.signInInfo.status)
            return;
          // 핸들러 등록 
          this.context.state.socketConnection.io.on('test',(data) => this.getArrivalMessage(data));
          this.getMessagesApi(this.state.messagePagerInfo)      
            .then(()=>{this.setState({...this.state,loading: false})});
        });
      }

    componentWillUnmount(){
      console.log("unmount");
      // 핸들러 해제 
      if (this.context.state.socketConnection.io)
        this.context.state.socketConnection.io.off('test');
    }
    
    // 페이지 이동에 따른 message를 가져온다. 
    messagePagerHandler (id) {
      let {page} = this.state.messagePagerInfo;

      if (id === "right")
          page = page + 1;
      else
          page = page - 1;

      this.getMessagesApi({...this.state.messagePagerInfo, page: page});    
    }

    removeMessages(){
      console.log(this.state.selectedElements);
      apiClient.post('/messages/remove',this.state.selectedElements)
      .then(res => {
        console.log(res);
        this.getMessagesApi(this.state.messagePagerInfo,'changeTotal', -1 * Number(res.number))
        .then(this.context.actions.getUnseenMessage())
      });
    }

    handleOpen(to = null){
      if (to === null)
        this.setState({ ...this.state, messageSendDialogOpen: true});
      else
        this.setState({ ...this.state, sendMessageTo: to, messageSendDialogOpen: true },this.sendMessageDialog.setToInitialState(to));
    };

    handleClose(){
      this.setState({ ...this.state, sendMessageTo: '', messageSendDialogOpen: false }, 
        ()=> this.sendMessageDialog.setToInitialState());
    };

    render (){
      const{classes} = this.props
      const{total, currentNum, showNum, page} = this.state.messagePagerInfo;
      const{messageSendDialogOpen, sendMessageTo, snackbarOpen} = this.state;
      
      // 여기 있으면 동작하지 않음
      // let Transition = (props)=>{
      //   return <Slide direction= "up" {...props}></Slide>
      // };

      return (
        this.state.loading === true? <div className= {classes.page}/> : 
        <Fragment>
        <div className = {classes.page}>
          <div className = {classes.aboveList}>
            <div className ={classes.leftOptions}> 
            <IconButton onClick = {this.removeMessages} aria-label="Delete">
              <DeleteIcon />
            </IconButton>
            </div>
            <div className = {classes.rightPager}>
              <Grid container>
                <Grid className = {classes.marginAuto} item xs={6}>
                  <Typography>
                    {total === 0 ? "메시지 없음" : `${(page -1)*showNum+1} - ${(page-1)*showNum+currentNum} 중 ${total}`}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <IconButton disabled = {page === 1} onClick = {()=>this.messagePagerHandler("left")}>
                    <ChevronLeftIcon />
                  </IconButton>       
                </Grid>    
                <Grid item xs={3}>
                <IconButton disabled = {total === 0 || page === Math.ceil(total/showNum)} onClick = {()=>this.messagePagerHandler("right")}>
                  <ChevronRightIcon />
                </IconButton>
                </Grid>    
              </Grid>
            </div>
          </div>

          <List>
            {this.renderingList()}
          </List>

          <Tooltip title="쪽지 전송" aria-label="send">
            <Fab onClick = {()=>{this.handleOpen()}} color="primary" className={classes.absolute}>
              <SendIcon/>
            </Fab>
          </Tooltip>
        </div>

        <SendMessageDialog
          innerRef = {ele => this.sendMessageDialog = ele}
          handleClose={this.handleClose}
          handleOpen={this.handleOpen}
          initialRecipientEmail={sendMessageTo}
          open={messageSendDialogOpen}
        />

        {/*전역으로 관리하기*/}
        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal : 'center'}}
          open={snackbarOpen}
          onClose={()=>this.handleClose('snackbar')}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">메시지 전송에 성공했습니다.</span>}
        />

        </Fragment>
      );
    }
}

export default withStyles(styles)(MyMessagePage);