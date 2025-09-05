import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LocationModal = ({visible, onClose, locations, onSelectLocation}) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!visible) {
      setSearchText('');
    }
  }, [visible]);

  // Filter locations based on search input
  const filteredLocations = locations
    ? locations.filter(location =>
        location.locationName.toLowerCase().includes(searchText.toLowerCase()),
      )
    : [];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Select a Location</Text>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Input with Icon */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="gray"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Locations..."
              value={searchText}
              placeholderTextColor="#767b7f"
              onChangeText={setSearchText}
            />
          </View>

          {/* Scrollable List of Locations */}
          {locations && locations.length > 0 ? (
            filteredLocations.length > 0 ? (
              <ScrollView
                style={styles.locationList}
                keyboardShouldPersistTaps="handled">
                {filteredLocations.map((location, index) => (
                  <TouchableOpacity
                    key={`${location.stationID}-${index}`}
                    style={styles.locationItem}
                    onPress={() => onSelectLocation(location)}>
                    <Text style={styles.locationText}>
                      {location.locationName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noLocationsFound}>
                <Text style={styles.noLocationsText}>
                  No locations found matching your search
                </Text>
              </View>
            )
          ) : (
            <View style={styles.noLocationsFound}>
              <Text style={styles.noLocationsText}>No locations available</Text>
            </View>
          )}
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'black',
  },
  closeIcon: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  searchInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'black',
    flex: 1,
    height: 40,
  },
  locationList: {
    width: '100%',
  },
  locationItem: {
    alignItems: 'flex-start',
    paddingVertical: 10,
    width: '100%',
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
  },
  noLocationsFound: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  noLocationsText: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LocationModal;
