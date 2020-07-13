import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import database from '@react-native-firebase/database';
import moment from 'moment';
import Loading from '../custom-components/Loading';
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
  Modal,
  TouchableHighlight,
  Button,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import auth from '@react-native-firebase/auth';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popup: false,
      dateStart: 'Từ ngày',
      dateEnd: 'Đến ngày',
      clickTouch: 1,
      dateFrom: '',
      dateTo: '',
      data1: [],
      dateMax: '',
      dataFirebase: '',
      count: 0,
      loading: true,
      loadMore: false,
      page : 1,
      count: 10,
      isRefreshing: false,
      show: 'none'
    };
  }

  componentDidMount() { 
    var userId = auth().currentUser.uid;
// get data firebase

// var recentPostsRef = firebase.database().ref('/store');
// recentPostsRef.once('value').then(snapshot => {
//   // snapshot.val() is the dictionary with all your keys/values from the '/store' path
//   this.setState({ stores: snapshot.val() })
// })


  var _this = this
  database()
  .ref('tbl_check_in')
  .child(userId)
  .child('history')
  .limitToFirst(this.state.count)
  .once('value')
  .then( snapshot => {
    console.log('User data: ', snapshot.val()); 
    if (snapshot.val() != undefined) {
      _this.setState({
        dataFirebase: snapshot.val(),
      }, () => {
        var parseArray = Object.values(
          this.state.dataFirebase
        ).sort(function(a, b) {
          return a.date - b.date;
        });
        // console.log(parseArray)
    
        var parseMore = parseArray.map((item, index) => {
          return {
            ...item,
            checkinlog: Object.values(item.checkinlog).sort(function(a, b) {
              return a.created - b.created;
            }),
          };
        });
        // console.log(parseMore)
        this.setState({data1: parseMore,loading: false});
      });
    }else {
      this.setState({loading: false, show: 'flex'})
      return <Text>Lgc</Text>
    }
    
  })
  .catch(error => {
    this.setState({loading: false})
    return <Text>Lgc</Text>
} )
 
  // remove data
   database()
  .ref('tbl_user')
  .child('FnK6iW9uAxbCvs8hwdccvBcs6xy1') 
  .remove();

  // // push data
  // const pushData = database()
  // .ref('tbl_check_in')
  // .child('ykdrK0q9S0OgxOcRnAK4QSQF67q2')
  // .child('history')
  // .push();

  // pushData
  // .set({
  //     "date": 1591844700000,
  //     "checkin_img": "https://placeimg.com/140/140/any",
  //     "checkout_img": "https://placeimg.com/140/140/any",
  //     "checkinlog": [
  //       {
  //         "created": 1591669800000,
  //         "type": "XINPHEP",
  //         "request": "XINNGHI",
  //         "note": "Xin nghỉ phép ngày 27/05/2020 vào lúc 8h50",
  //         "datetime": 1591669800000 
  //       },
  //     ]
  // })
  // .then(() => console.log('Data updated.'));


  // // update 
  // database()
  // .ref('tbl_check_in')
  // .child('ykdrK0q9S0OgxOcRnAK4QSQF67q2')
  // .child('history')
  // .child('-M9WcD4OBFPdCUEENfHK')
  // .update({
    
  //         "date": 1592179200000,
  //         "checkin_img": "https://placeimg.com/140/140/any",
  //         "checkout_img": "https://placeimg.com/140/140/any",
  //         "checkinlog": [
            
          
  //          {
  //             "created": 1591842800000,
  //             "datetime": 1591840800000,
  //             "image": "https://placeimg.com/140/140/any",
  //             "type": "CHECKIN"
  //           },
  //           {
	// 						"created": 1591845800000,
	// 						"image": "https://placeimg.com/140/140/any",
	// 						"type": "CHECKOUT",
	// 						"request": "VESOM",
	// 						"note": "Xin về sớm và check out lúc 17h00",
	// 						"datetime": 1591845800000
	// 					}
  //         ]
      
  // })
  // .then(() => console.log('Data updated.'));


    // var parseArray = Object.values(
    //   this.state.dataFirebase
    // ).sort(function(a, b) {
    //   return a.date - b.date;
    // });
    // // console.log(parseArray)

    // var parseMore = parseArray.map((item, index) => {
    //   return {
    //     ...item,
    //     checkinlog: Object.values(item.checkinlog).sort(function(a, b) {
    //       return a.date - b.date;
    //     }),
    //   };
    // });

    // this.setState({data1: parseMore}); 
  
  }

  _handleLoadMore = () => {
    this.setState({loadMore: true});
    this.state.page = this.state.page + 1; 
    setTimeout(() => {
      var _this = this
      var idU = auth().currentUser.uid;
    database()
    .ref('tbl_check_in')
    .child(idU)
    .child('history')
    .limitToFirst(this.state.count + 7) 
    .once('value')
    .then( snapshot => {
      if(snapshot.val() != undefined){
        _this.setState({
          dataFirebase: snapshot.val(),
        }, () => {
          var parseArray5 = Object.values(
            this.state.dataFirebase
          ).sort(function(a, b) {
            return a.date - b.date;
          });
          // console.log(parseArray) 
      
          var parseMore5 = parseArray5.map((item, index) => {
            return {
              ...item,
              checkinlog: Object.values(item.checkinlog).sort(function(a, b) {
                return a.created - b.created;
              }),
            };
          });
          // console.log(parseMore)
          this.setState({data1: parseMore5,loadMore: false});
        });
      }else {
        alert('lgc')
      }
      
    })
    }, 50); 
}

onRefresh = () => {
  this.setState({ isRefreshing: true});
  var _this = this
  var idu = auth().currentUser.uid;
  database()
  .ref('tbl_check_in')
  .child(idu)
  .child('history')
  .limitToFirst(7)
  .once('value').then( snapshot => {
    // console.log('User data: ', snapshot.val());
    if (snapshot.val() != undefined){
      _this.setState({
        dataFirebase: snapshot.val(),
      }, () => {
        var parseArray9 = Object.values(
          this.state.dataFirebase
        ).sort(function(a, b) {
          return a.date - b.date;
        });
        // console.log(parseArray)
    
        var parseMore9 = parseArray9.map((item, index) => {
          return {
            ...item,
            checkinlog: Object.values(item.checkinlog).sort(function(a, b) {
              return a.created - b.created;
            }),
          };
        });         
        this.setState({data1: parseMore9, isRefreshing: false});
      });
    }else {
      this.setState({ isRefreshing: false});
    }
    
  }) 
  
}

_renderFooter = () => {
   if (!this.state.loadMore) return null;  
   return (
    <ActivityIndicator
        style={{ color: '#000' }}
      />
   );
 };

  static navigationOptions = ({route}) => {
    return {
      headerTitle: 'Lịch sử ',
      headerTitleStyle: {
        fontSize: 20,
        textAlign: 'center',
      },
    };
  };


  render() {
    if (this.state.loading) {
      return (
          <Loading />
      )
  }
    // console.log(this.state.dataFirebase)
    var parseArray2 = Object.values(
      this.state.dataFirebase
    ).sort(function(a, b) {
      return a.date - b.date;
    });
    // console.log(parseArray2)

    var parseMore2 = parseArray2.map(item => {
      return {
        ...item,
        checkinlog: Object.values(item.checkinlog).sort(function(a, b) {
          return a.created - b.created;
        }),
      };
    });
    // console.log(parseMore2);
    // console.log(parseMore2[0].checkinlog[0].type);

    // get type # checkout
    // var filterOne = parseMore2.map(item => {
    //   var abc = item.checkinlog;
    //   // console.log(abc)
    //   var def = abc.filter(x => x.type != 'CHECKOUT'); 
    //   return def;
    // });
    // console.log(filterOne);
    var filterTwo = parseMore2.map(item => {
      var abc = item.checkinlog;
      // console.log(abc)
      var def = abc.filter(x => x.type != 'CHECKOUT' && x.request == 'XINNGHI');
      return def;
    });
    // console.log(filterTwo);

    // // getMaxDate
    // var getMaxDate = filterTwo.map(item => {
    //   return item[item.length - 1];
    // });
    // console.log(getMaxDate);

    // convert date time
    // var t = new Date(data.tbl_check_in.ykdrK0q9S0OgxOcRnAK4QSQF67q2.history.date);
    // var formatted = moment(t).format('DD-MM-YYYY');
    // var time = moment(t).format('HH:mm:ss');

    return (
      <View style={styles.container}>
        <View style={styles.touch}>
          <TouchableOpacity
            style={styles.touchopacity}
            onPress={() => {
              this.setState({popup: true, clickTouch: 1});
            }}>
            <Text style={{color: '#999999', fontSize: 17}}>
              {this.state.dateStart}
            </Text>
            <Image
              style={{width: 14, height: 12}}
              source={require('../../assets/images/stick.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchopacity}
            onPress={() => {
              this.setState({popup: true, clickTouch: 2});
            }}>
            <Text style={{color: '#999999', fontSize: 17}}>
              {this.state.dateEnd}
            </Text>
            <Image
              style={{width: 14, height: 12}}
              source={require('../../assets/images/stick.png')}
            />
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={this.state.popup}
          mode="date"
          dataPickerModeAndroid="calendar"
          value={new Date(2019, 4, 15)}
          onConfirm={date => {
            this.setState({popup: false});
            var a = moment(date).unix() * 1000;
            console.log(a);
            var d= (moment().unix()*1000)
            if (this.state.clickTouch == 1) {
              if (a >= d) {
                 Alert.alert(
                  'Thông báo',
                  'Ngày bắt đầu phải nhỏ hơn ngày hiện tại', 
                  [{text: 'OK', onPress: () => {}}],
                  {cancelable: false},
                );
              }
              this.setState(
                {
                  dateStart: moment(date).format('DD-MM-YYYY'), 
                  // dateStart: moment(date).unix(),
                  data1: parseMore2, //gan lai gia tri cho chinh no thi k dung this.state
                  dateFrom: a,
                  // data1: this.state.dateTo != '' ? parseMore2.filter(x =>  this.state.dateTo >= x.date >= a): parseMore2.filter(x =>  x.date >= a)
                  // date.getDate() +
                  // '-' +
                  // date.getMonth() +
                  // '-' +
                  // date.getFullYear(),
                },
                () => {
                  // console.log(this.state.dateFrom);
                  this.setState({
                    data1:
                      this.state.dateTo != ''
                        ? parseMore2.filter(
                            x =>
                              this.state.dateTo >= x.date &&
                              x.date >= this.state.dateFrom,
                          )
                        : parseMore2.filter(x => x.date >= this.state.dateFrom),
                  });
                },
              );
              // console.log(parseMore2)
              // console.log(this.state.dateFrom)
              // console.log(this.state.data1)
              // console.log(this.state.dateTo)
            } else {
              var b = moment(date).unix() * 1000;
              if (b < this.state.dateFrom) {
                 Alert.alert(
                  'Thông báo',
                  'Ngày kết thúc phải lớn hơn ngày bắt đầu',
                  [{text: 'OK', onPress: () => {}}],
                  {cancelable: false},
                );
              }
              // console.log(b);
              this.setState(
                {
                  dateEnd: moment(date).format('DD-MM-YYYY'),
                  // data1: parseMore2,
                  dateTo: b,
                  // data1: parseMore2.filter(x =>  b >= x.date >= this.state.dateFrom)
                  // date.getDate() +
                  // '-' +
                  // date.getMonth() +
                  // '-' +
                  // date.getFullYear(),
                },
                () => {
                  // console.log('111')
                  // console.log(this.state.dateFrom)
                  // console.log(this.state.dateTo)
                  this.setState({
                    data1: parseMore2.filter(
                      x =>
                        this.state.dateFrom <= x.date && 
                        x.date <= this.state.dateTo,
                    ),
                  });
                },
              );
              // console.log('vvvvvvvvvv')
              // console.log(this.state.data1)
            }
          }}
          onCancel={() => {
            this.setState({popup: false});
          }}
          timeZone
          OffersetInMinutes={0}
        />
        <Text style={{ display: this.state.show, marginTop: 50, textAlign: 'center',fontSize: 17,color: '#999999'}}>Chưa có dữ liệu</Text>

        <FlatList
          data={this.state.data1} 
          onMomentumScrollEnd={() => {
            // if (this.state.loading == true) {
                this._handleLoadMore();
            // }
            }}
            ListFooterComponent={() => this._renderFooter()}
            
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => {this.onRefresh()}}
              />
            }
          renderItem={({item, index}) => {
            var filOne = item.checkinlog.filter(x => x.type != 'CHECKOUT')[
              item.checkinlog.filter(x => x.type != 'CHECKOUT').length -
                1
            ]

            var filTwo = item.checkinlog.filter(x => x.type == 'CHECKOUT')[
              item.checkinlog.filter(x => x.type == 'CHECKOUT').length -
                1
            ]

            return (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('History_detail', {data4: item})}
                style={styles.block}>
                <Image
                  source={require('../../assets/images/history.png')}
                  style={styles.photo}
                />
                <View style={styles.container_text}>
                  <Text style={styles.title}>
                    Ngày {moment(item.date).format('DD-MM-YYYY')}
                  </Text>
                  <Text style={styles.time}>  

                    In:{' '} 
                    {filOne.type == 'CHECKIN' &&
                      moment(
                        filOne.created,
                      ).format('HH:mm') + ' '}

                    {filOne.request == 'XINNGHI' && <Text>Xin Nghỉ </Text>} 

                    {filOne.request == 'DENMUON' && <Text>{moment(filOne.datetime).format('HH:mm')}, Đến muộn </Text>}
                     
                    - Out: {
                        filTwo != undefined  && filTwo.request == "VESOM" && (
                        <Text>{moment(filTwo.datetime).format('HH:mm')}, Về sớm</Text>
                        )
                      }
                      
                      {
                        filTwo == undefined  && filOne.request != 'XINNGHI' &&(
                        <Text>Chưa Check Out</Text>
                        )
                      }
                      {
                        filOne.request == 'XINNGHI'  && (
                        <Text>Xin Nghỉ</Text>
                        )
                      }

                      {
                        filTwo != undefined  && filTwo.request != "VESOM" && (
                        <Text>{moment(filTwo.created).format('HH:mm')}</Text>
                        )
                      }
                  </Text>

                  <Text
                    style={{
                      borderBottomColor: '#F2F2F7',
                      borderBottomWidth: 1,
                    }}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingLeft: 16,
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    // paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  block: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    color: '#000',
  },
  time: {
    fontSize: 13,
    color: '#999999',
  },
  container_text: {
    flexDirection: 'column',
    marginLeft: 14,
    flex: 1,
    marginTop: 15,
  },
  photo: {
    height: 40,
    width: 40,
    // marginLeft: 16,
  },
  touchopacity: {
    height: 50,
    width: '48%',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
  },
});
