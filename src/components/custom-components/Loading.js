import * as React from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';

export default function Loading() {
    return (
        <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgb(242,242,247)'}}>
            <ActivityIndicator size="small" />
        </View>
    );
}