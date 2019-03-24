import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { AppContext } from '../../contexts/appContext';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import apiClient from '../../helpers/apiClient';

const style = theme => ({
  root: {
    flexGrow: 1,
  },
  upperPaper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
    minHeight: 320
  },
  bottomPaper:{
    padding : theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
    height: 280,
  },
  avartar:{
    height: 200,
    width: 200,
  },
  avartarDiv:{
    padding: theme.spacing.unit * 2
  },
  infoSpacing:{
    [theme.breakpoints.up('sm')]: {
      marginLeft : theme.spacing.unit * 6.25,
      padding: theme.spacing.unit * 2,
      paddingTop : theme.spacing.unit * 3
    },
    padding: theme.spacing.unit * 2
  },
  typo:{
    fontSize: '2rem',
    marginBottom: '1em'
  }
});


class MypageField extends Component {
  static contextType = AppContext;

  removeUserHandler(){
    apiClient.post('/users/delete')
      .then(res => console.log(res));
  }

  render() {
    const {classes} = this.props;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Paper className={classes.upperPaper}>
            <Grid spacing = {8} container>
              <Grid item className= {classes.avartarDiv}>
                <Avatar className ={classes.avartar} alt="Remy Sharp" src= {`http://localhost:8080/${this.context.state.signInInfo.image}`}/>
              </Grid>
              <Grid item container xs={12} sm className = {classes.infoSpacing}>
                <Grid item xs container direction="column" spacing={8}>
                  <Grid item>
                    <Typography className = {classes.typo} gutterBottom>이메일 : asfasf (회원 가입일 : 1993.08.09)</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className = {classes.typo} gutterBottom >닉네임 : </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className = {classes.typo} gutterBottom>생년월일 : </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className = {classes.typo} gutterBottom>주소 : </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justify = "flex-end">
                <Grid item>
                  <Button> 회원정보 수정</Button>
                </Grid>
                <Grid item>
                  <Button onClick = {this.removeUserHandler}> 회원탈퇴</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}  sm={6}>
          <Paper className = {classes.bottomPaper}>
          </Paper>
        </Grid>
        <Grid item xs={12}  sm={6}>
          <Paper className = {classes.bottomPaper}>
          </Paper>
        </Grid>
        <Grid item xs={12}  sm={6}>
          <Paper className = {classes.bottomPaper}>
          </Paper>
        </Grid>
        <Grid item xs={12}  sm={6}>
          <Paper className = {classes.bottomPaper}>
          </Paper>
        </Grid>
      </Grid>        
    );
  }
}

export default withStyles(style)(MypageField);