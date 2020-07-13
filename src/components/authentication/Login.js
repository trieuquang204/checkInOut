import * as React from 'react';
import {
    View,
    Text, TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';

// Import Firebase Authentication
import auth from '@react-native-firebase/auth';

// Import Custom Components
import FormGroup from '../custom-components/FormGroup'
import Loading from '../custom-components/Loading';
import Forgot from '../authentication/ForgotPass';
import AsyncStorage from '@react-native-community/async-storage'

import { Root } from 'native-base';
// import validateEmail from '../utils/utilsFunc.js';

export default class JointRoom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailError: '',
            password: '',
            passwordError: '',
            loading: false,
        };
    }


    onPressForgot = () => {
        Alert.alert('Hello', 'Tính năng đang phát triển...')
        // this.props.navigation.navigate('ForgotPass')
        // this.props.navigation.navigate('ForgotPass')};

        // navigati
        // alert('a;hii')
    };

    validateEmail = (text) => {
        // console.log(text);
        console.log(this.state.email)
        console.log(this.state.password)
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false && text != '') {
            this.setState({ email: text, emailError: 'Email không đúng định dạng' })
            return false;
        } else if (text == '') {
            this.setState({ emailError: 'Email không được để trống', })
            return false;
        }
        else if (this.state.email == '' && this.state.password != "") {
            this.setState({ passwordError: '' })
            return false;
        }
        else {
            this.setState({ email: text, emailError: '' })
            console.log('Email true')
            return true;
        }
    }

    validateInput = () => {
        console.log(this.state.email)
        console.log(this.state.password)
        if (this.state.email != "" && this.state.password == "") {
            this.setState({ passwordError: 'Mật khẩu không được để trống' });
            console.log('ps empty')
            return false;
        } else if (this.state.email == "" && this.state.password != "") {
            this.setState({ passwordError: '' })
            console.log('abc')
            return false;
        }
        else if (this.state.email == "" && this.state.password == "") {
            this.setState({ passwordError: 'Mật khẩu không được để trống' })
            console.log('abc')
            return false;
        }
        else {
            this.setState({ passwordError: '' });
            console.log('Password true')
            return true;
        }
    }

    _storeData = async (userDetail) => {
        try {
            await AsyncStorage.setItem(
                'LoggedProfileID',
                JSON.stringify(userDetail.user)
            );
        } catch (error) {
            // Error saving data
            console.log("Có lỗi xảy ra khi load userID")
        }
    };

    onPressLogin = async () => {
        const { email } = this.state;
        this.validateEmail(email);
        this.validateInput();
        // console.log(this.validateEmail(email))
        // alert(email);
        // Show Loading Scene
        // utilsFunc.validateEmail(email);
        console.log('login')
        if (this.validateEmail(email) == true && this.validateInput() == true) {
            console.log(this.validateEmail(email))
            console.log(this.state.email)
            console.log(this.state.password)
            this.setState({ loading: true });
            console.log('123')
            // Do Firebase Login
            auth()
                .signInWithEmailAndPassword(this.state.email.toLowerCase(), this.state.password)
                .then((userDetail) => {
                    console.log(userDetail.user);
                    // console.log(`User ${this.state.email} signed in.`);
                    this.loginSuccess();
                    this._storeData(userDetail);

                })
                .catch(error => {
                    console.log(error.code)
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        alert('That email address is invalid!');
                    }

                    this.loginFailed();
                });
        }
        // this.validateEmail(email);
        // this.validateInput();
        // this.setState({loading: true});

        // // Do Firebase Login
        // auth()
        //     .signInWithEmailAndPassword(this.state.email.toLowerCase(), this.state.password)
        //     .then((userDetail) => {
        //         console.log(userDetail.user);
        //         // console.log(`User ${this.state.email} signed in.`);
        //         this.loginSuccess();
        //         this._storeData(userDetail);

        //     })
        //     .catch(error => {
        //         if (error.code === 'auth/email-already-in-use') {
        //             console.log('That email address is already in use!');
        //         }

        //         if (error.code === 'auth/invalid-email') {
        //             console.log('That email address is invalid!');
        //         }

        //         console.error(error);
        //         this.loginFailed();
        //     });   
    };

    loginSuccess = () => {
        this.setState({ loading: false });
    }

    loginFailed = () => {
        this.setState({ loading: false, passwordError: 'Email hoặc mật khẩu không đúng', emailError: '' });
        // alert('Login failure. Please tried again.');
    };

    render() {
        // console.log(this.state.password)
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
                        <Text style={styles.header}>Check In</Text>

                        <View style={styles.loginForm}>
                            {/* <TextInput
                                placeholder="Email ID"
                                onChangeText={(text) => this.validate(text)}
                                value={this.state.email}
                                /> */}

                            <View style={styles.authFormGroup}>
                                <Text style={styles.authFormLabel} >Địa chỉ email</Text>
                                <TextInput
                                    style={styles.authFormControl}
                                    value={this.state.email}
                                    onChangeText={email => this.setState({ email: email })}
                                    placeholder={'Địa chỉ email'}
                                    placeholderTextColor={'#979797'}
                                    keyboardType={'email-address'} />
                            </View>
                            <Text style={{ color: 'red', fontSize: 15, marginVertical: 4 }}>{this.state.emailError}</Text>
                            <View style={styles.authFormGroup}>
                                <Text style={styles.authFormLabel} >Mật khẩu</Text>
                                <TextInput
                                    style={styles.authFormControl}
                                    value={this.state.password}
                                    onChangeText={password => this.setState({ password: password })}
                                    secureTextEntry={true}
                                    placeholder={'Mật khẩu truy cập'}
                                    placeholderTextColor={'#979797'} />
                            </View>
                            <Text style={{ color: 'red', fontSize: 15, marginVertical: 4 }}>{this.state.passwordError}</Text>
                            {/* <FormGroup   style={{borderWidth:1}}
                                onChangeText={email => this.setState({email: email})}
                                value = {this.state.email}
                                label="Tên đăng nhập"
                                placeholder={'Địa chỉ email'}
                            ></FormGroup>
                            <FormGroup
                                onChangeText={password => this.setState({password: password })}
                                secureTextEntry={true}
                                label="Mật khẩu"
                                placeholder="Mật khẩu truy cập"                  
                            ></FormGroup> */}
                        </View>
                        <View style={styles.loginForm}>
                            <TouchableOpacity onPress={() => this.onPressLogin()} >
                                <Text style={styles.btnEContractText} >
                                    Đăng nhập
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onPressForgot()} >
                                <Text style={styles.btnForgot} >
                                    Quên mật khẩu?
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
        backgroundColor: "#FFFFFF"
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
        marginTop: 100,
        marginBottom: 30
    },
    loginForm: {
        width: 295,
        marginTop: 20

    },
    inputStyle: {
        borderWidth: 1,

    }, signupForm: {
        backgroundColor: "black",
        borderRadius: 22,
        borderWidth: 1
    },
    btnEContractColor: {
        width: 295,
        padding: 12,
        borderRadius: 4,
    },
    btnEContractText: {
        textAlign: "center",
        fontSize: 17,
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#0091FF",
        borderRadius: 23,
        paddingVertical: 13,
        marginHorizontal: 20,
        height: 50,
        width: 250,
        overflow: "hidden"
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
    },
    btnForgot: {
        textAlign: "center",
        fontSize: 14,
        marginTop: 32
    },
    authFormGroup: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 8,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    authFormControl: {
        fontSize: 17,
        lineHeight: 24,
        color: '#000',
        padding: 0
    },
    authFormLabel: {
        fontSize: 12,
        color: "#BDBDBD",
        marginBottom: 4
    }
});