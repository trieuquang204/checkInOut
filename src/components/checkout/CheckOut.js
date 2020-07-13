

import React, { Component } from 'react';
import { faCameraAlt } from '@fortawesome/pro-light-svg-icons';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Button,
	TouchableOpacity,
	Alert,
	ImageBackground,
	Linking
} from 'react-native';
import { ActionSheet, Root } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../checkin/Loader';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const currentTime = new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear();
const dateNow = Date.parse(new Date());



export default class CheckOut extends Component {

	constructor(props) {
		super(props);
		this.image = require('../../assets/images/upload_img.png');


		this.state = {
			urlUpdate: this.image,
			UpdateText: 'Xin phép',
			UpdateBase: '',
			modalVisiable: false,
		};

		this.navigation = this.props.navigation;
	}

	onSelectedImage = (image) => {
		const source = { uri: image.path };
		let item = {
			id: Date.now(),
			url: source,
			content: image.data,
		}
		this.setState({ urlUpdate: source })
		this.setState({ UpdateText: 'Xác nhận ra về' })
		this.setState({ UpdateBase: item.content })
	}

	takePhotoFromCamera = () => {
		this.requestCameraPermission();
	}

	requestCameraPermission = async () => {
		try {
		  const granted = await request(
			Platform.select({
			  android: PERMISSIONS.ANDROID.CAMERA,
			  ios: PERMISSIONS.IOS.CAMERA,
			}),
		  );
		  if (granted === RESULTS.GRANTED) {
			this.requestWritePermission();
		  }
		  if (granted === RESULTS.BLOCKED) {
			Alert.alert(
			  'Quyền đã bị từ chối',
			  Platform.select({
				android: 'Truy cập Setting để mở quyền Camera và Storage',
				ios: 'Truy cập Setting để mở quyền Camera và Photo',
			  }),
			  [
				{
				  text: 'Cancel',
				  onPress: () => console.log('Cancel Pressed'),
				  style: 'cancel',
				},
				{text: 'OK', onPress: () => Linking.openSettings()},
			  ], 
			  {cancelable : false},
			);
		  } else {
			console.log('Camera permission denied');
		  }
		  console.log('--------------- ' + granted);
		} catch (err) {
		  console.warn(err);
		}
	  };
	  
	  requestWritePermission = async () => {
		try {
		  const granted = await request(
			Platform.select({
			  android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
			  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
			}),
		  );
		  if (granted === RESULTS.GRANTED) {
			ImagePicker.openCamera({
				width: 300,
				height: 400,
				includeBase64: true,
				cropping: false,
			}).then(image => {
				this.onSelectedImage(image);
			});
		  }
		  if (granted === RESULTS.BLOCKED) {
			Alert.alert(
			  'Quyền đã bị từ chối',
			  Platform.select({
				android: 'Truy cập Setting để mở quyền Camera và Storage',
				ios: 'Truy cập Setting để mở quyền Camera và Photo',
			  }),
			  [
				{
				  text: 'Cancel',
				  onPress: () => console.log('Cancel Pressed'),
				  style: 'cancel',
				},
				{text: 'OK', onPress: () => Linking.openSettings()},
			  ], 
			  {cancelable : false},
			);
		  } else {
			console.log('Write permission denied');
		  }
		} catch (err) {
		  console.warn(err);
		}
	  };
	  

	onClickAddImage = () => {
		const BUTTONS = ['Take Photo', 'Cancel'];
		ActionSheet.show(
			{
				options: BUTTONS,
				cancelButtonIndex: 2,
				title: ''
			},
			buttonIndex => {
				switch (buttonIndex) {
					case 0:
						this.takePhotoFromCamera();
						break;

					default:
						break
				}
			}
		)
	}

	static navigationOptions = ({ route }) => {
		var date = new Date();
		return {
			headerTitle:
				'Check Out ngày ' +
				date.getDate() +
				'/' +
				(date.getMonth() + 1) +
				'/' +
				date.getFullYear(),
			headerTitleStyle: {
				fontSize: 17,
				textAlign: 'center',
			},
		};
	};

	_showDialog = visiable => {
		this.setState({
			modalVisiable: visiable
		})
	}


	changeState = () => {
		this.setState({ modalVisiable: true });

	}
	render() {
		let { fileList } = this.state;
		return (
			<Root>
				<ImageBackground
					source={require('../../assets/images/bg_patern.png')}
					style={styles.stylebackgroundimage}>

					<View>
						<Loader loading={this.state.modalVisiable} />
					</View>

					<View style={styles.stylecontainerTop}>
						<TouchableOpacity onPress={this.onClickAddImage}>
							<Image
								style={styles.stylecamera}
								source={this.state.urlUpdate}
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.stylecontainerBottom}>
						<TouchableOpacity>
							<Text style={styles.styletexttitle}>Chụp ảnh để Check Out</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[(this.state.UpdateText === 'Xin phép') ? styles.stylebtnxinphep : styles.stylebtnxinphepOut]}
							onPress={() => {
								if (this.state.UpdateText === 'Xin phép') {
									this.props.navigation.navigate('OffRequest')
								}
								else if (this.state.UpdateText === 'Xác nhận ra về') {
									handleUploadPhoto(this.state.UpdateBase, this);
									this.changeState();
								}
							}}
						>
							<Text
								style={[(this.state.UpdateText === 'Xin phép') ? { color: '#000', fontWeight: 'bold' } : { color: '#fff', fontWeight: 'bold' }]}
							>
								{this.state.UpdateText}
							</Text>
						</TouchableOpacity>
					</View>
				</ImageBackground>
			</Root>
		);
	}
}

const urlUpload = "https://api.imgur.com/3/upload"
const handleUploadPhoto = (bodybase64, _this) => {
	fetch(urlUpload, {
		method: "POST",
		body: bodybase64,
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: 'Client-ID 4a171f329d4595b'
		}
	})
		.then(response => response.json())
		.then(response => {
			// console.log("upload succes", response.data.link);
			_this.setState({ modalVisiable: false });
			const userId = auth().currentUser.uid;
			database().ref('tbl_check_in/' + userId).child("history").orderByChild("date")
				.once('value')
				.then(snapshot => {
					// console.log('User data: ', snapshot.val());
					var getOb = Object.values(snapshot.val());
					var getObId = Object.keys(snapshot.val());
					var lastDate = new Date().getDate(getOb[0].date) + '-' + new Date(getOb[0].date).getMonth() + '-' + new Date().getFullYear(getOb[0].date);

					// console.log( 'fff',getObId[0] );
					 var realTime = new Date().getTime();
					if (currentTime === lastDate) {
						var newPostRef = database().ref('tbl_check_in/' + userId + '/history/' + getObId[0] + '/checkinlog').push();
						newPostRef.set({
							created: realTime,
							datetime: realTime,
							image: response.data.link,
							type: "CHECKOUT",
						}).then( () => {
							database().ref('tbl_check_in/' + userId + '/history/' + getObId[0]).update({
								checkout_img: response.data.link,
							}).then( () => {
								database().ref('tbl_check_in/' + userId + '/history/' + getObId[0]).once('value')
								.then(snapshot => {
									// alert('Hello');
									let dataLog = snapshot.val();
									let listLog = Object.values(dataLog.checkinlog);
									dataLog = {...dataLog, checkinlog: listLog};
									console.log(dataLog);
									_this.props.navigation.reset({
										index: 0,        
										routes: [{name: 'History_detail', params: {data4: dataLog}}],        
									});
								});
							}) ;
						});
					}
				})

			// alert("Upload success!");
			
		})
		.catch(error => {
			console.log("upload error", error);
			alert("Upload failed!");
		});
};

const styles = StyleSheet.create({
	stylecontainerTop: {
		width: '100%',
		height: '56%',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '16%',
	},
	stylecontainerBottom: {
		flexDirection: "column",
		alignItems: 'center',
		width: '100%',
		height: '54%',
	},
	stylebackgroundimage: {
		backgroundColor: '#FFFFFF',
		flex: 1,
		flexDirection: 'column',
	},
	stylecamera: {
		width: 160,
		height: 160,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#D1D1D6',
	},
	styletexttitle: {
		fontSize: 17,
		color: '#000000',
	},
	stylebtnxinphep: {
		width: '57%',
		height: 47,
		borderRadius: 23.5,
		alignItems: 'center',
		justifyContent: 'center',
		position: "absolute",
		top: '30%',
		backgroundColor: '#F2F2F7',
	},
	stylebtnxinphepOut: {
		width: '57%',
		height: 47,
		borderRadius: 23.5,
		alignItems: 'center',
		justifyContent: 'center',
		position: "absolute",
		top: '30%',
		backgroundColor: '#0091FF',
	},
	styletextxinphep: {
		fontWeight: '600',
		fontSize: 17,
		color: '#000',
		fontWeight: 'bold'
	},

});
