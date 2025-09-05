// PinInput.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const PinInput = ({pin, onPinChange, showPin, onBlur, error}) => {
  return (
    <View style={[styles.inputPin, error && styles.errorInput]}>
      <OTPInputView
        style={styles.otpInputView}
        pinCount={5}
        code={pin}
        onCodeChanged={onPinChange}
        autoFocusOnLoad={false}
        codeInputFieldStyle={[
          styles.underlineStyleBase,
          error && styles.errorPinInput,
        ]}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={code => {
          onPinChange(code);
        }}
        secureTextEntry={!showPin}
        onBlur={onBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  otpInputView: {
    width: '97%',
    paddingBottom: 0,
  },
  underlineStyleBase: {
    width: 28,
    height: 30,
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingBottom: 5,
    fontSize: 10,
    fontWeight: '600',
    marginHorizontal: 5,
    borderColor: '#a3a1a1',
    color: 'black',
    textAlignVertical: 'center',
  },
  underlineStyleHighLighted: {
    borderColor: '#1cae97',
  },

  inputPin: {
    height: 37,
    paddingHorizontal: 40,
    paddingBottom: 7,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    fontSize: 10,
    fontWeight: '600',
  },
  pinInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#a3a1a1',
    width: 28,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    paddingBottom: 4,
    marginHorizontal: 5,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorPinInput: {
    borderBottomColor: 'red',
  },
});

export default PinInput;
