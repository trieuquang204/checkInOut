import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,Validate
} from 'react-native';

// Import Firebase Authentication
import auth from '@react-native-firebase/auth';


// Import Custom Components
import FormGroup from '../custom-components/FormGroup'
import Loading from '../custom-components/Loading';

export default class JointRoom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'tuan@gmail.com',
            password: '123123',
            loading: false,
        };
    }

    onPressGetPassword = async () => {
        this.props.navigation.navigate('Login')
    }

    onPressLogin = async () => {
        // Show Loading Scene
        this.setState({loading: true});

        // Do Firebase Login
        auth()
            .signInWithEmailAndPassword(this.state.email.toLowerCase(), this.state.password)
            .then(() => {
                console.log(`User ${this.state.email} signed in.`);
                this.loginSuccess();
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
                this.loginFailed();
            });
    };

    loginSuccess = () => {
        this.setState({loading: false});
    }

    loginFailed = () => {
        this.setState({loading: false});
        alert('Login failure. Please tried again.');
    };

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            )
        }
        return (
            <KeyboardAvoidingView
                behavior="position"
                style={styles.container}
                contentContainerStyle={styles.container}
                keyboardVerticalOffset="-80"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.header}>Quên mật khẩu</Text>
                        <View style={styles.loginForm}>
                            <FormGroup
                                onChangeText={email => this.setState({email})}
                                label="Mã xác nhận"
                                placeholder="Mã xác nhận"
                            ></FormGroup>
                            <FormGroup
                                onChangeText={password => this.setState({password})}
                                secureTextEntry={true}
                                label="Mật khẩu mới"
                                placeholder="Tạo mật khẩu"
                            ></FormGroup>
                               <FormGroup
                                onChangeText={password => this.setState({password})}
                                secureTextEntry={true}
                                label="Xác nhận mật khẩu"
                                placeholder="Xác nhận mật khẩu mới"
                            ></FormGroup>
                        </View>
                        <View style={styles.loginForm}>
                            <TouchableOpacity onPress={() => this.onPressGetPassword()} >
                                <Text style={styles.btnEContractText} >
                                    Xác nhận
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressGetPassword()} >
                                <Text style={styles.btnForgot} >
                                  Thử đăng nhập lại
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View><Text style={styles.txtCopyright}>&copy; NETFIN 2020</Text></View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inner: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 24,
		justifyContent: "space-between",
		alignItems: "center",
	},
	header: {
		fontSize: 36,
		fontWeight: "700",
		color: "#000000",
		marginTop: 150,
	},
	loginForm: {
		width: 295
	},
	btnEContractColor: {
		width: 295,
		padding: 12,
		borderRadius: 4,
	},
	btnEContractText: {
		textAlign: "center",
        fontSize: 17,
        fontWeight:"bold",
        color: "white",
        backgroundColor:"#0091FF",
        borderRadius:23,
        paddingVertical:13,
        marginHorizontal:20,
        height:50,
        width:250,
        overflow:"hidden"
	},
	btnRegisterText: {
		textAlign: "center",
		fontSize: 17,
		lineHeight: 20,
		color: "#000000",
		marginTop: 24
    },
    txtCopyright: {
		textAlign: "center",
		fontSize: 17,
		lineHeight: 20,
		color: "#000000",
    },   btnForgot:{
        textAlign:"center",
        fontSize:14,
        marginTop: 32
    }
});