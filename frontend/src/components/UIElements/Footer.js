import React from 'react';
import { withStyles, Typography ,} from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    height: 180,
		background: '#90CAF9',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
  },
	text: {
		color: 'white',
		fontWeight: 600,
	},
	button: {

	},
});

const Footer = (props) => {
	const { classes } = props;
	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<Typography className={classes.text} variant="h5">Study Hub Web Dev Project.</Typography>
			</div>
		</div>
	);
}

export default withStyles(styles)(Footer);