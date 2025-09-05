import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Snackbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RenderHtml from 'react-native-render-html';
import {useSnackbar} from '../context/SnackbarContext';

const SnackBarComponent = () => {
  const {visible, snackbarMessage, type, setVisible} = useSnackbar();
  const {width} = useWindowDimensions();

  const onDismissSnackBar = () => setVisible(false);

  const getIconAndColor = () => {
    switch (type) {
      case 'error':
        return {icon: 'close-circle', color: '#ff4d4d'};
      case 'success':
        return {icon: 'check-circle', color: '#4caf50'};
      default:
        return {icon: 'information', color: '#ffffff'};
    }
  };

  const {icon, color} = getIconAndColor();

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismissSnackBar}
      duration={Snackbar.DURATION_SHORT}
      style={styles.snackbar}
      action={{
        label: 'Close',
        onPress: () => setVisible(false),
      }}>
      <View style={styles.snackbarContent}>
        <Icon name={icon} size={24} color={color} style={styles.icon} />
        <RenderHtml contentWidth={width} source={{html: snackbarMessage}} />
      </View>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: '#323232',
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
  },
});

export default SnackBarComponent;
