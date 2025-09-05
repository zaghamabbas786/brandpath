import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Text,
} from 'react-native';
import UserInfoContainer from '../components/UserInfoContainer';
import BarCodeReader from '../components/BarCodeReader';
import LocPartnerContainer from '../components/LocPartnerContainer';

const {height} = Dimensions.get('window');

const withUserInfo = WrappedComponent => {
  return props => {
    const [shouldRefocusBarcode, setShouldRefocusBarcode] = useState(true); // Track refocus status

    const handleBarcodeRefocus = shouldRefocus => {
      setShouldRefocusBarcode(shouldRefocus);
    };
    return (
      <View style={styles.screenContainer}>
        <View style={styles.inputContainerView}>
          <View style={{marginBottom: 10}}>
            <LocPartnerContainer />
          </View>
          <View style={styles.container}>
            <UserInfoContainer />
            <WrappedComponent
              {...props}
              onBarcodeRefocus={handleBarcodeRefocus}
            />
          </View>
        </View>
        <View style={styles.footerContainer}>
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.inputContainer}
            keyboardVerticalOffset={height * 0.1}>
            <BarCodeReader shouldRefocus={shouldRefocusBarcode} />
            <Text style={styles.footer}>
              @Powered by <Text style={styles.boldText}>Brandpath</Text>
            </Text>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    marginTop: height * 0.11,
    flexDirection: 'column', // Ensures vertical stacking of children
  },
  inputContainerView: {
    flex: 1, // Makes this section take up remaining space
    width: '88%',
    zIndex: 1,
    alignSelf: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    // height: height * 0.628,
    height: height * 0.7,
    // flexGrow: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 0,
    shadowColor: 'transparent',
    // marginBottom: 10,
  },
  footerContainer: {
    width: '88%',
    alignSelf: 'center',
    marginBottom: 10, // Adjust margin as needed
  },
  inputContainer: {},
  footer: {
    color: '#767b7f',
    fontSize: 10,
    alignSelf: 'center',
    marginTop: height * 0.01,
  },
  boldText: {
    fontWeight: '900',
  },
});

export default withUserInfo;
