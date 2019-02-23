import React, { Component } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import './Carou.css';


class Article extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.state = {
        open: false,
      };
    }
  
    render() {
      const style2 = {
        border: '1px solid black',
      };
      const artStyle = {
        boxsizing: 'content-box',  
        width: '500px',
        height: '100px',
        padding: '30px',  
        border: '1px solid blue',
    
      };
      const { open } = this.state;
      return (
        <>
          <Button
            onClick={() => this.setState({ open: !open })}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            더보기
          </Button>
          <Collapse in={this.state.open}>
            <div id="example-collapse-text" style = {artStyle}>
              Anyone interested in MimbleWimble or privacy coins are welcome!
  
  BEAM is an implementation of Mimblewimble. The first whitepaper for the protocol was released anonymously in a Bitcoin IRC channel. The BEAM team launched main-net that implements these revolutionary ideas in Q1 2019.
  1. A brief presentation about Beam
  2. Differences between other Privacy Coins
  3. Future of Beam
  4. How to mine it
  
  MimbleWimble 또는 개인 정보 보호 동전에 관심이있는 사람은 누구나 환영합니다!
  
  빔은 Mimblewimble을 구현 한 것입니다. 프로토콜에 대한 첫 번째 백서는 Bitcoin IRC 채널에서 익명으로 공개되었습니다. BEAM 팀은 2019 년 1 분기에 이러한 혁신적인 아이디어를 구현하는 main-net을 출시했습니다.
  1. 보에 대한 간단한 설명
  2. 다른 프라이버시 코인과의 차이점
  3. 빔의 미래
  4. 그것을 채굴하는 법
            </div>
          </Collapse>
        </>
      );
    }
  }
  
 
export default Article;