// DispatchScreen.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import NestedPageHeader from '../../components/NestedPageHeader';
import ReusableScreen from '../../components/ReusableScreen';

const DispatchScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <NestedPageHeader pageName="Dispatch" />
      <ReusableScreen navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DispatchScreen;
