import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {urlLastPart} from '../../utils/urlLastPart';
import {useIsFocused} from '@react-navigation/native';
import {barCodeAction} from '../../actions/global';
import {getMiscLabelPrintRequest} from '../../actions/miscLabel';
import {setPrintStatus as setPrintStatusAction, clearPrintStatus as clearPrintStatusAction} from '../../actions/printStatus';
import WebView from 'react-native-webview';
import {Text, View, StyleSheet} from 'react-native';
import StockMoveModal from '../../components/StockMoveModal';

const ItemInformationScreen = ({
  Auth: {user, currentPage},
  Global: {
    screenDetail,
    currentUrl,
    screenHistoryUrl,
    globalLoading,
    globalCurrentPage,
    localCurrentPage,
    errorText,
    userState,
    printStatus,
  },
  getMiscLabelPrintRequest,
  scanBarcode,
  setPrintStatus,
  clearPrintStatus,
}) => {
  const isFocused = useIsFocused();
  const webViewRef = useRef(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  // Handle print when data is loaded
  useEffect(() => {

    // If we have a print command and data is loaded
    if (printStatus && screenDetail?.param && !globalLoading) {
      getMiscLabelPrintRequest({
        OrderRef: screenDetail?.param,
        StationID: userState.stationid,
      });
      clearPrintStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenDetail?.param, globalLoading, printStatus, userState.stationid]);

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
      currentUrl === '/api/inventory/CMD.ITEMINFORMATION' &&
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


  const onMessage = async (event) => {
    const code = event.nativeEvent.data;

    // Check if the message is to open the comment modal
    if (code === 'OPEN_COMMENT_MODAL') {
      setCommentModalVisible(true);
      return;
    }

    // Handle print command
    if (code.includes('CMD.NONSTOCK?op=print')) {
      console.log('Print status set:', code);

      setPrintStatus(code);
    }

    // Handle other commands
    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;
    const lastPart = urlLastPart(lastUrlInHistory);
    const data = {
      userName: user.username,
      page: screenDetail?.page,
      barcode: code,
      currentPage: lastPart,
    };

    scanBarcode(data);
  };

  const handleCommentSave = (newComment) => {
    setCommentValue(newComment);

    // Send command to backend to save the comment, similar to how Company and Type work
    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;
    const lastPart = urlLastPart(lastUrlInHistory);

    // Construct the command with the comment parameter
    const commentCommand = `CMD.NONSTOCK?m=${newComment || ''}`;

    const data = {
      userName: user.username,
      page: screenDetail.page,
      barcode: commentCommand,
      currentPage: lastPart,
    };

    scanBarcode(data);
  };

  const injectedJS = `
  (function() {
    // Add button press effects
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.transition = 'opacity 0.2s';
      button.addEventListener('touchstart', function() {
        this.style.opacity = '0.6';
      });
      button.addEventListener('touchend', function() {
        this.style.opacity = '1';
      });
      button.addEventListener('touchcancel', function() {
        this.style.opacity = '1';
      });
    });

    // Generic modal handler function
    const setupModal = (dropdownBtn, modal) => {
      if (!dropdownBtn || !modal) return;
      
      dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.style.display = 'flex';
      });

      //Find close button inside modal
      const closeBtn = modal.querySelector('.close-btn');
      
      const closeModal = () => {
        modal.style.display = 'none';
      };

      // Close when clicking on modal background or close button
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn) {
          closeModal();
        }
      });

      // Handle option clicks
      const options = modal.querySelectorAll('.modal-option');
      options.forEach(option => {
        option.addEventListener('click', () => {
          closeModal();
          if (option.dataset.value) {
            window.ReactNativeWebView.postMessage(option.dataset.value);
          }
        });
      });
    };

    // Find all dropdown buttons and pair them with modals
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');
    const modals = document.querySelectorAll('.modal');
    
    // Simple pairing - assumes same number and order
    if (dropdownButtons.length === modals.length) {
      dropdownButtons.forEach((button, index) => {
        setupModal(button, modals[index]);
      });
    } else {
      // More robust pairing - looks for nearest modal after button
      dropdownButtons.forEach(button => {
        let nextElement = button.nextElementSibling;
        while (nextElement) {
          if (nextElement.classList.contains('modal')) {
            setupModal(button, nextElement);
            break;
          }
          nextElement = nextElement.nextElementSibling;
        }
      });
    }

    // Add click handler for comment section
    const commentContainers = document.querySelectorAll('.nested-bg-card');
    commentContainers.forEach(container => {
      const keyValuePair = container.querySelector('.key-value-pair');
      if (keyValuePair && keyValuePair.textContent.includes('Comment:')) {
        // Make the entire container clickable
        container.style.cursor = 'pointer';
        container.addEventListener('click', (e) => {
          // Prevent triggering if clicking on a button or modal
          if (!e.target.classList.contains('dropdown-btn') && 
              !e.target.closest('.modal')) {
            window.ReactNativeWebView.postMessage('OPEN_COMMENT_MODAL');
          }
        });
      }
    });
  })();`;
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

      <StockMoveModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        value={commentValue}
        onSave={handleCommentSave}
        title="Enter Comment"
        placeholder="Enter Comment"
        buttonText="Save"
        keyboardType="default"
        showIcon={false}
      />
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

ItemInformationScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  scanBarcode: PropTypes.func.isRequired,
  getMiscLabelPrintRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});

export default connect(mapStateToProps, {
  scanBarcode: barCodeAction,
  getMiscLabelPrintRequest,
  setPrintStatus: setPrintStatusAction,
  clearPrintStatus: clearPrintStatusAction,
})(ItemInformationScreen);


