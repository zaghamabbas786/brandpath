import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const StockMoveModal = ({
  visible,
  onClose,
  value,
  onSave,
  title = 'Edit Source Location',
  placeholder = 'Enter Source Location',
  buttonText = 'Search',
  keyboardType = 'default',
  showIcon = true,
}) => {
  const [localValue, setLocalValue] = useState(value);

  const isDisabled = !localValue && localValue !== 0;
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Input Field */}
          <TextInput
            style={[styles.modalInput, isFocused && styles.focusedInput]}
            value={localValue?.toString() || ''}
            onChangeText={setLocalValue}
            placeholder={placeholder}
            placeholderTextColor="#767b7f"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType={keyboardType}
          />

          {/* Save Button */}
          <TouchableOpacity
            onPress={() => {
              onSave(localValue); // Update parent state only on save
              onClose();
            }}
            style={[styles.buttonWrapper, isDisabled && styles.disabledButton]}
            disabled={isDisabled}>
            <LinearGradient
              colors={['#0175b2', '#4b3d91']}
              style={styles.buttonGradient}>
              <View style={styles.buttonContent}>
                {showIcon ? (
                  <FontAwesome
                    name="search-plus"
                    size={20}
                    color="#fff"
                    style={styles.icon}
                    solid={false}
                  />
                ) : null}
                <Text style={[styles.buttonText, {paddingHorizontal: 0}]}>
                  {buttonText}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    padding: 5,
  },
  modalInput: {
    height: 39,
    textAlignVertical: 'center',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    color: '#383838',
  },
  focusedInput: {
    borderColor: '#1cae97',
  },
  buttonWrapper: {
    marginVertical: 15,
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'UbuntuMedium',
    color: '#fff',
    paddingHorizontal: 12,
    textAlign: 'center',
  },
});

export default StockMoveModal;
