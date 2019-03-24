import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import {AppContext} from '../../contexts/appContext';


const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class CustomSnackbar extends Component {
  static contextType = AppContext;

  render() {
    const { classes } = this.props;

    return (
        <Snackbar
          anchorOrigin={this.context.state.Snackbar.anchorOrigin}
          open={this.context.state.Snackbar.open}
          autoHideDuration={5000}
          onClose={this.context.actions.snackbarCloseHandler}
        >
          <MySnackbarContentWrapper
            className={classes.margin}
            onClose={this.context.actions.snackbarCloseHandler}
            variant={this.context.state.Snackbar.variant}
            message={this.context.state.Snackbar.message}
          />
        </Snackbar>
    );
  }
}

CustomSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles (styles2)(CustomSnackbar);

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);