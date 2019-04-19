import React, { Component } from 'react';
import { withStyles, AppBar, Toolbar, Button, } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Avatar from './Avatar/Avatar';
import { AppContext } from '../../../contexts/appContext';

const styles = {
  root: {
    flexGrow: 1,
    marginBottom: 1,
  },
  appBar: {
    backgroundColor: '#263238',
  },
  grow: {
    flexGrow: 1,
  },
  link: {
    color: '#90CAF9',
    fontSize: 20,
    fontWeight: 500,
    textDecoration: 'none',
  },
  button: {
    fontSize: 18,
    fontWeight: 500,
  },
  toolbar:{
    maxHeight:'64px'
  }
};

class TopAppBar extends Component {
  static contextType = AppContext;

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <div className={classes.grow}>
              <Link className={classes.link} to="/templates">
                STUDYHUB
              </Link>
            </div>
            <Button className={classes.button} component={Link} to="/contents" style={{color: '#FFFFFF'}}>스터디 찾기</Button>
            {this.context.state.signInInfo.status === false ? <div><Button className={classes.button} component={Link} to="/signup" style={{color: '#90CAF9'}}>회원가입</Button><Button className={classes.button} component={Link} to="/" style={{color: '#FFFFFF'}}> 로그인 </Button></div> : <Avatar/>}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(TopAppBar);
