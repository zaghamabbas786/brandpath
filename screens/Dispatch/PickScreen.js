import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const PickScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>PickScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  text: {
    color: 'black',
  },
});

export default PickScreen;
