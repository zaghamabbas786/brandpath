import React, {createContext, useContext, useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import {offGlobalError, onGlobalError} from '../utils/errorHandler';

export const SnackbarContext = createContext();

export const SnackbarProvider = ({children}) => {
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [type, setType] = useState('info'); // 'info', 'error', 'success'
  useEffect(() => {
    const handleGlobalError = errorMessage => {
      handleSnackbarAndSound(errorMessage, 'error');
    };

    // Subscribe to GLOBAL_ERROR event
    onGlobalError(handleGlobalError);

    return () => {
      // Clean up the listener
      offGlobalError(handleGlobalError);
    };
  }, []);

  const handleSnackbarAndSound = (errorMessages, snackbarType = 'error') => {
    // Play sound
    if (snackbarType === 'error') {
      Sound.setCategory('Playback');
      const sound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.error('Failed to load error sound:', error);
          return;
        }
        sound.play(success => {
          if (!success) {
            console.error('Error sound playback failed due to audio decoding errors');
          }
        });
      });
    } else {
      Sound.setCategory('Playback');
      const sound = new Sound('ding.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.error('Failed to load success sound:', error);
          return;
        }
        sound.play(success => {
          if (!success) {
            console.error('Success sound playback failed due to audio decoding errors');
          }
        });
      });
    }
    // Ensure errorMessages is an array
    const messagesArray = (
      Array.isArray(errorMessages) ? errorMessages : [errorMessages]
    ).filter(msg => msg !== null && msg !== undefined);

    // Format the messages with the first one bold
    const formattedMessages = messagesArray
      .map((msg, index) => {
        // Check if the message is a string or an object
        if (typeof msg === 'string') {
          // Capitalize the first string message and bold it
          const titleCasedMsg = msg.charAt(0).toUpperCase() + msg.slice(1);
          return index === 0
            ? `<p style="color: #ffffff; font-weight: bold; margin: 0; padding: 0; display: inline;">${titleCasedMsg}</p>`
            : `<p style="color: #ffffff; margin: 0; padding: 0; display: inline;">${titleCasedMsg}</p>`;
        } else if (typeof msg === 'object' && msg.message && msg.status) {
          // Handle additional error details if available
          return `<p style="color: #ffffff; font-weight: bold; margin: 0; padding: 0; display: inline;">Error: ${msg.message}</p> <p style="color: #ffffff; margin: 0; padding: 0; display: inline;">(Status: ${msg.status})</p>`;
        }
        return '';
      })
      .join(' ');

    // Set the error message, type, and show the Snackbar
    setSnackbarMessage(formattedMessages);
    setType(snackbarType);
    setVisible(true);
  };

  // // This will handle any error state globally
  // const handleGlobalError = errorMessage => {
  //   handleSnackbarAndSound(errorMessage, 'error');
  // };

  return (
    <SnackbarContext.Provider
      value={{
        visible,
        snackbarMessage,
        type,
        setVisible,
        handleSnackbarAndSound,
      }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
