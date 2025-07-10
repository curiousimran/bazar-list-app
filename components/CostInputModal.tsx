import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { DollarSign, Check, X } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';

interface Props {
  visible: boolean;
  itemName: string;
  onClose: () => void;
  onSave: (cost: number) => void;
}

export const CostInputModal: React.FC<Props> = ({ visible, itemName, onClose, onSave }) => {
  const { theme, t } = useApp();
  const colors = getColors(theme);
  const [costInput, setCostInput] = useState('');
  const [error, setError] = useState('');
  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setCostInput('');
      setError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const handleSave = () => {
    const cost = parseFloat(costInput);
    if (isNaN(cost) || cost < 0) {
      setError(t('enterValidCost'));
      return;
    }
    onSave(cost);
    onClose();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      elevation: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    icon: {
      marginBottom: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    itemName: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'center',
      fontWeight: '600',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: error ? colors.error : colors.outline,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },
    currencySymbol: {
      fontSize: 18,
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
      paddingLeft: 16,
    },
    input: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 16,
      fontSize: 18,
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Regular',
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      fontFamily: 'NotoSansBengali-Regular',
      marginTop: 4,
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
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      gap: 8,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'NotoSansBengali-Regular',
    },
    saveButtonText: {
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
            <View style={styles.icon}>
              <DollarSign color={colors.primary} size={32} />
            </View>
            <Text style={styles.title}>{t('enterCost')}</Text>
            <Text style={styles.itemName}>"{itemName}"</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('costAmount')}</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>৳</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={costInput}
                onChangeText={(text) => {
                  setCostInput(text);
                  setError('');
                }}
                placeholder="0.00"
                placeholderTextColor={colors.onSurfaceVariant}
                keyboardType="numeric"
                onSubmitEditing={handleSave}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(onClose, 50);
              }}
            >
              <X color={colors.onSurfaceVariant} size={20} />
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(handleSave, 50);
              }}
            >
              <Check color={colors.onPrimary} size={20} />
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {t('save')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};