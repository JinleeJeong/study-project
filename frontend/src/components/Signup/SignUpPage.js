import React, {Component} from 'react';

import './SignUpPage.css';

import SignUpForm from './SignUpForm';
import { AppContext } from '../../contexts/appContext';

class SignUpPage extends Component {
  static contextType = AppContext;
  
  constructor(props){
    super(props);
    this.state ={
      loading: true
    };
  }
  componentDidMount() {
    this.context.actions.checkAuth()
      .then(()=>{this.setState({...this.state,loading: false}); 
        console.log("change")});
  }

  render (){
    const {loading} = this.state;

      return (
        <div className = "page">
          {loading ? null :( 
            <div className = "formSize">
              <SignUpForm/>
            </div>)
          }
        </div>
      );
  }
}

export default SignUpPage;

