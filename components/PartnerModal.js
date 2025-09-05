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

const PartnerModal = ({visible, onClose, partners, onSelectPartner}) => {
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    if (!visible) {
      setSearchText('');
    }
  }, [visible]);

  // Filter partners based on search input
  const filteredPartners = partners
    ? partners.filter(partner =>
        partner.name.toLowerCase().includes(searchText.toLowerCase()),
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
            <Text style={styles.modalTitle}>Select a Partner</Text>
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
              placeholder="Search partner..."
              value={searchText}
              placeholderTextColor="#767b7f"
              onChangeText={setSearchText}
            />
          </View>
          {/* Scrollable List of Partners */}
          {partners && partners.length > 0 ? (
            filteredPartners.length > 0 ? (
              <ScrollView
                style={styles.partnerList}
                keyboardShouldPersistTaps="handled">
                {filteredPartners.map((partner, index) => (
                  <TouchableOpacity
                    key={`${partner.partnerID}-${index}`}
                    style={styles.partnerItem}
                    onPress={() => onSelectPartner(partner)}>
                    <Text style={styles.partnerText}>{partner.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noPartnersFound}>
                <Text style={styles.noPartnersText}>
                  No partners found matching your search
                </Text>
              </View>
            )
          ) : (
            <View style={styles.noPartnersFound}>
              <Text style={styles.noPartnersText}>No partners available</Text>
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
    marginLeft: 10,
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
  partnerList: {
    width: '100%',
  },
  partnerItem: {
    alignItems: 'flex-start',
    paddingVertical: 10,
    width: '100%',
  },
  partnerText: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
  },
  noPartnersFound: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  noPartnersText: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default PartnerModal;
