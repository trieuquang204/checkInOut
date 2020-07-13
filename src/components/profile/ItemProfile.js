import * as React from 'react'
import {View,StyleSheet,Text} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const ItemProfile = ({image, title, value}) => {
    
    return (
        <View>
            <View style={styles.view}>
                <View style={styles.icon}><FontAwesomeIcon icon={ image } size={17} style={{color:'#000000'}} /></View>
                <Text style={{fontSize: 17, marginLeft: 14}}>{title}: {value}</Text>
            </View>
            <View style={styles.viewBottom}></View>
        </View>
    );
}
//
export default ItemProfile; 

const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 64,
    },
    icon: {
        marginLeft:16,
        justifyContent:'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#F9F9F9',
    },
    viewBottom: {
        marginBottom:0,
        height:1,
        backgroundColor:'#F2F2F7',
        marginLeft: 70,
    }
})