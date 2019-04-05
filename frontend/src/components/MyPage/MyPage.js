import React, {Component} from 'react';
import { AppContext } from '../../contexts/appContext';
import { withStyles } from '@material-ui/core/styles';
import MypageField from './MypageField';

const style = theme => ({
  page: {
    width: '80vw',
    minHeight: '60vh',
    margin: '10vh auto',
    [theme.breakpoints.down(1300)]: {
      width: '90vw'
    },
  },
  mypageField:{
    width: 1000,
    [theme.breakpoints.down(1275)]: {
      width: '100%'
    },

    margin: 'auto'
  },
});

class MyPage extends Component {
  static contextType = AppContext;
  
  // constructor(props){
  //   super(props);
  //   this.state ={
  //     loading: true
  //   };
  // }

  // componentDidMount() {
  //   this.context.actions.checkAuth()
  //   .then(this.setState({...this.state,loading: false}));
  // }

  render (){
    const {classes} = this.props;
    // const {loading} = this.state;

      return (
        <div className = {classes.page}>
        {/* {loading ? null :( 
          <div className = {classes.mypageField}>
            <MypageField/>
          </div>)
        } */}
          <div className = {classes.mypageField}>
            <MypageField/>
          </div>
      </div>
      );
  }
}

export default withStyles(style)(MyPage);