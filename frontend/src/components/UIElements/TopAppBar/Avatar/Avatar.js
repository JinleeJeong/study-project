import apiClient from '../../../../helpers/apiClient';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {AppContext} from '../../../../contexts/appContext';
import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  avatar: {
    margin: 10,
  },

  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },

  divHeight: {
    height: '64px',
  },
  button : {
    padding: '4px',
    height: '100%'
  }
});

class AvatarandDropdown extends React.Component {
  static contextType = AppContext;

  constructor (props){
    super(props);
    
    this.state = {
      anchorEl: null,
    };

    this.getUnseenMessage = this.getUnseenMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleClick = event => {
    console.log(event.currentTarget)
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSelect = (option) => {
    console.log(option)
    if (option === 'mypage'){
      this.props.history.push('/mypage')
    }else if (option === 'mymessage'){
      this.props.history.push('/mymessagepage');
    }else if (option === 'signout') {
      apiClient.post('/users/signout')
      .then (()=> {
        window.location = '/';
    });
  }
}
  getUnseenMessage(data){
    if (data.recipient === this.context.state.signInInfo.id)
      this.context.actions.getUnseenMessage();
  }

  componentDidMount(){
    // 현재 로그인 유저가 읽지 않은 쪽지 개수를 요청한다. 
    this.context.actions.getUnseenMessage()
    this.context.state.socketConnection.io.on('unseenMessage',(data) => this.getUnseenMessage(data));
  }

  componentWillUnmount(){
    this.context.state.socketConnection.io.removeListener('unseenMessage',this.getUnseenMessage);
  }

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <div className = {classes.divHeight}>
        <Button
          className = {classes.button}
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Avatar className = {classes.avatar} alt="Remy Sharp" src= {`http://localhost:8080/${this.context.state.signInInfo.image}`}/>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={()=>{this.handleSelect('mypage')}}>
            <Typography className={classes.padding}>마이페이지</Typography>
          </MenuItem>
          <MenuItem onClick={()=>{this.handleSelect('mymessage')}}>
            <Badge className={classes.margin} badgeContent={this.context.state.unseenMessage} color="primary">
              <Typography className={classes.padding}>쪽지함</Typography>
            </Badge>
          </MenuItem>
          <MenuItem onClick={()=>{this.handleSelect('signout')}}>
            <Typography className={classes.padding}>로그아웃</Typography>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

Avatar.propType = {
  history: PropTypes.object.isRequired,
}
export default Object.assign(withRouter(withStyles(styles)(AvatarandDropdown)),{contextType: undefined});