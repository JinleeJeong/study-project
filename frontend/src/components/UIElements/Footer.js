import React from 'react';
import { withStyles, Typography ,} from '@material-ui/core';
import { Favorite, } from '@material-ui/icons';

const styles = theme => ({
  root: {
    width: '100%',
    height: 160,
		background: '#90CAF9',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		width: '100%',
		height: '90%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: '#263238',
		fontWeight: 600,
	},
	favoriteIcon: {
		color: 'red',
	},
});

const Footer = (props) => {
	const { classes } = props;
	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<Typography className={classes.text} variant="h5">Study Hub Web Dev Project.</Typography>
				<Typography className={classes.text}><Favorite className={classes.favoriteIcon}/>Copyright © 2019. StudyHub(Yu JaeSeo, Jeong JinLee, Choi JunSung). All right reserved.<Favorite className={classes.favoriteIcon}/></Typography>
			</div>
		</div>
	);
}

export default withStyles(styles)(Footer);