import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const ButtonWithIcon = ({
  title,
  iconName,
  color,
  onPress,
  vertical = false,
}) => (
  <TouchableOpacity
    style={[
      styles.staticButton,
      {backgroundColor: color},
      vertical && styles.verticalButton,
    ]}
    onPress={onPress}>
    <FontAwesome
      name={iconName}
      size={20}
      color="#fff"
      style={[styles.verticalIcon]}
      solid={false} // Use outline (light) style
    />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  staticButton: {
    flex: 1,
    marginBottom: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 90, // Set a fixed height for all buttons
  },
  verticalButton: {
    flexDirection: 'column', // Stack icon above text
    paddingVertical: 22,
  },
  verticalIcon: {
    marginBottom: 2,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'UbuntuMedium',
    color: '#fff',
    paddingHorizontal: 12, // Add horizontal padding for the text
    textAlign: 'center', // Ensure text is centered even when it wraps
  },
});
export default ButtonWithIcon;
