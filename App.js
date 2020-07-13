/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';

// Redux Imports
import { Provider } from 'react-redux';
import store from './src/store';

// Import FontAwesome Icon
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCheck, faHistory, faUserCircle, faAcorn } from '@fortawesome/pro-regular-svg-icons';

// Import Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Firebase Authentication
import auth from '@react-native-firebase/auth';

// Import Screens
// 1. Login Screens
import Login from './src/components/authentication/Login';

// 2. CheckIn Screens
import checkinStack from './src/containers/checkin/CheckInNavigation';

import CheckIn from './src/components/checkin/CheckIn';
// Screen TakePicture"
import TakePicture from './src/components/checkin/TakePicture';
// Screen ImageSelected"
import ImageSelected from './src/components/checkin/ImageSelected';
import CheckOut from './src/components/checkout/CheckOut';
import Checked from './src/components/checkin/Checked';


import OffRequest from './src/components/checkin/OffRequest';

// 3. History Screens
import History from './src/components/history/History';
import History_detail from './src/components/history/History_detail';

// 4. Profile Screens
import Profile from './src/components/profile/Profile';
import EditProfile from './src/components/profile/EditProfile';

const Stack = createStackNavigator();

// function checkinStack() {
// 	return (
// 		<Stack.Navigator>
// 			<Stack.Screen
// 				name="CheckIn"
// 				component={CheckIn}
// 				options={CheckIn.navigationOptions}
// 			/>
// 			<Stack.Screen
// 				name="TakePicture"
// 				component={TakePicture}
// 				options={TakePicture.navigationOptions}
// 			/>
// 			<Stack.Screen
// 				name="ImageSelected"
// 				component={ImageSelected}
// 				options={ImageSelected.navigationOptions}
// 			/>
// 			<Stack.Screen
// 				name="CheckOut"
// 				component={CheckOut}
// 				options={CheckOut.navigationOptions} />
// 			<Stack.Screen
// 				name="OffRequest"
// 				component={OffRequest}
// 				options={OffRequest.navigationOptions} />
// 			<Stack.Screen
// 				name="Checked"
// 				component={Checked}
// 				options={Checked.navigationOptions} />
// 		</Stack.Navigator>
// 	);
// }

function historyStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="History"
				component={History}
				options={History.navigationOptions} />
			<Stack.Screen
				name="History_detail"
				component={History_detail}
				options={History_detail.navigationOptions} />
		</Stack.Navigator>
	)
}

function profileStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Profile"
				component={Profile}
				options={Profile.navigationOptions} />
			<Stack.Screen
				name="EditProfile"
				component={EditProfile}
				options={{ headerTitle: 'Chỉnh sửa thông tin', headerBackTitle: ' ' }} />
		</Stack.Navigator>
	)
}

const Tab = createBottomTabNavigator();

function App() {
	// Set an initializing state whilst Firebase connects
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState();

	// Handle user state changes
	function onAuthStateChanged(user) {
		setUser(user);
		if (initializing) setInitializing(false);
	}

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	if (initializing) return null;

	if (!user) {
		return (
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="Login"
						component={Login}
						options={{
							headerShown: false
						}} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

	return (
		<Provider store={store}>
			<NavigationContainer>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							switch (route.name) {
								case 'Home':
									iconName = faUserCheck;
									break;
								case 'History':
									iconName = faHistory;
									break;
								case 'Profile':
									iconName = faUserCircle;
									break;
								default:
									iconName = faAcorn;
							}

							return <FontAwesomeIcon icon={iconName} size={22} style={{ color: focused ? '#0091FF' : '#D1D1D6' }} />;
						},
					})}
					tabBarOptions={{
						activeTintColor: '#0091FF',
						inactiveTintColor: '#D1D1D6',
						// keyboardHidesTabBar: true,
						// style: { position: 'absolute' }
					}}
					options={{
						initialRouteName: 'Home'
					}}
				>
					<Tab.Screen
						name="Home"
						component={checkinStack}
						options={{
							tabBarLabel: 'Trang chủ'
						}}

						// name="CheckOut"
						// component={CheckOut}
						// options={{
						// 	tabBarLabel: 'CheckOut'
						// }}

						// initialParams={{store}} 

						// name="OffRequest"
						// component={OffRequestStack}
						// options={{
						// 	tabBarLabel: 'Xin phép'
						// }}
						// initialParams={{store}} 
						/>


						{/* initialParams={{ store }} */}

					{/* // name="OffRequest"
					// component={OffRequestStack}
					// options={{
					// 	tabBarLabel: 'Xin phép'
					// }}
					// initialParams={{store}} 
					// /> */}
					<Tab.Screen
						name="History"
						component={historyStack}
						options={{
							tabBarLabel: 'Lịch sử'
						}} />
					<Tab.Screen
						name="Profile"
						component={profileStack}
						options={{
							tabBarLabel: 'Cá nhân'
						}} />
				</Tab.Navigator>
			</NavigationContainer>
		</Provider>
	);
};


export default App;
