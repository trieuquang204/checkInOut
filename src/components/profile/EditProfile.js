import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	Picker,
	Button,
	TouchableOpacity,
	Keyboard,
	TouchableWithoutFeedback,
	ScrollView,
} from 'react-native';
import ModalExample from './ModalExample';
// import DatepickerExample from './DatepickerExample'
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-community/async-storage';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Loader from '../checkin/Loader';

import Profile from './Profile';

export default class EditProfile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			language: 'java',
			fatherValue: ' ',
			gender: undefined,
			popupdatepicker: false,
			data: this.props.route.params.mySendData,
			buttonTitle: this.props.route.params.mySendData.dateofbirth,
			textInputSDT: '',
			selectedLabel: 0,
			identification_card: '',
			modalVisiable: false,
			showPicker: true,
			lableProfile: '',
			valueInput: this.props.route.params.mySendData.gender.toString()
		};
	}

	_storeData = async () => {
		try {
			await AsyncStorage.setItem(
				'Profile',
				JSON.stringify(MyData.tbl_user.auth().currentUser.uid),
			);
		} catch (error) {
			// Error saving data
		}
	};

	handler(_gender) {
		this.setState({
			data: { ...this.state.data, gender: _gender },
		});
	}

	static navigationOptions = ({ route }) => {
		return {
			headerTitle: 'Chỉnh sửa thông tin',
			headerBackTitle: ' ',
		};
	};

	UpdateFireBase = () => {
		this.setState({ modalVisiable: true });
		const currId = auth().currentUser.uid;
		database()
			.ref('tbl_user/' + currId)
			.update({
				dateofbirth: this.state.data.dateofbirth,
				fullname: this.state.data.fullname,
				gender: parseInt(this.state.valueInput),
				identification_card: this.state.identification_card,
				mobile: this.state.data.mobile,
			})
			.then(() => {
				this.setState({ modalVisiable: false });
				// alert('Update thành công');
				this.props.navigation.navigate('Profile')
			})
			.catch(erro => {
				this.setState({ modalVisiable: false });
				alert(erro);
			});
	};

	render() {
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
					<View>
						<Loader loading={this.state.modalVisiable} />
					</View>

					<View style={{ marginTop: 8 }}>
						<Text style={styles.text}>Họ và tên</Text>
						<View style={styles.textAreaContainer}>
							<TextInput
								style={styles.textArea}
								underlineColorAndroid="transparent"
								defaultValue={this.state.data.fullname}
								// defaultValue="{this.mySendData.fullname}"
								placeholder="Nhập họ và tên"
								placeholderTextColor="#E0E0E0"
								onChangeText={text =>
									this.setState({
										data: { ...this.state.data, fullname: text },
									})
								}
							/>
						</View>
						<Text style={styles.text}>Số CMND/CCCD/Passport</Text>
						<View style={styles.textAreaContainer}>
							<TextInput
								keyboardType="numeric"
								style={styles.textArea}
								underlineColorAndroid="transparent"
								placeholder="Nhập số CMND/CCCD/Passport"
								placeholderTextColor="#E0E0E0"
								onChangeText={identification_card =>
									this.setState({ identification_card })
								}
								defaultValue={ this.props.route.params.mySendData.identification_card}
							/>
						</View>
						<Text style={styles.text}>Giới tính</Text>

						<View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
							<View
								style={{
									position: 'relative',
									borderWidth: 1,
									borderColor: '#E0E0E0',
									borderRadius: 4,
									height: 40,
									alignItems: 'center',
									justifyContent: 'center',
									paddingLeft: 15,
								}}>

								<RNPickerSelect
									
									value={this.state.valueInput }
									placeholderTextColor="black"
									style={{ ...pickerSelectStyles }}
									onValueChange={value => {
										this.setState({ valueInput: value });
									}}
									items={[
										{ label: 'Nam', value: '1' },
										{ label: 'Nữ', value: '0' },
										{ label: 'Khác', value: '2' },
									]}
								/>
							</View>
						</View>

						<Text style={styles.text}>Ngày sinh</Text>
						<View style={styles.textAreaContainer}>
							<TouchableOpacity
								style={styles.button}
								onPress={() => {
									this.setState({ popupdatepicker: true });
								}}>
								<Text style={{ fontSize: 17 }}>
									{this.state.data.dateofbirth}
								</Text>
							</TouchableOpacity>
							<DateTimePickerModal
								isVisible={this.state.popupdatepicker}
								mode="date"
								// defaultValue={new Date(this.state.data.dateofbirth)}
								onConfirm={date => {
									this.setState({
										popupdatepicker: false,
										buttonTitle:
											date.getUTCDate() +
											'/' +
											parseInt(date.getMonth() + 1) +
											'/' +
											date.getFullYear(),
										data: {
											...this.state.data,
											dateofbirth:
												date.getUTCDate() +
												'/' +
												parseInt(date.getMonth() + 1) +
												'/' +
												date.getFullYear(),
										},
									});
								}}
								onCancel={() => {
									this.setState({ popupdatepicker: false });
								}}
								timeZone
								OffersetInMinutes={0}
							/>
						</View>
						<Text style={styles.text}>Số điện thoại</Text>
						<View style={styles.textAreaContainer}>
							<TextInput
								style={styles.textArea}
								keyboardType="phone-pad"
								defaultValue={this.state.data.mobile}
								onChangeText={text =>
									this.setState({
										data: { ...this.state.data, mobile: text },
									})
								}
								underlineColorAndroid="transparent"
								placeholder="Nhập số điện thoại"
								placeholderTextColor="#E0E0E0"
							/>
						</View>
						<TouchableOpacity style={styles.btn} onPress={this.UpdateFireBase}>
							<Text style={{ fontSize: 17 }}>Lưu lại</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		);
	}
}
const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		height: 40,
		fontSize: 17,
		
	},
	inputAndroid: {
		height: 40,
		fontSize: 17,
		
	},
});
const styles = StyleSheet.create({
	text: {
		fontSize: 16,
		color: '#000000',
		marginLeft: 18,
		marginTop: 16,
	},
	button: {
		alignItems: 'flex-start',
		backgroundColor: '#FFF',
		padding: 10,
		fontSize: 17,
		borderRadius: 4,
	},
	textAreaContainer: {
		borderColor: '#E0E0E0',
		// height: 40,
		borderWidth: 1,
		// padding: 5,
		marginTop: 8,
		marginLeft: 16,
		marginRight: 16,
		borderRadius: 4,
	},

	textModalGioiTinh: {
		borderColor: '#E0E0E0',
		// flex: 1,
		// flexDirection:'row',
		justifyContent: 'space-between',
		// justifyContent: 'flex-start'
		alignItems: 'center',
		height: 40,
		width: 140,
		borderWidth: 1,
		// padding: 5,
		marginTop: 8,
		marginLeft: 16,
		// marginRight: 16,
		borderRadius: 4,
	},
	btn: {
		marginLeft: 80,
		marginRight: 80,
		justifyContent: 'center',
		alignItems: 'center',
		height: 47,
		marginTop: 32,
		marginBottom: 32,
		// flex: 1,
		// width: 40,
		borderRadius: 23,
		backgroundColor: '#F2F2F7',
	},
	textArea: {
		height: 40,
		marginLeft: 10,
		marginRight: 10,
		justifyContent: 'flex-start',
		fontSize: 17,
	},
	container: {
		flex: 1,
		paddingTop: 40,
		alignItems: 'center',
	},
});
