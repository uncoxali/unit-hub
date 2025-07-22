import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../components/Themed';

export default function ModalScreen() {
  const { colors } = useTheme();

  return (
    <Modal animationType='slide' transparent={true}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.modalText, { color: colors.text.primary }]}>
            This is a modal example!
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary[500] }]}
            onPress={() => {}}
          >
            <Text style={[styles.textStyle, { color: colors.text.inverse }]}>Hide Modal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
