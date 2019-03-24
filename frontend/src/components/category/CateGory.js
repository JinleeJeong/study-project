import React, { Component, Fragment } from 'react';
import './CateGory.css';
import { AppContext } from '../../contexts/appContext';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 200,
    width: 150,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

class CateGory extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      boards: [],
      searchTerm: props.match.params.id,
    }
 
  }

  async componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({
      boards: await this.context.actions.getContentsByCategory(searchTerm)
    });
  };
  
    render() {
      const { classes } = this.props;
      return (
      <Fragment>
        <div style={{textAlign: "right", margin : "7vh 10vh 3vh 0 "}}>{this.state.searchTerm} 카테고리</div>
        <div style={{marginLeft : "10vh", marginRight : "10vh", minHeight:"74vh"}}>
        <Grid container spacing={40} style={{}}>
            {this.state.boards.map((board, index) => (
                <Grid item key={index} sm={12} md={6} lg={3} >
                <div className="mediaQuery" >
                    <Card className={classes.card} style={{minHeight : "32vh"}}>
                      <div key={index}></div>
                        <Button style={{ width: "100%", height: "20vh"}} className="" onClick={()=>{ let path = `../detail/`+board.id; this.props.history.push(path); }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                          <div>{board.title}</div>
                          </Typography> 
                        </CardContent>
                      </Card>
                      </div>
                    </Grid>
                  
                  ))}
                  </Grid>
                  </div>
        </Fragment>
      )}
}
export default withStyles(styles)(CateGory);
  