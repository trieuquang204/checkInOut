import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  AppState, Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {faCheckCircle} from '@fortawesome/pro-light-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import moment from 'moment'

export default class Checked extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlUpload: '../../assets/images/loading.jpg',
      timestempCheck: '',
      timeCheck: '',
      txttitle: 'Bạn đã Check In thành công',
      txtbtn: 'Check Out',
      colortextbtn: '#000000',
      backgroundColorBtn: '#F2F2F7',
    };
  }
  
  
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('MyLocale:Info');
      if (value !== null) {
        // We have data!!
        let info = JSON.parse(value)
        var newDate = moment(info.timestemp).format('HH:mm, DD/MM/YYYY')
        this.setState({
          urlUpload: info.url,
          timestempCheck: info.timestemp,
          timeCheck: newDate
        })
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  static navigationOptions = ({route, navigation}) => {
    var newDate = moment(Date()).format('DD/MM/YYYY')
    return {
      headerTitle:
        'Check In ngày ' + newDate,
      headerStyle: {
        backgroundColor: '#F9F9F9',
      },
      headerTitleStyle: {
        fontSize: 17,
        textAlign: 'center',
      }
    };
  };
  
  componentDidMount(){
    this._retrieveData()       
    AppState.addEventListener('change', this._handleAppStateChange);      
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    if(nextAppState == 'active'){
      this._checkTimeCheckin()
    }
  }
  _checkTimeCheckin = async () => {
    const getdate = await this._getStoreDate();
    const dateNow = new Date().getDate();
    if (getdate != dateNow) {
      Alert.alert('Thông báo!', 'Ngày '+moment(this.state.timestempCheck).format('DD/MM/YYYY')+' bạn không Checkout!',[{
        text: "OK", onPress: () => this.props.navigation.replace('CheckIn')
     }]);
    } 
  };
  _getStoreDate = async () => {
    try {
      const value = await AsyncStorage.getItem('MyLocale:Info');
      if (value !== null) {
        // We have data!!
        let info = JSON.parse(value);
        let newDate = new Date(info.timestemp);
        return newDate.getDate();
      } else {
        return 'nodata';
      }
    } catch (error) {
      // Error retrieving data
      return 'error';
    }
  };

  render() {  
      
    return (
      <ImageBackground
        source={require('../../assets/images/bg_patern.png')}
        style={styles.stylebackgroundimage}>
        <View style={styles.stylecontainerTop}>
          <View style={styles.styleImageView}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                resizeMode: 'cover',
              }}
              source={{uri: this.state.urlUpload}}
            />
            <FontAwesomeIcon
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              icon={faCheckCircle}
              size={72}
              color="#6DD400"
            />
          </View>
        </View>
        <View style={styles.stylecontainerBottom}>
          <Text style={styles.styletexttitle}>{this.state.txttitle}</Text>
          <Text style={styles.styletexttime}>{this.state.timeCheck}</Text>
          <TouchableOpacity
            style={[
              styles.stylebtnCheckOut,
              {backgroundColor: this.state.backgroundColorBtn},
            ]}
            onPress={() => {
              this.props.navigation.navigate('CheckOut');
            }}>
            <Text
              style={[
                styles.styletextCheckOut,
                {color: this.state.colortextbtn},
              ]}>
              {this.state.txtbtn}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
    stylecontainerTop: {
      width: '100%',
      height: '56%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '16%'
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
    styleImageView: {
      width: '43%',
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
    styletexttime: {
        marginTop: 16,
        fontSize: 17,
        color: '#000000',
      },
    stylebtnCheckOut: {
      width: '57%',
      height: 47,
      borderRadius: 23.5,
      alignItems: 'center',
      justifyContent: 'center',
      position: "absolute",
      top: '30%',
    },
    styletextCheckOut: {
      fontWeight: '600',
      fontSize: 17,
    },
  });
