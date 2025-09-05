import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import logoImage from '../assets/images/logo.png';
import {azureLoginAction, testApiRequest} from '../actions/auth';
import {addEventListener} from '@react-native-community/netinfo';

const {width, height} = Dimensions.get('window');

const AzureLoginScreen = ({Auth: {status, errorText}, azureLogin, testApi}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Check the welcome API status on component mount
    testApi();
  }, [testApi]);

  const handleSubmitPress = async () => {
    azureLogin();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.subContainer}>
          {/* Top View with Gradient and Logo */}
          <LinearGradient
            colors={['#1cae97', '#0175b2', '#4b3d91']}
            style={styles.topView}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Image source={logoImage} style={styles.logo} />
          </LinearGradient>
          {/* Input Fields View */}
          <View style={styles.inputContainerView}>
            <Text style={styles.logoText}>LOGIN </Text>

            {!isConnected ? (
              <Text style={styles.errorText}>
                No internet connection. Please check your network and try again.
              </Text>
            ) : (status && status !== 200) || errorText != null ? (
              <Text style={styles.errorText}>
                There is an issue at the server level. Please contact the IT
                department or restart the application.{'\n'}
                {status ? `The status code is: ${status}` : ''}
                {'\n'}
                {errorText
                  ? `The error is: ${
                      Array.isArray(errorText)
                        ? errorText.join('. ') + '.'
                        : errorText
                    }`
                  : ''}
              </Text>
            ) : (
              <View style={styles.inputWrapper}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmitPress}>
                  <LinearGradient
                    colors={['#0175b2', '#4b3d91']}
                    style={styles.buttonGradient}>
                    <View style={styles.buttonContent}>
                      <Icon
                        name="login"
                        size={20}
                        color="#fff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>
                        SIGN IN WITH AZURE AD
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.footer}>
          @Powered by <Text style={styles.boldText}>Brandpath</Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcdadb',
    justifyContent: 'flex-center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    paddingBottom: 20,
  },

  subContainer: {
    backgroundColor: '#dcdadb',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  topView: {
    width: '100%',
    height: height * 0.42,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  logo: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
    position: 'absolute',
    top: '12%',
  },
  logoText: {
    fontFamily: '18KhebratMusamimRegular',
    fontSize: 36,
    color: 'black',
    textAlign: 'center',
    paddingBottom: 12,
  },
  inputContainerView: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 20,
    paddingVertical: 27,
    paddingHorizontal: 11,
    marginTop: height * 0.25, // Positioned after topView
    elevation: 0,
    shadowColor: 'transparent',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
    position: 'relative',
  },

  button: {
    marginTop: 17,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9.5,
    borderRadius: 25,
  },
  buttonContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 5,
  },
  buttonText: {
    fontSize: 10,
    fontFamily: 'UbuntuMedium',
    color: '#fff',
  },

  footer: {
    color: '#767b7f',
    fontSize: 10,
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  boldText: {
    fontWeight: '900',
  },
  errorText: {
    color: '#767b7f',
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium', // Replace with your preferred font
    fontSize: 12,

    marginLeft: 10,
  },
});

AzureLoginScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  azureLogin: PropTypes.func.isRequired,
  testApi: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
});
export default connect(mapStateToProps, {
  testApi: testApiRequest,
  azureLogin: azureLoginAction,
})(AzureLoginScreen);
