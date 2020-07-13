import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../checkin/Loader';
import moment from 'moment';

import {connect} from 'react-redux';
import {checkIn, xacNhanCheckIn} from '../../actions';
import {firebase} from '@react-native-firebase/database';

var currentUserUID = '';
var mfirebase = '';
var urlImage = '';
class ImageSelected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uripicture: this.props.route.params.uripicture,
      base64picture: this.props.route.params.base64picture,
      txttitle: 'Ấn vào ảnh để chụp lại',
      txtbtn: 'Xác nhận',
      colortextbtn: '#FFFFFF',
      backgroundColorBtn: '#0091FF',
      urlUpload: '',
      modalVisiable: false,
    };
  }
  static navigationOptions = ({route, navigation}) => {
    var newDate = moment(Date()).format('DD/MM/YYYY');
    return {
      headerTitle: 'Check In ngày ' + newDate,
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
  _showDialog = visiable => {
    this.setState({
      modalVisiable: visiable,
    });
  };
  render() {
    return (
      <ImageBackground
        source={require('../../assets/images/bg_patern.png')}
        style={styles.stylebackgroundimage}>
        <View>
          <Loader loading={this.state.modalVisiable} />
        </View>

        <View style={styles.stylecontainerTop}>
          <TouchableOpacity
            style={styles.stylecamera}
            onPress={() => {
              this._gotoScreenTakePicture();
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                resizeMode: 'cover',
              }}
              source={{uri: this.state.uripicture}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.stylecontainerBottom}>
          <Text style={styles.styletexttitle}>{this.state.txttitle}</Text>
          <TouchableOpacity
            style={[
              styles.stylebtnxacnhan,
              {backgroundColor: this.state.backgroundColorBtn},
            ]}
            onPress={() => {
              handleUploadPhoto(this);
              this._showDialog(true);
              // alert('Go to layout Xac nhan');
            }}>
            <Text
              style={[
                styles.styletextxacnhan,
                {color: this.state.colortextbtn},
              ]}>
              {this.state.txtbtn}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
  _gotoScreenTakePicture = () => {
    this.props.navigation.replace('TakePicture');
  };
}
const gotoScreenChecked = _this => {
  _this.props.dispatch(checkIn());
  _this.props.navigation.reset({
    index: 0,
    routes: [{name: 'Checked'}],
  });
};
const urlUpload = 'https://api.imgur.com/3/upload';
const handleUploadPhoto = _this => {
  fetch(urlUpload, {
    method: 'POST',
    body: _this.state.base64picture,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Client-ID 4a171f329d4595b',
    },
  })
    .then(response => response.json())
    .then(response => {
      // alert("Upload success!");
      urlImage = response.data.link;
      pushToFireabse(_this);
      // setStoreData(response.data.link,timestemp)
      // gotoScreenChecked(_this);
      // _this._showDialog(false)
    })
    .catch(error => {
      console.log('upload error', error);
      Alert.alert('Thông báo!', 'Upload lỗi! Vui lòng thử lại.', [
        {
          text: 'OK',
          onPress: () => _this._showDialog(false),
          type: "cancel"
        }
      ], 
      { cancelable: false });
      _this._showDialog(false);
    });
};

const pushToFireabse = _this => {
  currentUserUID = firebase.auth().currentUser.uid;
  mfirebase = firebase.database().ref(`tbl_check_in/${currentUserUID}/history`);

  let dayHisoryEnd = '';
  let keyHistoryEnd = '';
  mfirebase
    .orderByChild('date')
    .once('value')
    .then(snapshot => {
      let listDatas = Object.values(snapshot.val());
      let listDataKeys = Object.keys(snapshot.val());
      dayHisoryEnd = new Date(parseInt(listDatas[0].date)).getDate();
      keyHistoryEnd = listDataKeys[0];
      if (dayHisoryEnd) {
        let timeNow = new Date();
        if (dayHisoryEnd != timeNow.getDate()) {
          // Ngày mới không tồn tại trên hệ thống=> Tạo ngày mới
          pushNewDate(timeNow.getTime(), _this);
        } else {
          // Ngày mới đã tồn tại trên hệ thống
          pushNewLog(keyHistoryEnd, timeNow.getTime(), _this);
        }
      } else {
        Alert.alert(
          'Thông báo!',
          'Data không tồn tại date timestemp' + listDatas[0].date,
          [
            {
              text: 'OK',
              onPress: () => _this._showDialog(false),
            },
          ], 
          {cancelable : false},
        );
      }
    })
    .catch(error => {
      if (!error.TypeError) {
        let timeNow = new Date();
        pushNewDate(timeNow.getTime(), _this);
      } else {
        Alert.alert('Thông báo!', 'Lỗi: ' + error.TypeError, [
          {
            text: 'OK',
            onPress: () => _this._showDialog(false),
          },
        ], 
        {cancelable : false});
      }
    });
  // firebase.database().ref('tbl_check_in').child("QYxrjQvTCSR6B4l3PEh3Tyj8gsb2").remove()
};
const checkExistLog = (listLog, type) => {
  for (var i = 0; i < listLog.length; i++) {
    if (listLog[i].type == type) {
      return true;
    }
  }
  return false;
};
const pushNewDate = (timesnow, _this) => {
  mfirebase
    .push(
      {
        checkin_img: undefined,
        checkinlog: undefined,
        checkout_img: undefined,
        date: timesnow,
      },
      function(error) {
        if (error) {
          // The write failed...
          console.log('Loi ' + error);
        } else {
          // Data saved successfully!
        }
      },
    )
    .then(snapshot => {
      //Push nội dung check in
      pushNewLog(snapshot.key, timesnow, _this);
    })
    .catch(error => {
      Alert.alert('Thông báo!', 'Lỗi22: ' + error.TypeError, [
        {
          text: 'OK',
          onPress: () => _this._showDialog(false),
        },
      ], 
      {cancelable : false});
    });
};
const pushNewLog = (keyParent, timesnow, _this) => {
  mfirebase.child(keyParent).update({checkin_img: urlImage});
  mfirebase
    .child(keyParent)
    .child('checkinlog')
    .push(
      {
        created: timesnow,
        datetime: timesnow,
        image: urlImage,
        type: 'CHECKIN',
      },
      function(error) {
        if (error) {
          // The write failed...
          console.log('Loi ' + error);
        } else {
          setStoreData(urlImage, timesnow);
          gotoScreenChecked(_this);
          _this._showDialog(false);
        }
      },
    );
};
const setStoreData = async (dataUrl, timestemp) => {
  let value = {
    url: dataUrl,
    timestemp: timestemp,
  };

  try {
    await AsyncStorage.setItem('MyLocale:Info', JSON.stringify(value));
  } catch (error) {
    // Error saving data
  }
};

const styles = StyleSheet.create({
  stylecontainerTop: {
    width: '100%',
    height: '56%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '16%',
  },
  stylecontainerBottom: {
    alignItems: 'center',
    width: '100%',
    height: '54%',
  },
  stylebackgroundimage: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'column',
  },
  stylecamera: {
    width: '43%',
    // height: '43%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styletexttitle: {
    fontSize: 17,
    color: '#000000',
  },
  stylebtnxacnhan: {
    width: '57%',
    height: 47,
    borderRadius: 23.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '30%',
  },
  styletextxacnhan: {
    fontWeight: '600',
    fontSize: 17,
  },
});

export default connect()(ImageSelected);
