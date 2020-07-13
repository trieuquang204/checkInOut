import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, StyleSheet, TouchableOpacity} from 'react-native';
// import {Picker} from '@react-native-community/picker'
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';

export default class ModalExample extends Component {
  state = {
    modalVisible: false,
    gender: 'Nam',
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

//   componentWillReceiveProps(props) {
//     this.setState({ gender: props.fatherValue })
//   }

  render() {
    return (
        // <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)'}}>
        <View style={styles.centeredView2}>
        <Modal
          animationType="slide"
          // presentationStyle='fullScreen'
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Chọn giới tính</Text>    
              {/* <Picker
                accessibilityLabel={'gender'}
                selectedValue={this.state.gender}
                style={{height: 200, width: 100, backgroundColor: 'white', paddingBottom: 0}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({gender: itemValue})
                }>
                <Picker.Item label="Nam" value="Nam" />
                <Picker.Item label="Nữ" value="Nữ" />
                <Picker.Item label="Khác" value="Khác" />
              </Picker> */}

  
              <TouchableOpacity
                style={styles.openButton}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  switch(this.state.gender) {
                    case "Nam":
                      this.props.handler('1');
                      break;
                    case "Nữ":
                      this.props.handler('2');
                      break;
                    case "Khác":
                      this.props.handler('3');
                      break;
                    default :
                      this.props.handler('1');
                      break;

                  }
                  // this.props.handler(this.state.gender);
                }}
              >
                <Text style={styles.textStyle}>Done</Text>  
              </TouchableOpacity>
            </View>
            
          </View>
        </Modal>
  
        <TouchableOpacity
          style={styles.openModal}
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text style={{fontSize:17}}>{this.state.gender}</Text>
          <FontAwesomeIcon icon={ faAngleDown } size={17} style={{color:'#000000'}} />
        </TouchableOpacity>
      {/* </View>  */}
      </View>
    );
  }
}

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
    },
    centeredView2: {
      width: '100%',
      height: '100%',
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 10
    },
    openButton: {
      backgroundColor: "#2196F3",
      borderRadius: 20,
      padding: 10,
      width: 90,
      elevation: 2
    },
    openModal: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // backgroundColor: "#F194FF",
      borderRadius: 4,
      padding: 10,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      fontSize: 17,
      textAlign: "center"
    }
  });
  