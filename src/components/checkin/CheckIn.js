import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {faCameraAlt, faRoad} from '@fortawesome/pro-light-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import moment from 'moment';
import {connect} from 'react-redux';
import {checkIn, xacNhanCheckIn} from '../../actions';
import {firebase} from '@react-native-firebase/database';
import Loader from '../checkin/Loader';

var currentUserUID = '';
var mfirebase = '';
class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uripicture: 'none',
      txttitle: 'Chụp ảnh để Check In',
      txtbtn: 'Xin phép',
      colortextbtn: '#000000',
      backgroundColorBtn: '#F2F2F7',
      modalVisiable: false,
    };
  }

  static navigationOptions = ({route}) => {
    var newDate = moment(Date()).format('DD/MM/YYYY');
    return {
      headerTitle: 'Check In ngày ' + newDate,
      headerTitleStyle: {
        fontSize: 17,
        textAlign: 'center',
      },
    };
  };

  _showDialog = visiable => {
    this.setState({
      modalVisiable: visiable,
    });
  };

  componentDidMount() {
    startScreen(this);
    // firebase.database().ref('tbl_check_in').child("rn4WX4cTGjQUjyM9ODtCtlGnTXe2").remove()
  }
  render() {
    return (
      <ImageBackground
        source={require('../../assets/images/bg_patern.png')}
        style={styles.stylebackgroundimage}>
        <Loader loading={this.state.modalVisiable} />
        <View style={styles.stylecontainerTop}>
          <TouchableOpacity
            style={styles.stylecamera}
            onPress={() => {
              this._gotoScreenTakePicture();
            }}>
            <FontAwesomeIcon icon={faCameraAlt} size={72} color="#0091FF" />
          </TouchableOpacity>
        </View>
        <View style={styles.stylecontainerBottom}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CheckOut')}>
            <Text style={styles.styletexttitle}>{this.state.txttitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.stylebtnxinphep,
              {backgroundColor: this.state.backgroundColorBtn},
            ]}
            onPress={() => {
              // this.props.dispatch( xacNhanCheckIn('111111','33333333','444444444'));
              this.props.navigation.navigate('OffRequest',{typeBtn: "btnCheckin"});
            }}>
            <Text
              style={[
                styles.styletextxinphep,
                {color: this.state.colortextbtn},
              ]}>
              {this.state.txtbtn}
            </Text>

            {/* <Text >
              {this.props.valueUrlLocale}
             </Text> */}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
  _gotoScreenTakePicture = () => {
    requestCameraPermission(this.props);
  };
}

const startScreen = async _this => {
  currentUserUID = firebase.auth().currentUser.uid;
  mfirebase = firebase.database().ref(`tbl_check_in/${currentUserUID}/history`);
  _this._showDialog(true);
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
          // Ngày mới không tồn tại trên hệ thống
          _this._showDialog(false);
        } else {
          // Ngày mới đã tồn tại trên hệ thống
          let listCheckinlog = Object.values(listDatas[0].checkinlog);
          _this._showDialog(false);
          if((checkExistLogRequest(listCheckinlog,"XINNGHI")==true)||(checkExistLogType(listCheckinlog,"CHECKOUT")==true)){
            // Đã Checkin hoặc xin đi muộn
            let dataLog = listDatas[0]
            let listLog = Object.values(dataLog.checkinlog)
            dataLog = {...dataLog, checkinlog: listLog }
            _this.props.navigation.replace("History_detail",{data4: dataLog})
            // _this.props.navigation.replace("History")
          } else if((checkExistLogType(listCheckinlog,"CHECKIN")==true)||(checkExistLogRequest(listCheckinlog,"DENMUON")==true)){
            // Đã Checkin hoặc xin đi muộn
            _this.props.navigation.replace("Checked")
          }
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
      _this._showDialog(false);
    });
};
const checkExistLogType = (listLog, type) => {
  for (var i = 0; i < listLog.length; i++) {
    if (listLog[i].type == type) {
      return true
    }
  }
  return false;
};
const checkExistLogRequest = (listLog, request) => {
  for (var i = 0; i < listLog.length; i++) {
    if (listLog[i].request == request) {
      return true
    }
  }
  return false;
};

const requestCameraPermission = async propsMain => {
  try {
    const granted = await request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }),
    );
    if (granted === RESULTS.GRANTED) {
      requestWritePermission(propsMain);
    }
    if (granted === RESULTS.BLOCKED) {
      Alert.alert(
        'Quyền đã bị từ chối',
        Platform.select({
          android: 'Truy cập Setting để mở quyền Camera và Storage',
          ios: 'Truy cập Setting để mở quyền Camera và Photo',
        }),
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => Linking.openSettings()},
        ], 
        {cancelable : false},
      );
    } else {
      console.log('Camera permission denied');
    }
    console.log('--------------- ' + granted);
  } catch (err) {
    console.warn(err);
  }
};

const requestWritePermission = async propsMain => {
  try {
    const granted = await request(
      Platform.select({
        android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }),
    );
    if (granted === RESULTS.GRANTED) {
      propsMain.navigation.navigate('TakePicture');
    }
    if (granted === RESULTS.BLOCKED) {
      Alert.alert(
        'Quyền đã bị từ chối',
        Platform.select({
          android: 'Truy cập Setting để mở quyền Camera và Storage',
          ios: 'Truy cập Setting để mở quyền Camera và Photo',
        }),
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => Linking.openSettings()},
        ], 
        {cancelable : false},
      );
    } else {
      console.log('Write permission denied');
    }
  } catch (err) {
    console.warn(err);
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
    flexDirection: 'column',
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
  stylebtnxinphep: {
    width: '57%',
    height: 47,
    borderRadius: 23.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '30%',
  },
  styletextxinphep: {
    fontWeight: '600',
    fontSize: 17,
  },
});

// function getInfo(state){
//     return {
//       valueUrlLocale: state.checkinInfo.info.urlOnline
//     }
// }
// export default connect(getInfo)(CheckIn)

export default connect()(CheckIn);
