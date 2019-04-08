import React, { Component } from "react";
import { AppContext } from "../../contexts/appContext";
import DetailContentsView from "./DetailContentsView";
import LoadingProgress from "../UIElements/LoadingProgress";

/* global naver */

class DetailContentsController extends Component {
  static contextType = AppContext;

  state = {
    detailTerm: this.props.match.params.id,
    signInInfo: {}
  };

  async componentDidMount() {
    setTimeout(async () => {
      const { detailTerm } = this.state;
      const content = await this.context.actions.getContentsDetail(detailTerm);
      const location = await this.getLatLngByAddress(content.studyLocation);
      const participants = content.participants;

      this.setState({
        content,
        participants,
        signInInfo: this.context.state.signInInfo
      });

      const map = new naver.maps.Map("naverMap", {
        center: new naver.maps.LatLng(location),
        zoom: 10
      });
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(location),
        map: map
      });
    }, 2000);
  }

  getLatLngByAddress = address => {
    return new Promise((resolve, reject) => {
      naver.maps.Service.geocode(
        {
          address: address
        },
        (status, response) => {
          if (status === naver.maps.Service.Status.ERROR) {
            reject(alert("지도 API 오류입니다."));
          }
          let item = response.result.items[0];
          resolve(item.point);
        }
      );
    });
  };

  joinStudy = async () => {
    const { detailTerm } = this.state;
    await this.context.actions.joinStudy(detailTerm);
    window.location.reload();
  };

  deleteStudy = () => {
    const { detailTerm } = this.state;
  };

  render() {
    const { content, participants, signInInfo } = this.state;
    return (
      <div>
        {content ? (
          <DetailContentsView
            content={content}
            participants={participants}
            signInInfo={signInInfo}
            joinStudy={this.joinStudy}
            deleteStudy={this.deleteStudy}
          />
        ) : (
          <LoadingProgress />
        )}
      </div>
    );
  }
}

export default DetailContentsController;
