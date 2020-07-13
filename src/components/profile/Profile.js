import React, { Component } from 'react';
import Loading from '../custom-components/Loading';
import {
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  Dimensions,
  StatusBar,
  Navigator,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
const dateNow = Date.parse(new Date());

import AsyncStorage from '@react-native-community/async-storage';
// Import Firebase
import auth from '@react-native-firebase/auth';
import ItemProfile from './ItemProfile';
import {
  faUser,
  faBirthdayCake,
  faMobile,
  faCamera
} from '@fortawesome/pro-regular-svg-icons';
import database from '@react-native-firebase/database';
// import NetInfo from "@react-native-community/netinfo";
import ImagePicker from 'react-native-image-crop-picker';

import moment from 'moment';

import { ActionSheet, Root } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myData: '12321',
      gender: '',
      dataProfile: '',
      connect: '',
      codeBase64: '',
      loading: true,
      show: false
    };
  }

  static navigationOptions = ({ route }) => {
    return {
      headerTitle: 'Trang cá nhân',
      headerTitleStyle: {
        fontSize: 20,
        textAlign: 'center',
      },
    };
  };

  gotoEditProfile({ navigation }) {
    return navigation.navigate('EditProfile');
  }

  _saveData = async (dataObj) => {
    try {
      await AsyncStorage.setItem(
        'UserInfo',
        JSON.stringify(dataObj)
      )
      // console.log('Đã lưu data')
      this._retrieveData()
    } catch (error) {
      console.log("Có lỗi xảy ra khi lưu" + error)
    }
  };

  _retrieveData = async () => {
    try {
      const result = await AsyncStorage.getItem('UserInfo');
      if (result != null) {
        // console.log('Get data thành công');
        const dataAsyn = JSON.parse(result);
        // console.log(result);
        this.setState({
          myData: dataAsyn
        }, () => {
          switch (this.state.myData.gender) {
            case 0:
              this.setState({ gender: 'Nữ' });
              break;
            case 1:
              this.setState({ gender: 'Nam' });
              break;
            case 2:
              this.setState({ gender: 'Khác' });
              break;
            default:
              this.setState({ gender: 'Nam' });
          }
        })
      }
    } catch (error) {
      console.log('loi roi')
    }
  };

  takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 768,
      height: 1024,
      includeBase64: true,
      compressImageMaxWidth: 768,
      compressImageMaxHeight: 1024,
      compressImageQuality: 0.5,
      cropping: false,
    }).then(image => {
      console.log(image.data)
      handleUploadPhoto(image.data)
    })
  }

  selectImageLibarary = () => {
    ImagePicker.openPicker({
      mediaType: "photo",
      includeBase64: true,
      compressImageQuality: 0.5,
      compressImageMaxWidth: 768,
      compressImageMaxHeight: 1024,
    }).then(photo => {
      console.log(photo);
      this.setState({show: true})
      handleUploadPhoto(photo.data)
    });
  }

  onPressImage = () => {
    const buttons = ['Take Photo', 'Choose from library', 'Cancel'];
    ActionSheet.show(
      {
        options: buttons,
        cancelButtonIndex: 3,
        title: ''
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.takePhotoFromCamera();
            break;

          case 1:
            this.selectImageLibarary();
            break;

          default:
            break
        }
      }
    )
  }

  componentDidMount() {
    // console.log( 'dateNow', dateNow );
    var _this = this
    var userId = auth().currentUser.uid;
    // console.log('quang', userId)
    database().ref('tbl_user/' + userId)
				.once('value')
				.then(snapshot => {
          // var getkeys = Object.keys(snapshot.val());
          // console.log(getkeys )

          if(snapshot.val() == null ) {
            database().ref('tbl_user/' + userId).update({
						  avatar: '',
              dateofbirth: '',
              email : '',
              fullname : '',
              gender : 0,
              identification_card: "",
              mobile : "",
              user_id :userId,
            }); 

          }
          else {
            console.log('')
          }
        })

    database()
      .ref('tbl_user')
      .child(userId)
      .on('value',snapshot => {
        if(snapshot.val() != undefined){
          this._saveData(snapshot.val());
          this.setState({
            loading: false,
            show: false
          })
        }else{
          this.setState({loading: false,})
        }
      })
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      )
    }
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Root>
            <View style={styles.viewTop}>
              <TouchableOpacity
                onPress={() => this.onPressImage()}
              >
                <Image
                  source={{
                    uri: this.state.myData.avatar,
                  }}
                  style={styles.viewTopImage}
                />

                <FontAwesomeIcon
                  icon={faCamera}
                  size={20}
                  style={{ position: 'absolute', left: '70%', top: '45%', zIndex: 1000, color: 'silver' }}
                />
                {this.state.show == true ?  <ActivityIndicator
        style={{ position: 'absolute', left: '50%', top: '30%', zIndex: 1000, color: 'silver',color: 'white' }}
      />: null}

              </TouchableOpacity>
              <View style={{ marginLeft: 16 }}>
                <Text style={{ fontSize: 22, fontWeight: '700' }}>
                  {this.state.myData.fullname != undefined ? this.state.myData.fullname : 'Cập Nhật Họ Tên'}
                </Text>
                <Text style={{ fontSize: 13, color: '#999999' }}>
                  {this.state.myData.email}
                </Text>
              </View>
            </View>
            <View style={{ height: 8, backgroundColor: '#F9F9F9' }} />
            <View style={{ backgroundColor: 'white' }}>
              <Text style={{ fontWeight: '700', fontSize: 17, margin: 16 }}>
                Thông tin cá nhân
            </Text>
              <ItemProfile
                image={faUser}
                title="Giới tính"
                value={this.state.myData.gender != undefined ? this.state.gender: 'Cập nhật giới tính'}
              />
              <ItemProfile
                image={faBirthdayCake}
                title="DOB"
                value={this.state.myData.dateofbirth != undefined ? this.state.myData.dateofbirth : 'Cập nhật ngày sinh'}
              />
              <ItemProfile
                image={faMobile}
                title="SĐT"
                value={this.state.myData.mobile != undefined ? this.state.myData.mobile : 'Cập nhật SĐT'}
              />
            </View>
            <View style={{ backgroundColor: 'white' }}>
              <View style={styles.btn}>
                <TouchableOpacity
                  color="#000000"
                  onPress={() => {
                    this.props.navigation.navigate('EditProfile', {
                      mySendData: this.state.myData,
                    });
                  }}
                >
                  <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Chỉnh sửa thông tin</Text>
                </TouchableOpacity>                
              </View>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  auth()
                    .signOut()
                    .then(() => console.log('User signed out!'));
                }}
              >
                <Text style={{ fontSize: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </Root>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const urlUpload = "https://api.imgur.com/3/upload"
const handleUploadPhoto = (image) => {
  console.log(image)
  fetch(urlUpload, {
    method: "POST",
    body: image,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Client-ID 4a171f329d4595b'
    }
  })
    .then(response => response.json())
    .then(response2 => {
      console.log(response2)
      // alert("Upload success!");    
      urlImage = response2.data.link
      // alert(urlImage)
      pushToFireabse(urlImage)
    })
    .catch(error => {
      // console.log("upload error", error);
      // alert(error)
      alert("Upload lỗi! Vui lòng thử lại.");
      this.setState({show: false})
    });
};

const pushToFireabse = (url) => {
  var idu = auth().currentUser.uid;
  database()
    .ref('tbl_user')
    .child(idu)
    .update({
      avatar: url,
    })
    // .then(() => 
    //   // console.log('Data updated.'))
    // .catch(error => console.log(error))
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   marginTop: Constants.statusBarHeight,
    backgroundColor: 'white',
    // marginBottom: 85,
  },
  scrollView: {
    // flex: 1,
    //   backgroundColor: 'white',
    marginHorizontal: 0,
  },
  text: {
    fontSize: 42,
  },
  viewTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 145,
    backgroundColor: 'white',
  },
  viewTopImage: {
    height: 100,
    width: 100,
    marginLeft: 24,
    backgroundColor: '#A0F477',
    overflow: 'hidden',
    borderRadius: 50,
    position: 'relative',
    zIndex: 100
  },
  btn: {
    marginLeft: 80,
    marginRight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: 47,
    marginTop: 32,
    marginBottom: 32,
    // width: 40,
    borderRadius: 23,
    backgroundColor: '#F2F2F7',
  },
});
