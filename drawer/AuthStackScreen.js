import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ChangePinScreen from '../screens/ChangePinScreen';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';
import {useSnackbar} from '../context/SnackbarContext';
import {clearError, clearMessage} from '../actions/auth';
import AzureLoginScreen from '../screens/AzureLoginScreen';

const AuthStack = createStackNavigator();

const AuthStackScreen = ({
  Auth: {error, message, loading, timeout},
  clrError,
  clrMessage,
}) => {
  const {handleSnackbarAndSound} = useSnackbar();
  useEffect(() => {
    if (error) {
      handleSnackbarAndSound(error, 'error');
      clrError();
    } else if (message) {
      handleSnackbarAndSound(message, 'success');
      clrMessage();
    }

    // eslint-disable-next-line
  }, [error, message]);

  return (
    <>
      {loading && <Spinner visible={true} />}

      <AuthStack.Navigator screenOptions={{headerShown: false}}>
        {timeout ? (
          <>
            <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
            <AuthStack.Screen
              name="ChangePinScreen"
              component={ChangePinScreen}
            />
            <AuthStack.Screen
              name="AzureLoginScreen"
              component={AzureLoginScreen}
            />
          </>
        ) : (
          <>
            <AuthStack.Screen
              name="AzureLoginScreen"
              component={AzureLoginScreen}
            />
          </>
        )}
      </AuthStack.Navigator>
    </>
  );
};

AuthStackScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  clrError: PropTypes.func.isRequired,
  clrMessage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  clrError: clearError,
  clrMessage: clearMessage,
})(AuthStackScreen);
