import * as Keychain from 'react-native-keychain';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import logoImage from '../assets/images/logo.png';
import PinInput from '../components/PinInput';
import {loginUserAction, logoutRequest} from '../actions/auth';
import {decodeJwt} from '../utils/jwt';

const {width, height} = Dimensions.get('window');

const LoginScreen = ({navigation, loginUser, logout}) => {
  const [showPin, setShowPin] = useState(false);
  const [azureUserName, setAzureUserName] = useState(null);
  const [loadingCredentials, setLoadingCredentials] = useState(true);

  // Formik setup
  const formik = useFormik({
    initialValues: {userName: '', userPin: ''},
    validationSchema: Yup.object({
      userName: Yup.string().required('Username is required'),
      userPin: Yup.string()
        .matches(/^\d{5}$/, 'Pin must be exactly 5 digits')
        .required('Pin is required'),
    }),
    onSubmit: values => handleSubmitPress(values),
  });

  // Fetch Azure username on component mount
  useEffect(() => {
    const fetchAzureUsername = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const decodedUsername = decodeJwt(credentials.password);
          setAzureUserName(decodedUsername); // Set Azure username in state
        } else {
          navigation.replace('AzureLoginScreen');
        }
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } finally {
        setLoadingCredentials(false); // <-- Done loading
      }
    };

    fetchAzureUsername();
    // eslint-disable-next-line
  }, []); // Only runs once when the component is mounted

  // Reset form data when navigating back to LoginScreen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      formik.resetForm();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleSubmitPress = values => {
    const {userName, userPin} = values;

    // Use the stored azureUserName from the state instead of fetching again
    if (azureUserName) {
      // If username matches, proceed with the login (PIN check or other logic)
      loginUser(userName, userPin, azureUserName);
    } else {
      formik.setFieldError('general', 'No stored username found');
    }
  };

  if (loadingCredentials) {
    return <Spinner visible={true} />;
  }
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
          {/* Display the logged-in Azure username */}

          {/* Input Fields View */}
          <View style={styles.inputContainerView}>
            <Text style={styles.logoText}>LOGIN</Text>
            {azureUserName && (
              <Text style={styles.azureName}>
                Last logged in user is "{azureUserName}". If this is not you,
                please log out and log in with your own account.
              </Text>
            )}
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#0175b2', '#4b3d91']}
                  style={styles.iconGradient}>
                  <Icon name="person" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <TextInput
                style={[
                  styles.input,
                  formik.touched.userName &&
                    formik.errors.userName &&
                    styles.errorInput,
                ]}
                onChangeText={formik.handleChange('userName')}
                onBlur={formik.handleBlur('userName')}
                value={formik.values.userName}
                placeholder="Your Name"
                placeholderTextColor="#767b7f" // Add this line
                returnKeyType="next"
              />
            </View>
            {formik.touched.userName && formik.errors.userName ? (
              <Text style={styles.errorText}>{formik.errors.userName}</Text>
            ) : null}

            <Text style={styles.label}>PIN</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#0175b2', '#4b3d91']}
                  style={styles.iconGradient}>
                  <Icon name="lock" size={20} color="#fff" />
                </LinearGradient>
              </View>

              <PinInput
                pin={formik.values.userPin}
                onPinChange={text => formik.setFieldValue('userPin', text)}
                showPin={showPin}
                onBlur={formik.handleBlur('userPin')}
                error={formik.touched.userPin && formik.errors.userPin} // Pass error prop
              />

              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowPin(!showPin)}>
                <Icon
                  name={showPin ? 'visibility' : 'visibility-off'}
                  size={21}
                  color="#767b7f"
                />
              </TouchableOpacity>
            </View>

            {formik.touched.userPin && formik.errors.userPin ? (
              <Text style={styles.errorTextWithoutBottomMargin}>
                {formik.errors.userPin}
              </Text>
            ) : null}
            {formik.errors.general ? (
              <Text style={styles.errorTextWithoutBottomMargin}>
                {formik.errors.general}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.button}
              onPress={formik.handleSubmit}>
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
                  <Text style={styles.buttonText}>LOGIN</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => logout(azureUserName)}>
              <LinearGradient
                colors={['#1cae97', '#0175b2']}
                style={styles.buttonGradient}>
                <View style={styles.buttonContent}>
                  <Icon
                    name="logout"
                    size={20}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Not you? Log out</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('ChangePinScreen')}>
              <View style={styles.line} />
              <Text style={styles.registerText}>Change Your PIN</Text>
              <View style={styles.line} />
            </TouchableOpacity>
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
    // paddingBottom: 5,
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
  azureName: {
    color: '#767b7f',
    marginBottom: 15,
    fontFamily: 'Poppins-Medium', // Replace with your preferred font
    fontSize: 12,
    marginLeft: 10,
  },
  label: {
    color: '#767b7f',
    marginBottom: 2,

    fontFamily: 'Poppins-Medium', // Replace with your preferred font
    fontSize: 12,

    marginLeft: 10,
  },
  input: {
    height: 37,
    flex: 1,
    paddingHorizontal: 40,
    paddingLeft: 47,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    color: 'black',
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },

  iconContainer: {
    position: 'absolute',
    left: 3,
    zIndex: 1,
  },
  iconGradient: {
    borderRadius: 20,
    padding: 5,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 5,
  },
  buttonText: {
    fontSize: 10,
    fontFamily: 'UbuntuMedium',
    color: '#fff',
  },
  registerLink: {
    paddingHorizontal: 20,
    marginTop: 26,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  line: {
    flex: 1,
    height: 0.8,
    backgroundColor: '#a3a1a1',
    marginHorizontal: 10,
  },
  registerText: {
    color: '#3e519c',
    fontSize: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 10,
    marginLeft: 10,
  },
  errorTextWithoutBottomMargin: {
    color: 'red',
    fontSize: 12,
    marginTop: -6,
    marginLeft: 10,
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
});

LoginScreen.propTypes = {
  loginUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(null, {
  logout: logoutRequest,
  loginUser: loginUserAction,
})(LoginScreen);
