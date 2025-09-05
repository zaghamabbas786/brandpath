// SecurityScreen.js
import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {urlLastPart} from '../../utils/urlLastPart';
import {useIsFocused} from '@react-navigation/native';
import {barCodeAction} from '../../actions/global';
import WebView from 'react-native-webview';
import {Text, View, StyleSheet} from 'react-native';

const SecurityScreen = ({
  Auth: {user, currentPage},
  Global: {
    screenDetail,
    currentUrl,
    screenHistoryUrl,
    globalLoading,
    globalCurrentPage,
    localCurrentPage,
    errorText,
  },

  scanBarcode,
}) => {
  const isFocused = useIsFocused();
  const webViewRef = useRef(null);
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
      currentUrl === '/api/CMD.ACCESSCONTROL' &&
      currentUrl === lastUrlInHistory &&
      !screenDetail &&
      !globalLoading &&
      errorText === null
    ) {
      const lastPart = urlLastPart(lastUrlInHistory);

      const data = {
        userName: user.username,
        page: localCurrentPage
          ? localCurrentPage
          : globalCurrentPage
          ? globalCurrentPage
          : currentPage,
        barcode: lastPart,
        currentPage: lastPart,
      };

      scanBarcode(data);
    }
    return () => {
      isMounted = false; // Clean up flag on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onMessage = event => {
    const code = event.nativeEvent.data;

    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;
    const lastPart = urlLastPart(lastUrlInHistory);
    const data = {
      userName: user.username,
      page: screenDetail.page,
      barcode: code,
      currentPage: lastPart,
    };

    scanBarcode(data);
  };

  const injectedJS = `
  // Function to add touchable opacity effect on all buttons
  (function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.transition = 'opacity 0.2s'; // Smooth transition
      button.addEventListener('touchstart', function() {
        this.style.opacity = '0.6'; // Decrease opacity on touch
      });
      button.addEventListener('touchend', function() {
        this.style.opacity = '1'; // Reset opacity when touch ends
      });
      button.addEventListener('touchcancel', function() {
        this.style.opacity = '1'; // Reset opacity if touch is canceled
      });
    });
  })();
`;
  return (
    <>
      {errorText ? (
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
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{
            html: `
        <html>
          <head>
          <meta name="viewport" content="width=device-width, initial-scale=0.79, maximum-scale=0.79, user-scalable=no">
          <style>
           ${screenDetail && screenDetail.commonCss}
     
          </style>
           </head>
          <body>
          ${screenDetail ? screenDetail.extraInfo : ''}
         
          
              </body>
        </html>
      `,
          }}
          injectedJavaScript={injectedJS}
          onMessage={onMessage}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
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

SecurityScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  scanBarcode: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});

export default connect(mapStateToProps, {
  scanBarcode: barCodeAction,
})(SecurityScreen);
