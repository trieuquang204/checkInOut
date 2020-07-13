import React, { Component } from 'react';

// Redux Imports
import { connect } from 'react-redux';
import store from '../../store'

// Import Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import CheckIn Screens
import CheckIn from '../../components/checkin/CheckIn';
import TakePicture from '../../components/checkin/TakePicture';
import ImageSelected from '../../components/checkin/ImageSelected';
import CheckOut from '../../components/checkout/CheckOut';
import Checked from '../../components/checkin/Checked';
import OffRequest from '../../components/checkin/OffRequest';
import History_detail from '../../components/history/History_detail';

const Stack = createStackNavigator();

class checkInStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'NOT_CHECKED_IN'
        };
    }

    _fetchStatus = () => {
        store.subscribe(() => {
            // console.log(store.getState());
            let status = store.getState().checkInStatus;
            // console.log(status);
            this.setState({ status })
        });
    }

    componentDidMount() {
        this._fetchStatus();
    }

    componentWillUnmount() {
        // store.unsubscribe();
    }

    render() {
        console.log('status state: ' + this.state.status);
        return (
          <Stack.Navigator>

            {/* {this.state.status == 'CHECKED_IN' ? (
              <>
                <Stack.Screen
                  name="Checked"
                  component={Checked}
                  options={Checked.navigationOptions}
                />
                <Stack.Screen
                  name="CheckOut"
                  component={CheckOut}
                  options={CheckOut.navigationOptions}
                />
              </>
            ) : (
              <Stack.Screen
                name="CheckIn"
                component={CheckIn}
                options={CheckIn.navigationOptions}
              />
            )} */}

            <Stack.Screen
              name="CheckIn"
              component={CheckIn}
              options={CheckIn.navigationOptions}
            />

            <Stack.Screen
              name="Checked"
              component={Checked}
              options={Checked.navigationOptions}
            />
            <Stack.Screen
              name="CheckOut"
              component={CheckOut}
              options={CheckOut.navigationOptions}
            />
            <Stack.Screen
              name="TakePicture"
              component={TakePicture}
              options={TakePicture.navigationOptions}
            />
            <Stack.Screen
              name="ImageSelected"
              component={ImageSelected}
              options={ImageSelected.navigationOptions}
            />
            <Stack.Screen
              name="OffRequest"
              component={OffRequest}
              options={OffRequest.navigationOptions}
            />
            <Stack.Screen
              name="History_detail"
              component={History_detail}
              options={History_detail.navigationOptions} />
          </Stack.Navigator>
        );
    }
}

export default connect()(checkInStack)
