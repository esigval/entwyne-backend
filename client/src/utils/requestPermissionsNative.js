// useful for native builds that are custom beyond expo

import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestPermissions = async () => {
    if (Platform.OS === 'android') {
        const cameraPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "Camera Permission",
                message: "App needs access to your camera",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

        const audioPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: "Microphone Permission",
                message: "App needs access to your microphone",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

        if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED || 
            audioPermission !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Camera and/or Microphone permissions denied');
        }
    } else {
        check(PERMISSIONS.IOS.CAMERA).then(result => {
            switch (result) {
                case RESULTS.DENIED:
                    request(PERMISSIONS.IOS.CAMERA).then(result => {
                        // … handle if denied
                    });
                    break;
                case RESULTS.GRANTED:
                    console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    console.log('The permission is blocked');
                    break;
            }
        });

        check(PERMISSIONS.IOS.MICROPHONE).then(result => {
            switch (result) {
                case RESULTS.DENIED:
                    request(PERMISSIONS.IOS.MICROPHONE).then(result => {
                        // … handle if denied
                    });
                    break;
                case RESULTS.GRANTED:
                    console.log('The permission is granted');
                    break;
                case RESULTS.BLOCKED:
                    console.log('The permission is blocked');
                    break;
            }
        });
    }
};