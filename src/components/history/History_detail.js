import React, {Component} from 'react';
import moment from 'moment';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TouchableHighlight,
  Button,
} from 'react-native';


import { faSignInAlt,faSignOut} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default class History_detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ dataHeader: this.props.route.params.data4.date });
  }

  static navigationOptions = ({route, navigation}) => {
    return {
    headerTitle: <Text>{moment(route.params.dataHeader).format('DD-MM-YYYY')}</Text>,
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

  render() {
    var data5 = this.props.route.params.data4
    console.log(data5)
    var dataOne = data5.checkinlog.filter(x => x.type != 'CHECKOUT')[
      data5.checkinlog.filter(x => x.type != 'CHECKOUT').length -
        1
    ] 
    var dataTwo =  data5.checkinlog.filter(x => x.type == 'CHECKOUT')[
      data5.checkinlog.filter(x => x.type == 'CHECKOUT').length -
        1
    ]
    return (
     <ScrollView style={{backgroundColor: '#FFFFFF'}}>
        <View style={{flex: 1, backgroundColor: '#FFFFFF', paddingBottom: 20, height: '100%'}}>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={{fontSize: 17}}>Check In</Text>
            { data5.checkin_img != undefined ? <Image
              
              source={{
                uri: data5.checkin_img,
              }}
              style={styles.photo}
            />: <Image
            
            source={require('../../assets/images/Rectangle.png')}
            style={styles.photo}
          />
}
          </View>

          <View style={styles.title}>
            <Text style={{fontSize: 17}}>Check Out</Text>
            { data5.checkout_img != undefined ? <Image
              
              source={{
                uri: data5.checkout_img,
              }}
              style={styles.photo}
            />: <Image
            
            source={require('../../assets/images/Rectangle.png')}
            style={styles.photo}
          />
}
          </View>
        </View>
        <Text style={{fontSize: 17, marginLeft: 10, fontWeight: 'bold',marginTop: 20}}>Chi tiết ngày làm việc</Text>
        
        <View 
          style={styles.block}>
            <View style={{marginLeft: 10, width: 40, height: 40,borderRadius: 40, backgroundColor: '#F9F9F9' ,alignItems: 'center',justifyContent: 'center'}}>
            <FontAwesomeIcon icon={faSignInAlt} size={20} />
            </View>
            <View style={styles.container_text}>
            <Text style={{fontSize: 17}}>{dataOne.type == 'CHECKIN' && 'Check in: ' +
                      moment(
                        dataOne.created,
                      ).format('HH:mm') + ' '}

                    {dataOne.request == 'XINNGHI' && <Text>Xin Nghỉ </Text>}

                    {dataOne.request == 'DENMUON' && <Text>Xin phép:{' '+moment(dataOne.datetime).format('HH:mm')+','} Đến Muộn </Text>}</Text>
    <Text style={{fontSize: 17}}>{dataOne.note == null ? ' ': 'Lý do: ' + dataOne.note} </Text>
            </View>         
        </View>

        <View 
          style={styles.block}>
            <View style={{marginLeft: 10, width: 40, height: 40,borderRadius: 40, backgroundColor: '#F9F9F9' ,alignItems: 'center',justifyContent: 'center'}}>
            <FontAwesomeIcon icon={faSignOut} size={20} />
            </View>
            <View style={styles.container_text}>
                      <Text style={{fontSize: 17}}>
                      {
                        dataTwo != undefined  && dataTwo.request == "VESOM" && (
                          <Text>Check Out: {moment(dataTwo.created).format('HH:mm')} ,Về Sớm</Text>
                        )
                      }
                      
                      {
                        dataTwo == undefined  &&  dataOne.request != 'XINNGHI' && (
                          <Text>Chưa Check Out</Text>
                        )
                      }
                      {
                        dataOne.request == 'XINNGHI'  && (
                        <Text>Xin Nghỉ</Text>
                        )
                      }

                      {
                        dataTwo != undefined  && dataTwo.request != "VESOM" && (
                        <Text>{'Check Out: ' +moment(
                          dataTwo.created,
                        ).format('HH:mm')}</Text>
                        )
                      }
                      </Text>
              <Text style={{fontSize: 17}}>
              {
                        dataTwo != undefined  && dataTwo.request == "VESOM" && (
                        <Text>{'Lý do: '+ dataTwo.note  }</Text>
                        )
                      }
                      
                      {
                        dataTwo == undefined  && (
                        <Text>{''}</Text>
                        )
                      }

                      {
                        dataTwo != undefined  && dataTwo.request != "VESOM" && (
                        <Text>{''}</Text>
                        )
                      }
              </Text>
            </View>         
        </View>
      </View>
     </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingRight: 5,
    paddingLeft: 5
  },
  container_text: {
    marginLeft: 20,
    flex: 1,
  },
  title: {
    flex: 1,
    alignItems: 'center',
    fontSize: 30,
    paddingLeft: 5,
    paddingRight: 5
  },
  photo: {
    height: undefined,
    width: '100%',
    marginTop: 5,
    aspectRatio: 1,
    borderRadius: 16
  },
  block: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 28,
    paddingRight: 10
  },
});
