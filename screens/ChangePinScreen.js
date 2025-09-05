import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import logoImage from '../assets/images/logo.png';
import PinInput from '../components/PinInput';
import {changePinAction} from '../actions/auth';

const {width, height} = Dimensions.get('window');

const ChangePinScreen = ({navigation, route, changePin}) => {
  const [loading, setLoading] = useState(false);
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  // Retrieve username and oldPin from route params
  const {userName, oldPin} = route.params || {};

  // Formik setup
  const formik = useFormik({
    initialValues: {
      userName: userName || '',
      oldPin: oldPin || '',
      newPin: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Username is required'),
      oldPin: Yup.string()
        .matches(/^\d{5}$/, 'Old Pin must be exactly 5 digits')
        .required('Old Pin is required'),
      newPin: Yup.string()
        .matches(/^\d{5}$/, 'New Pin must be exactly 5 digits')
        .required('New Pin is required'),
    }),
    onSubmit: values => handleSubmitPress(values),
  });

  const handleSubmitPress = async values => {
    const {userName, oldPin, newPin} = values;
    changePin(userName, oldPin, newPin);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.subContainer}>
          <Spinner visible={loading} />
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
            <Text style={styles.logoText}>CHANGE PIN</Text>
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
                placeholderTextColor="#767b7f"
                placeholder="Enter Username"
                returnKeyType="next"
              />
            </View>
            {formik.touched.userName && formik.errors.userName ? (
              <Text style={styles.errorText}>{formik.errors.userName}</Text>
            ) : null}

            <Text style={styles.label}>Old PIN</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#0175b2', '#4b3d91']}
                  style={styles.iconGradient}>
                  <Icon name="lock" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <PinInput
                pin={formik.values.oldPin}
                onPinChange={text => formik.setFieldValue('oldPin', text)}
                showPin={showOldPin}
                onBlur={formik.handleBlur('oldPin')}
                error={formik.touched.oldPin && formik.errors.oldPin}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowOldPin(!showOldPin)}>
                <Icon
                  name={showOldPin ? 'visibility' : 'visibility-off'}
                  size={21}
                  color="#767b7f"
                />
              </TouchableOpacity>
            </View>

            {formik.touched.oldPin && formik.errors.oldPin ? (
              <Text style={styles.errorText}>{formik.errors.oldPin}</Text>
            ) : null}

            <Text style={styles.label}>New PIN</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#0175b2', '#4b3d91']}
                  style={styles.iconGradient}>
                  <Icon name="lock" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <PinInput
                pin={formik.values.newPin}
                onPinChange={text => formik.setFieldValue('newPin', text)}
                showPin={showNewPin}
                onBlur={formik.handleBlur('newPin')}
                error={formik.touched.newPin && formik.errors.newPin}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowNewPin(!showNewPin)}>
                <Icon
                  name={showNewPin ? 'visibility' : 'visibility-off'}
                  size={21}
                  color="#767b7f"
                />
              </TouchableOpacity>
            </View>

            {formik.touched.newPin && formik.errors.newPin ? (
              <Text style={styles.errorTextWithoutBottomMargin}>
                {formik.errors.newPin}
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
                  <Text style={styles.buttonText}>CHANGE PIN</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('LoginScreen')}>
              <View style={styles.line} />
              <Text style={styles.registerText}>
                Cancel and Go Back to Login
              </Text>
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
    paddingBottom: 50,
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
    fontSize: 9,
    color: 'black',
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

ChangePinScreen.propTypes = {
  changePin: PropTypes.func.isRequired,
};

export default connect(null, {
  changePin: changePinAction,
})(ChangePinScreen);
