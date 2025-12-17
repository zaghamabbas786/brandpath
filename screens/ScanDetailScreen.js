// ScanDetailScreen.js
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {barCodeAction} from '../actions/global';
import {getMiscLabelPrintRequest} from '../actions/miscLabel';
import {setPrintStatus as setPrintStatusAction, clearPrintStatus as clearPrintStatusAction} from '../actions/printStatus';
import {useNavigation} from '@react-navigation/native';
import {resetDockToStock} from '../actions/goodsIn';
import {goBack} from '../actions/global';
import {urlLastPart} from '../utils/urlLastPart';
import StockMoveModal from '../components/StockMoveModal';

const ScanDetailScreen = ({
  Global: {barCode, currentUrl, error, screenHistoryUrl, loading: globalLoading, userState, printStatus},
  Auth: {user},
  scanBarcode,
  onBarcodeRefocus,
  goBackAction,
  resetDockToStock,
  getMiscLabelPrintRequest,
  setPrintStatus,
  clearPrintStatus,
}) => {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  // Handle print when data is loaded
  useEffect(() => {
    // If we have a print command and data is loaded
    if (printStatus && barCode?.param && !globalLoading) {
      getMiscLabelPrintRequest({
        OrderRef: barCode?.param,
        StationID: userState?.stationid,
      });
      clearPrintStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barCode?.param, globalLoading, printStatus, userState?.stationid]);

  useEffect(() => {
    // Focus the input field when the component mounts
    if (onBarcodeRefocus) {
      onBarcodeRefocus(false);
    }
    return () => {
      // Cleanup focus when the component unmounts
      if (onBarcodeRefocus) {
        onBarcodeRefocus(true);
      }
    };
  }, [onBarcodeRefocus]);
  const onMessage = event => {
    const code = event.nativeEvent.data;

    // Check if the message is to open the comment modal
    if (code === 'OPEN_COMMENT_MODAL') {
      setCommentModalVisible(true);
      return;
    }

    // Handle print command
    if (code.includes('CMD.NONSTOCK?op=print')) {
      setPrintStatus(code);
    }

    const lastPart = urlLastPart(currentUrl);
    
    const data = {
      userName: user.username,
      page: barCode.page,
      barcode: code,
      currentPage: lastPart,
    };

    scanBarcode(data);
  };

  const handleCommentSave = (newComment) => {
    setCommentValue(newComment);

    // Send command to backend to save the comment
    const lastPart = urlLastPart(currentUrl);

    // Construct the command with the comment parameter
    const commentCommand = `CMD.NONSTOCK?m=${newComment || ''}`;

    const data = {
      userName: user.username,
      page: barCode.page,
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

      // Find close button inside modal
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
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{
          html: `
            <html>
              <head>
              <meta name="viewport" content="width=device-width, initial-scale=0.79, maximum-scale=0.79, user-scalable=no">
              <style>
               ${barCode && barCode.commonCss}
         
              </style>
               </head>
              <body>
              ${barCode ? barCode.extraInfo : ''}
             
              
                  </body>
            </html>
          `,
        }}
        injectedJavaScript={injectedJS}
        onMessage={onMessage}
      />

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

ScanDetailScreen.propTypes = {
  Global: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  scanBarcode: PropTypes.func.isRequired,
  goBackAction: PropTypes.func.isRequired,
  resetDockToStock: PropTypes.func.isRequired,
  getMiscLabelPrintRequest: PropTypes.func.isRequired,
  setPrintStatus: PropTypes.func.isRequired,
  clearPrintStatus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Global: state.Global,
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  scanBarcode: barCodeAction,
  goBackAction: goBack,
  resetDockToStock: resetDockToStock,
  getMiscLabelPrintRequest,
  setPrintStatus: setPrintStatusAction,
  clearPrintStatus: clearPrintStatusAction,
})(ScanDetailScreen);
