import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {urlLastPart} from '../../utils/urlLastPart';
import {useIsFocused} from '@react-navigation/native';
import {barCodeAction} from '../../actions/global';
import WebView from 'react-native-webview';
import {getEscalationPrintRequest} from '../../actions/escalation';
import {Text, View, StyleSheet, TextInput, Dimensions} from 'react-native';
import StockMoveModal from '../../components/StockMoveModal';

const StockTakeScreen = ({
  Auth: {user, currentPage},
  Global: {
    screenDetail,
    currentUrl,
    screenHistoryUrl,
    globalLoading,
    globalCurrentPage,
    localCurrentPage,
    userState,
    errorText,
  },
  getEscalationPrintRequest,
  scanBarcode,
  onBarcodeRefocus,
}) => {
  const isFocused = useIsFocused();
  const webViewRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [qtyModalVisible, setQtyModalVisible] = useState(false);
  const [qtyValue, setQtyValue] = useState('');
  const [lastScannedCode, setLastScannedCode] = useState('');
  const shouldShowWeightInput = React.useMemo(() => {
    const html = screenDetail?.extraInfo || '';
    return /<input[^>]*id=["']weight["']/i.test(html);
  }, [screenDetail?.extraInfo]);

  useEffect(() => {
    if (!isFocused) {return;}

    let isMounted = true;

    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;

    // Only call getScreenData if currentUrl is valid and differs from the last history URL

    if (
      isMounted &&
      currentUrl &&
      currentUrl.includes('CMD.ST.LIST') &&
      currentUrl === lastUrlInHistory &&
      (!screenDetail || !screenDetail.extraInfo) &&
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
      // dispatch(setWebInputFocus(false));
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
    if (code) {
      setLastScannedCode(code);
    }
  };
  // Submit helper to send code then quantity
  const submitCodeAndQuantity = (overrideQty) => {
    const finalQty = overrideQty !== undefined ? overrideQty : qtyValue;
    if (!finalQty) {return;}
    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;
    const lastPart = urlLastPart(lastUrlInHistory);

    const send = (barcodeStr) => {
      const data = {
        userName: user.username,
        page: screenDetail?.page,
        barcode: barcodeStr,
        currentPage: lastPart,
      };
      scanBarcode(data);
    };

    // For Stock Take, treat the entered quantity as the barcode to send
    send(finalQty);

    onBarcodeRefocus && onBarcodeRefocus(true);
    setQtyModalVisible(false);
    setQtyValue('');
    setInputValue('');
    setIsInputFocused(false);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
    onBarcodeRefocus && onBarcodeRefocus(false);
    setQtyModalVisible(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
    onBarcodeRefocus && onBarcodeRefocus(true);
  };
  const htmlContent = React.useMemo(() => {
    return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=0.79, maximum-scale=0.79, user-scalable=no">
        <style>${screenDetail?.commonCss ?? ''}</style>
      </head>
      <body>
        ${screenDetail?.extraInfo ?? ''}
      </body>
    </html>
  `;
  }, [screenDetail?.commonCss, screenDetail?.extraInfo]);
  const injectedJS = `
  (function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(function(button){
      button.style.transition = 'opacity 0.2s';
      button.addEventListener('touchstart', function(){ this.style.opacity = '0.6'; });
      button.addEventListener('touchend', function(){ this.style.opacity = '1'; });
      button.addEventListener('touchcancel', function(){ this.style.opacity = '1'; });
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
        <View style={styles.contentContainer}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            style={{flex: 1}}
            javaScriptEnabled
            domStorageEnabled
            keyboardDisplayRequiresUserAction={false}
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
          {shouldShowWeightInput && (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isInputFocused && styles.focusedInput]}
                placeholder="Enter Quantity"
                placeholderTextColor="#767b7f"
                value={inputValue}
                onChangeText={setInputValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                returnKeyType="done"
              />
            </View>
          )}

          <StockMoveModal
            visible={qtyModalVisible}
            onClose={() => {
              setQtyModalVisible(false);
              onBarcodeRefocus && onBarcodeRefocus(true);
            }}
            value={qtyValue}
            onSave={val => {
              setQtyValue(val);
              submitCodeAndQuantity(val);
            }}
            title="Enter Quantity"
            placeholder="Enter Quantity"
            buttonText="OK"
            keyboardType="numeric"
            showIcon={false}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    position: 'relative',
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
  inputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  input: {
    height: 39,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    borderRadius: 20,
    color: '#383838',
    backgroundColor: '#f0f0f0',
    flex: 1,
    paddingHorizontal: 20,
  },
  hiddenInput: {
    opacity: 0,
    height: 0,
    paddingVertical: 0,
    marginVertical: 0,
  },
  focusedInput: {
    borderColor: '#1cae97',
  },
  overlayWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  overlayContainer: {
    alignSelf: 'stretch',
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
  overlayInput: {
    backgroundColor: '#f0f0f0',
  },
  tapToTypeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#383838',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#383838',
    marginBottom: 10,
  },
  modalInput: {
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});

StockTakeScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  scanBarcode: PropTypes.func.isRequired,
  onBarcodeRefocus: PropTypes.func,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});

export default connect(mapStateToProps, {
  scanBarcode: barCodeAction,
})(StockTakeScreen);
