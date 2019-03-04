import React, { Component, Fragment } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { ButtonToolbar, Button } from 'react-bootstrap';
import movie from '../../images/movie.mp4';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/appContext';
import './Template.css';
const KEYS_TO_FILTERS = ['title']

class Template extends Component {
  static contextType = AppContext;
  
  constructor(props) {
    super(props);
    
    this.state = {
      users: [],
      contents: [],
      searchTerm: '',
      value: 0
    }
    
    this.searchUpdated = this.searchUpdated.bind(this);
    this.buttonClicked = this.buttonClicked.bind(this);
  }

  buttonClicked(e) {
    this.setState({value: this.state.value+1});
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.value === nextState.value || this.state.searchTerm === nextState.searchTerm;
  }
  
  async componentDidMount() {  
    this.context.actions.checkAuth();

    // 진리님 코드, 재서님꺼 합치면 http://localhost:8080/api/user추가
    // axios.get('http://localhost:8080/api/user')
    // .then(res => {
    //   this.setState({ 
    //     users: res.data,      
    //   });
    //   // console.log(this.state.users);
    // });

    // axios.get('http://localhost:8080/api/contents/r1')
    // .then(res => {
    //   this.setState({
    //     contents : res.data,
    //   });
    //   console.log(this.state.contents);
    // });

    this.context.actions.getCurrentPosition();
    
    // 더하기

    
    // this.setState({
    //   contents: await this.context.actions.getContentsR1(),
    // });
  };

  searchUpdated (term) {
    // if(term === ''){
    //   this.setState({searchTerm : 'ForExample'})
    // }
    // else {
    //   this.setState({searchTerm : term})
    // }
    this.setState({searchTerm: term})
  }
  
  
  render() {
    const filter = this.state.contents.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    const { lat, lng } = this.context.state;

    return (
      <Fragment>
        <div className="_container">
          <section className="background">
            <div className="background_video">
                <video loop muted={this.props.muted} autoPlay={true}>
                    <source type="video/mp4" data-reactid=".0.1.0.0.0" src={movie} />
                </video>
                <ButtonToolbar className="background_start_button">
                  <Link to={`/write?lat=${lat}&lng=${lng}`}><Button>스터디 시작하기</Button></Link>
                </ButtonToolbar>
              <div className="background_search">
                <div className="background_search_Text">
                <SearchInput className="searchInput" onChange={this.searchUpdated} placeholder="Search Category" />
                  <Link to={`/category/`+this.state.searchTerm+`/`}>
                  <span className="glyphicon glyphicon-search" aria-hidden="true" ></span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="infomad">
            <div>
              <div>
                <div className="info_cate"> 

                      <div className = "info_category"> <div className="info_search">정렬 기준 : 현재 모집 중</div>
                        {this.state.contents.map((board, index) => 
                          { 
                            if(index < 3){
                            return (
                              <div className = "info_divide" key={index}>
                                
                                <button className="info_button" onClick={this.buttonClicked}><div className ="info_named"><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></button>
                                <div className ="info_title">{board.title}</div>
                                {/* <div className ="info_description">{board.description}</div> */}
                                <div className ="info_category">{board.category}</div>
                              </div>
                          )
                          } else return console.log('First');
                          })
                        } 
                      </div>

                      <div className = "info_category"> <div className="info_search">정렬 기준 : 관심 카테고리 Ⅰ</div>
                        {this.state.contents.map((board, index) => 
                          { 
                            if(index < 3){
                            return (
                              <div className = "info_divide" key={index}>
                                <button className="info_button" onClick={()=>{
                                  let path = `detail/`+board._id;
                                  this.props.history.push(path);

                                }}><div className ="info_named"><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></button>
                                <div className ="info_title">{board.title}</div>
                                {/* <div className ="info_description">{board.description}</div> */}
                                <div className ="info_category">{board.category}</div>
                              </div>
                          )
                          } else return console.log('Second');
                          })} 
                      </div>

                      <div className = "info_category"> <div className="info_search">정렬 기준 : 관심 카테고리 Ⅱ</div>
                        {this.state.contents.map((board, index) => 
                          { 
                            if(index < 3){
                            return (
                              <div className = "info_divide" key={index}>
                                
                                <button className="info_button"><div className ="info_named"><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></button>
                                <div className ="info_title">{board.title}</div>
                                <div className ="info_description">{board.description}</div>
                                <div className ="info_category">{board.category}</div>
                              </div>
                          )
                          } else return console.log('Third');
                          })} 

                      </div>
                </div>                        
              </div>
            </div>
          </section>
          <div className ="other_info"></div>
        </div>
        <div>
      </div>
      
      </Fragment>
    )
  }
}

export default Template;