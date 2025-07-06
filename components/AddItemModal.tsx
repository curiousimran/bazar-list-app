import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (itemName: string) => void;
}

export const AddItemModal: React.FC<Props> = ({ visible, onClose, onAdd }) => {
  const { theme, t } = useApp();
  const colors = getColors(theme);
  const [itemName, setItemName] = useState('');

  const handleAdd = () => {
    if (itemName.trim()) {
      onAdd(itemName.trim());
      setItemName('');
      onClose();
    } else {
      Alert.alert(t('error'), t('enterItemName'));
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      elevation: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
    },
    closeButton: {
      padding: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.onSurface,
      backgroundColor: colors.surface,
      fontFamily: 'NotoSansBengali-Regular',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      gap: 8,
    },
    addButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.surfaceVariant,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'NotoSansBengali-Regular',
    },
    addButtonText: {
      color: colors.onPrimary,
    },
    cancelButtonText: {
      color: colors.onSurfaceVariant,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('addNewItem')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={colors.onSurfaceVariant} size={24} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={itemName}
            onChangeText={setItemName}
            placeholder={t('enterItemName')}
            placeholderTextColor={colors.onSurfaceVariant}
            autoFocus
            onSubmitEditing={handleAdd}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAdd}
            >
              <Plus color={colors.onPrimary} size={20} />
              <Text style={[styles.buttonText, styles.addButtonText]}>
                {t('add')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};