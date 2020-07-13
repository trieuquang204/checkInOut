import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default class FormGroup extends Component {
    static propTypes = {
        containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // Form-Group View style override
        label: PropTypes.string.isRequired, // Input Label
        labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),  // Input Label style override
        formControlStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // Form-Control TextInput style override
        autoFocus: PropTypes.bool,
        editable: PropTypes.bool,
        autoCapitalize: PropTypes.bool,
        secureTextEntry: PropTypes.bool,
        onChangeText: PropTypes.func,
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        placeholder: PropTypes.string.isRequired, // Form-Control TextInput Placeholder
        placeholderTextColor: PropTypes.string, // Form-Control TextInput Placeholder color
        keyboardType: PropTypes.string,
    }
    render = () => {
        const { ref, containerStyle, label, labelStyle, formControlStyle, autoFocus, editable, autoCapitalize, secureTextEntry, onChangeText, value, defaultValue, placeholder } = this.props;
        var placeholderTextColor = (this.props.placeholderTextColor != null) ? this.props.placeholderTextColor : "#979797";

        return (
            <View style={[styles.formGroup, containerStyle]}>
                <Text style={[styles.formLabel, labelStyle]}>{label}</Text>
                <TextInput
                    style={[styles.formControl, formControlStyle]}
                    autoFocus={autoFocus}
                    editable={editable}
                    autoCapitalize={autoCapitalize}
                    secureTextEntry={secureTextEntry}
                    onChangeText={onChangeText}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
	formGroup: {
        marginBottom: 5,
        borderRadius:7,
        borderWidth:1,
        borderColor:'#e0e0e0',
        marginTop: 10
	},
	formLabel: {
        fontSize: 12,
		// lineHeight: 20,
		color: "#BDBDBD",
        // marginBottom: 8,
        marginLeft:10,
        marginTop:10
	},
	formControl: {
        alignSelf: 'stretch',
        fontSize: 16,
		lineHeight: 20,
		marginLeft:10,
        color: "#BDBDBD",
        // marginBottom:10
	}
});