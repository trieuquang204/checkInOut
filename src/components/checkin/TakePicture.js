import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RNCamera } from 'react-native-camera';
import Loader from '../checkin/Loader';

export default class TakePicture extends Component {
  state = {
    cameraReady: 'none',
    visiableModal: false,
  };
  static navigationOptions = ({route, navigation}) => {
    return {
      headerTitle: 'Checkin',
      headerStyle: {
        backgroundColor: '#F9F9F9',
      },
      headerTitleStyle: {
        fontSize: 17,
        textAlign: 'center',
      },
      headerRight: () => <Text />,
    };
  };
  _setCameraReady = () => {
    this.setState({
      cameraReady: 'flex',
    });
  };
  _setVisiableModal = valueModal => {
    this.setState({
      visiableModal: valueModal,
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader loading={this.state.visiableModal} />
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}
          defaultVideoQuality={RNCamera.Constants.VideoQuality['480p']}
          onCameraReady={() => this._setCameraReady()}
          
        />
        <TouchableOpacity
          onPress={() => {
            this._takePicture(this);
            this._setVisiableModal(true);
          }}
          style={styles.capture}>
          <Text
            style={{
              fontSize: 17,
              color: '#FFFFFF',
            }}>
            SNAP
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  _takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.4, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this._gotoImageSelect(data.uri, data.base64);
    }
  };
  _gotoImageSelect = (uri, database64) => {
    this._setVisiableModal(false);
    this.props.navigation.replace('ImageSelected', {
      uripicture: uri,
      base64picture: database64,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  preview: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    backgroundColor: '#FB8E7690',
    borderRadius: 500,
    width: 70,
    height: 70,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2%',
  },
});
