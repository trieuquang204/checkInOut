import React, {Component} from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Button,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {faCameraAlt} from '@fortawesome/pro-light-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import {text} from '@fortawesome/fontawesome-svg-core';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import database from '@react-native-firebase/database';
import Loader from '../checkin/Loader';
import {firebase} from '@react-native-firebase/database';

var currentUserUID = '';
var mfirebase = '';
var typeBtn = '';
export default class OffRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      created: new Date().getTime(),
      dateTimeString: new Date().getTime(),
      noteString: '',
      requestString: '',
      typeString: '',
      text: '',
      statusInfo: 'late',
      popup: false,
      clickTouch: 1,
      selectedDate: 'Ngày xin phép',
      selectedTime: 'Thời gian tới',
      dateTimeCheck: 'time',
      visiableThoigian: 'flex',
      titleThoigian: 'Thời gian đến',
      dateCalendar: new Date(),
      modalVisiable: false,
    };
  }

  _setView = request => {
    switch (request) {
      case 'DENMUON':
        this.setState({
          visiableThoigian: 'flex',
          titleThoigian: 'Thời gian đến',
          dateTimeString: new Date().getTime(),
        });
        break;
      case 'XINNGHI':
        this.setState({
          visiableThoigian: 'none',
        });
        break;
      case 'VESOM':
        this.setState({
          visiableThoigian: 'flex',
          titleThoigian: 'Thời gian về',
          dateTimeString: new Date().getTime(),
        });
        break;
      default:
        break;
    }
  };
  static navigationOptions = ({route}) => {
    return {
      headerTitle: 'Xin phép ',
      headerTitleStyle: {
        fontSize: 20,
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
  componentDidMount() {
    try {
      typeBtn = this.props.route.params.typeBtn;
      this.setState({
        requestString: 'DENMUON',
        typeString: "XINPHEP"
      });
    } catch (error) {
      typeBtn = 'btnCheckout';
      this.setState({
        requestString: 'VESOM',
        typeString: "CHECKOUT"
        
      });
    }
    currentUserUID = firebase.auth().currentUser.uid;
    mfirebase = firebase
      .database()
      .ref(`tbl_check_in/${currentUserUID}/history`);
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="height"
        contentContainerStyle={{flex: 1}}
        style={{flex: 1}}>
        <View style={styles.container}>
          <Loader loading={this.state.modalVisiable} />
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}>
            <View height="90%">
              <Text style={styles.texttitle}>Tùy chọn</Text>

              <View style={styles.inputView}>
                <RNPickerSelect
                  placeholder= {{}}
                  Icon={() => {
                    return (
                      <Image
                        source={require('../../assets/images/stick.png')}
                        style={styles.dropdownIcon}
                      />
                    );
                  }}
                  items={typeBtn == 'btnCheckin'
                      ? [
                          {label: 'Đến muộn', value: 'DENMUON'},
                          {label: 'Xin nghỉ', value: 'XINNGHI'}
                        ]
                      : [{label: 'Về sớm', value: 'VESOM'}]
                  }
                  onValueChange={(value, item, type) => {
                    this._setView(value);
                    this.setState({requestString: value});
                    if (value == 'DENMUON') {
                      this.setState({typeString: 'XINPHEP'});
                    } else if (value == 'XINNGHI') {
                      this.setState({typeString: 'XINPHEP'});
                    } else {
                      this.setState({typeString: 'CHECKOUT'});
                    }
                  }}
                  value = {this.state.requestString}
                  
                  style={{...pickerSelectStyles}}
                />
              </View>
              <Text style={styles.texttitle}>Ngày xin phép</Text>
              <View style={[styles.inputView, {justifyContent: 'center'}]}>
                <TouchableOpacity
                  // onPress={() => {
                  //   // alert('select 1');
                  //   this.setState({
                  //     popup: true,
                  //     clickTouch: 1,
                  //     dateTimeCheck: 'date',
                  //   });
                  // }}
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 17}}>
                    {moment(this.state.dateTimeString).format('DD/MM/YYYY')}
                  </Text>
                  {/* <Image
                    source={require('../../assets/images/stick.png')}
                    style={styles.dropdownIcon}
                  /> */}
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styles.texttitle,
                  {display: this.state.visiableThoigian},
                ]}>
                {this.state.titleThoigian}
              </Text>
              <View
                style={[
                  styles.inputView,
                  {
                    display: this.state.visiableThoigian,
                    justifyContent: 'center',
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    //    alert('select 2');
                    this.setState({
                      popup: true,
                      clickTouch: 2,
                      dateTimeCheck: 'time',
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginStart: 12,
                    marginEnd: 12,
                  }}>
                  <Text style={{fontSize: 17}}>
                    {moment(this.state.dateTimeString).format('HH:mm')}
                  </Text>
                  <Image
                    source={require('../../assets/images/stick.png')}
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.texttitle}>
                Lý do
                <Text style={{color: 'red'}}> *</Text>
              </Text>
              <TextInput
                style={styles.textArea}
                onChangeText={text => {
                  this.setState({noteString: text});
                }}
                placeholder="Nhập lý do"
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity
                onPress={() => {
                  if (this.state.noteString.length < 5) {
                    Alert.alert('Thông báo!', 'Vui lòng nhập lý do >5 ký tự!');
                  } else {
                    pushToFireabse(this);
                  }
                }}
                style={styles.btnxinphep}>
                <Text> Xin phép </Text>
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={this.state.popup}
              mode={this.state.dateTimeCheck}
              minimumDate={new Date().getTime()}
              maximumDate={new Date(1609372800000)}
              date={this.state.dateCalendar}
              onConfirm={data => {
                this.setState({
                  popup: false,
                });
                // console.log("---------------: data "+ data)

                if (this.state.clickTouch == 1) {
                  this.setState({
                    dateTimeString: moment(data).unix() * 1000,
                    dateCalendar: data,
                  });
                } else if (this.state.clickTouch == 2) {
                  this.setState({
                    dateTimeString: moment(data).unix() * 1000,
                  });
                }
              }}
              onCancel={() => {
                this.setState({popup: false});
              }}
              timeZone
              OffersetInMinutes={0}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const pushToFireabse = _this => {
  _this._showDialog(true);
  let dayHisoryEnd = '';
  let keyHistoryEnd = '';
  mfirebase
    .orderByChild('date')
    .once('value', function(snapshot) {
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
          let listCheckinlog = Object.values(listDatas[0].checkinlog);
          let keyCheckinlog = Object.keys(listDatas[0].checkinlog);
          var posiExistLog = checkExistLog(
            listCheckinlog,
            _this.state.requestString,
          );
          if (posiExistLog == -1) {
            //Chưa tồn tại trạng thái
            pushNewLog(keyHistoryEnd, timeNow.getTime(), _this);
          } else if (posiExistLog == -2) {
            //Đã tồn tại trạng thái xin nghỉ
            Alert.alert(
              'Thông báo',
              'Bạn đã xin nghỉ nên không thể cập nhật hôm nay!',
              [
                {
                  text: 'OK',
                  onPress: () => _this._showDialog(false),
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          } else {
            //Đã tồn tại trạng thái ở vị trí posiExistLog
            Alert.alert(
              'Thông báo',
              _this.state.requestString + ' đã tồn tại, bạn có muốn cập nhật?',
              [
                {
                  text: 'Cancel',
                  onPress: () => _this._showDialog(false),
                  style: 'cancel',
                },
                {
                  text: 'Update',
                  onPress: () =>
                    updateNewLog(
                      keyHistoryEnd,
                      keyCheckinlog[posiExistLog],
                      timeNow.getTime(),
                      _this,
                    ),
                },
              ],
              {cancelable: false},
            );
          }
        }
      } else {
        Alert.alert(
          'Thông báo!',
          'Data không tồn tại date timestemp' + listDatas[0].date, 
          {cancelable : false}
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
  // mfirebase.child("-MAF4wOzIwfbEaHSjEai").remove()
  // firebase.database().ref('tbl_check_in').child("QYxrjQvTCSR6B4l3PEh3Tyj8gsb2").remove()
};

const checkExistLog = (listLog, type) => {
  for (var i = 0; i < listLog.length; i++) {
    if (listLog[i].type == 'XINPHEP') {
      if (listLog[i].request == 'XINNGHI') {
        return -2;
      } else if (listLog[i].request == type) {
        return i;
      }
    }
  }
  return -1;
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
    });
};
const updateNewLog = (keyParent, keyLog, timesnow, _this) => {
  var dataPush = '';
  switch (_this.state.requestString) {
    case 'XINNGHI':
      dataPush = {
        created: timesnow,
        datetime: _this.state.dateTimeString,
        request: _this.state.requestString,
        type: _this.state.typeString,
        note: _this.state.noteString,
      };
      break;
    case 'DENMUON':
      dataPush = {
        created: timesnow,
        datetime: _this.state.dateTimeString,
        request: _this.state.requestString,
        type: _this.state.typeString,
        note: _this.state.noteString,
      };
      break;

    default:
      dataPush = {
        created: timesnow,
        datetime: _this.state.dateTimeString,
        request: _this.state.requestString,
        type: _this.state.typeString,
        note: _this.state.noteString,
        image: '',
      };
      break;
  }
  mfirebase
    .child(keyParent)
    .child('checkinlog')
    .child(keyLog)
    .update(dataPush, function(error) {
      if (error) {
        // The write failed...
        console.log('Loi ' + error);
      } else {
        // Data saved successfully!
        // setStoreData(urlImage,timesnow)
        Alert.alert('Thông báo', 'Cập nhật thành công!', 
        {cancelable : false});
        _this._showDialog(false);
      }
    });
};
const pushNewLog = (keyParent, timesnow, _this) => {
  var dataPush = '';
  switch (_this.state.requestString) {
    case 'XINNGHI':
      dataPush = {
        created: timesnow,
        datetime: _this.state.dateTimeString,
        request: _this.state.requestString,
        type: _this.state.typeString,
        note: _this.state.noteString,
      };
      break;
    case 'DENMUON':
      dataPush = {
        created: timesnow,
        datetime: _this.state.dateTimeString,
        request: _this.state.requestString,
        type: _this.state.typeString,
        note: _this.state.noteString,
      };
      break;

    default:
      dataPush = {
        created: timesnow,
        datetime: _this.state.dateTimeString,
        request: _this.state.requestString,
        type: _this.state.typeString,
        note: _this.state.noteString,
        image: '',
      };
      break;
  }
  mfirebase
    .child(keyParent)
    .child('checkinlog')
    .push(dataPush, function(error) {
      if (error) {
        Alert.alert('Thông báo', 'Lỗi xin phép: ' + error.TypeError, [
          {
            text: 'OK',
            onPress: () => _this._showDialog(false),
          },
        ], 
        {cancelable : false});
      } else {
        // Alert.alert('Thông báo','Xin phép thành công!');

        switch (_this.state.requestString) {
          case 'XINNGHI':
            getDataSendScreen(keyParent, _this);
            break;
          case 'VESOM':
            getDataSendScreen(keyParent, _this);
            break;
          case 'DENMUON':
            _this.props.navigation.reset({
              index: 0,
              routes: [{name: 'CheckOut'}],
            });
            break;
          default:
            Alert.alert('Thông báo', 'Lỗi chưa xác định trạng thái xin phép', [
              {
                text: 'OK',
                onPress: () => _this._showDialog(false),
              },
            ],
            {cancelable : false});
            break;
        }
        _this._showDialog(false);
      }
    });
};
const getDataSendScreen = (keyParent, _this) => {
  mfirebase
    .child(keyParent)
    .once('value')
    .then(snapshot => {
      let dataLog = snapshot.val();
      let listLog = Object.values(dataLog.checkinlog);
      dataLog = {...dataLog, checkinlog: listLog};
      _this.props.navigation.reset({
        index: 0,        
        routes: [{name: 'History_detail', params: {data4: dataLog}}],        
      });
      _this._showDialog(false);
    })
    .catch(error => {
      Alert.alert('Thông báo', 'Lỗi: '+error.TypeError, [
        {
          text: 'OK',
          onPress: () => _this._showDialog(false),
        },
      ], 
      {cancelable : false});
    });
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    fontSize: 17,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 40,
    fontSize: 17,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: 'red',
    borderRadius: 4,
    borderWidth: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 12,
    right: 12,
  },
});
const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingEnd: 15,
    paddingStart: 15,
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
  },
  texttitle: {
    marginTop: 15,
    fontSize: 17,
    color: '#000000',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    fontSize: 17,
    justifyContent: 'flex-start',
  },
  textArea: {
    height: 100,
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    fontSize: 17,
    paddingTop: 10,
  },
  btnxinphep: {
    marginTop: 75,
    marginHorizontal: 80,
    height: 47,
    backgroundColor: '#F2F2F7',
    borderRadius: 23.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textxinphep: {
    fontWeight: '700',
    fontSize: 17,
    color: '#000000',
  },
  scroll: {
    paddingVertical: 30,
  },
  dropdownIcon: {
    width: 16,
    height: 14,
    alignItems: 'flex-end',
  },
  statusDropdown: {
    flex: 1,
    backgroundColor: 'black',
  },
  inputView: {
    marginVertical: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 40,
    justifyContent: 'space-between',
  },
});
