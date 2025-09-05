import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const PaperlessDispatchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>PaperlessDispatchScreen</Text>
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

export default PaperlessDispatchScreen;
