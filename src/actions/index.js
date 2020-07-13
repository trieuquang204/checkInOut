import { CHECK_IN, CHECK_OUT, XAC_NHAN_CHECK_IN } from '../constants'

export const checkIn = () => ({
    type: CHECK_IN
})

export const checkOut = () => ({
    type: CHECK_OUT
})
export const xacNhanCheckIn = (_urlLocal, _urlOnline,_base64Image) => ({
    type: XAC_NHAN_CHECK_IN,
    urlLocal: _urlLocal,
    urlOnline: _urlOnline,
    base64Image: _base64Image
})