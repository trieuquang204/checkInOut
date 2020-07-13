import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Modal,
    ActivityIndicator
  } from 'react-native';    

export default class Loader extends Component {
    render() {
        return (
            <Modal
              transparent={true}
              animationType={'none'}
              visible={this.props.loading}
              onRequestClose={() => {console.log('close modal')}}>
              <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                  <ActivityIndicator
                    size = "large"
                    animating={true} />
                </View>
              </View>
            </Modal>
          )
        
        
        
    }
}
const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
      backgroundColor: '#FFFFFF',
      height: 80,
      width: 80,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
    }
  });
