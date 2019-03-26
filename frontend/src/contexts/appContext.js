import React, { Component, createContext } from 'react';
import apiClient from '../helpers/apiClient';
import socketIOClient from "socket.io-client";

const AppContext = createContext();
const { Provider } = AppContext;

export default class AppContextProvider extends Component {
  state = {
    //서울시청 초기화
    lat: 37.5666035,
    lng: 126.9783868,

    // 현재 Login 상태에 대한 state 
    // status : false -> 로그인 x 
    // status : true -> 로그인 o
    signInInfo: {
      status : false,
      id: '',
      email : '',
      image:'',
      name: '',
    },

    unseenMessage : 0,
    // 소켓 Obj state 
    // io : null -> 소켓 연결 x 
    socketConnection : {
      io : null
    },

    Snackbar:{
      open: false,
      variant: 'success',
      message: null,
      anchorOrigin: {            
        vertical: 'bottom',
        horizontal: 'left',
      }
    }
  }

  actions = {
    setValue: (obj) =>{
      this.setState({
        ...this.state,
        ...obj
      });
    },
    addContents: formData => apiClient.post('/contents', formData),
    //
    joinStudy: (detailTerm) => apiClient.post(`/contents/join/${detailTerm}`),
    //
    getUserInfomations : () => apiClient.get('/users'),
    //
    getContentsAll : () => apiClient.get('/contents/'),
    getContentsRepresentation1: () => apiClient.get('/contents/representation1'),
    getContentsRepresentation2: () => apiClient.get('/contents/representation2'),
    getContentsNew: () => apiClient.get('/contents/new'),
    getContentsAttention1: () => apiClient.get('/contents/attention1'),
    getContentsAttention2: () => apiClient.get('/contents/attention2'),
    getContentsByCategory: searchTerm => apiClient.get(`/contents/context/${searchTerm}`), //메인 검색창에서 카테고리 검색 시 데이터 보여줌
    getContentsDetail: detailTerm => apiClient.get(`/contents/detail/${detailTerm}`), //상세내용 보여줌
    getCurrentPosition: () => {
      navigator.geolocation.getCurrentPosition((position) => {
        return this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    },

    checkAuth: async () => {
      return apiClient.post('/users/checkAuth')
        .then(res => ({status: res.status, id: res.id, email: res.email, image: res.image, name: res.name }))
        .then(user => {
          console.log(user);
          let io = this.state.socketConnection.io;
          const signInStatus = user.status;

          if (io || !signInStatus){
            this.setState({
              ...this.state,
              signInInfo: {
                status: user.status,
                id : user.id,
                email: user.email,
                image: user.image,
                name: user.name
              }
            })
          }
          else{
            io =  socketIOClient('http://localhost:8080');

            this.setState({
              ...this.state,
              socketConnection:{io: io},
              signInInfo: {
                status: user.status,
                id : user.id,
                email: user.email,
                image : user.image,
                name: user.name
              }
            })
          }
        })
        .catch(err=> console.log(err))
      },

      getUnseenMessage: ()=>{
        return apiClient.post('/messages/unseenmessages')
          .then (unseenInfo =>{
            this.setState({
              ...this.state,
              unseenMessage: unseenInfo.unseenNumber
            })
          });
      },

      snackbarOpenHandler :(
        message,
        variantName = 'success',
        position = {            
          vertical: 'top',
          horizontal: 'center',
        }
      )=> {
        this.setState({
          ...this.state,
          Snackbar:{
            message,
            open: true,
            variant: variantName,
            anchorOrigin: position,
          }
        });
      },

      snackbarCloseHandler : ()=> {
        this.setState({
          ...this.state,
          Snackbar:{
            ...this.state.Snackbar,
            open: false,
          }
        });
      }
    
    }

  render() {
    const { children } = this.props;
    return(
      <Provider value={{ state: this.state, actions: this.actions }}>
        { children }
      </Provider>
    );
  }
}

export {
  AppContext,
};
