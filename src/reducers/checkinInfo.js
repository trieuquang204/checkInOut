import {XAC_NHAN_CHECK_IN} from '../constants'

const infoCheckIn = {
  info: {
    urlLocal: '',
    urlOnline: '',
    base64Image: '',
  },
};

const checkinInfo = (state = infoCheckIn, action)=> {
    switch (action.type){
        case XAC_NHAN_CHECK_IN : {
            console.log('----------------- XAC_NHAN_CHECK_IN CLICK   ' + action.urlLocal)
            return {
                info:{
                urlLocal: action.urlLocal,
                urlOnline: action.urlOnline,
                base64Image: action.base64Image 
                }
            }         
            
        }
        default: return state
    }
} 
export default checkinInfo; 