// src/components/ReusableScreen.js
import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getScreenRequestData, getScreenRequest} from '../actions/global';
import Spinner from 'react-native-loading-spinner-overlay';
import {useIsFocused} from '@react-navigation/native';
import {chunkArray} from '../utils/chunkArray';
import ButtonWithIcon from './ButtonWithIcon';

const ReusableScreen = ({
  Global: {
    screenDetail,
    currentUrl,
    screenHistoryUrl,
    globalLoading,
    errorText,
  },
  Auth: {user},
  getScreenData,
  getScreen,
  navigation,
}) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;

    let isMounted = true;

    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;

    // Only call getScreenData if currentUrl is valid and differs from the last history URL
    if (
      isMounted &&
      currentUrl &&
      currentUrl === lastUrlInHistory &&
      !screenDetail &&
      !globalLoading &&
      errorText === null
    ) {
      getScreenData(user.username, currentUrl);
    }
    return () => {
      isMounted = false; // Clean up flag on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const handleNavigate = ({screen, action}) => {
    const trimmedUrl = action.url.trim();
    getScreen(trimmedUrl);
    navigation.navigate(screen);
  };

  // Chunk buttons into rows of two if detail is not null or undefined
  const buttonRows = screenDetail ? chunkArray(screenDetail, 2) : [];
  if (errorText) {
    return (
      <View style={styles.inputContainerView}>
        {Array.isArray(errorText) ? (
          errorText.map((msg, index) => (
            <Text key={index} style={styles.errorText}>
              {msg}
            </Text>
          ))
        ) : (
          <Text style={styles.errorText}>{errorText}</Text>
        )}
      </View>
    );
  } else if (!screenDetail || screenDetail.length === 0 || globalLoading) {
    return (
      <View style={styles.container}>
        {globalLoading || isFocused ? (
          <Spinner visible={true} />
        ) : (
          <Text>No data available</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {buttonRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button, buttonIndex) => (
              <ButtonWithIcon
                key={buttonIndex}
                title={button.name}
                iconName={button.iconName}
                color={button.style.backgroundColor}
                onPress={() =>
                  handleNavigate({
                    screen: button.navigation,
                    action: button.action,
                  })
                }
                vertical={true}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    marginTop: 10,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainerView: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    paddingVertical: 27,
    paddingHorizontal: 11,
    elevation: 0,
    shadowColor: 'transparent',
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

ReusableScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  getScreenData: PropTypes.func.isRequired,
  getScreen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});

export default connect(mapStateToProps, {
  getScreen: getScreenRequest,
  getScreenData: getScreenRequestData,
})(ReusableScreen);
