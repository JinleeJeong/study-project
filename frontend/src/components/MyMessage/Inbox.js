import React, { Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button } from '@material-ui/core';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Chip from '@material-ui/core/Chip';
import Moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
  },
  detailFontSize:{
    fontSize: theme.typography.pxToRem(20),
  }
  ,
  fullWidth:{
    width: '100%',
  },
  textMiddle:{
    display: 'flex',
    alignItems: 'center',
  },
  heading: {
    fontSize: theme.typography.pxToRem(30),
    fontWeight: theme.typography.fontWeightRegular,
  },
  button: {
    margin: theme.spacing.unit,
  },
  avatar: {
    margin: 10,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  marginLeft:{
    marginLeft: 25,
  },

});

class Inbox extends Component {

  render() {
    const { classes } = this.props;
    let date = new Date(this.props.sendedAt);
    date = Moment(date).format('YYYY-MM-DD h:mm');

    const SecondarySenderAndDate = () => (
      <Fragment>
        <span>{this.props.sender.name}</span>
        <span className = {classes.marginLeft}>{date}</span>
        {this.props.seen ? null : <Chip label="New" component = "span" className={classes.chip} variant="outlined" />}
      </Fragment>
    );

    return (
      <ListItem>
        <ExpansionPanel onChange = {(e,expanded)=>{this.props.changeSeenHandler(expanded, this.props.listIdx, this.props.seen)}} className ={classes.fullWidth}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Checkbox
          color = "primary"
          checked = {this.props.checkBoxCheck}
          onClick={e => {e.stopPropagation()}}
          onChange = {(e)=> this.props.onChangeHandler(e,this.props.messageKey)}/>
        <ListItemAvatar>
          <Avatar alt ="Remy Sharp" src = {`http://localhost:8080/${this.props.sender.image}`} className = {classes.avatar}></Avatar>
        </ListItemAvatar>
        <ListItemText
          //className={classes.textMiddle}
          classes={ {primary: classes.heading} }
          primary = {this.props.title}
          secondary= {SecondarySenderAndDate()}>
        </ListItemText>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography className={`${classes.inline} ${classes.detailFontSize}`} color ="textPrimary">
           {this.props.body}
          </Typography>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button onClick={() =>this.props.handleOpen(this.props.sender.email)}variant="contained" size= "small" color="primary" className ={classes.button}>답장</Button>
        </ExpansionPanelActions>
        </ExpansionPanel>
      </ListItem>
    );
  }
}

// sendedAt 변경하기 
Inbox.propTypes = {
  changeSeenHandler: PropTypes.func.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  listIdx: PropTypes.number.isRequired,
  messageKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  seen: PropTypes.bool.isRequired,
  sender: PropTypes.object.isRequired,
  recipient: PropTypes.string.isRequired,
  sendedAt: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  checkBoxCheck: PropTypes.bool.isRequired,
}

export default withStyles(styles)(Inbox);