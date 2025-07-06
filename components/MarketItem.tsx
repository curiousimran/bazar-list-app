import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Check, X, Trash2, ShoppingBag } from 'lucide-react-native';
import { MarketItem as MarketItemType } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';
import { CostInputModal } from './CostInputModal';

interface Props {
  item: MarketItemType;
  listId: string;
  onUpdate: (itemId: string, updates: Partial<MarketItemType>) => void;
  onDelete: (itemId: string) => void;
}

export const MarketItem: React.FC<Props> = ({ item, listId, onUpdate, onDelete }) => {
  const { theme, t } = useApp();
  const colors = getColors(theme);
  const [showCostModal, setShowCostModal] = useState(false);

  const handleMarkPurchased = () => {
    if (item.purchased) {
      // If already purchased, toggle back to unpurchased
      onUpdate(item.id, { purchased: false, cost: null });
    } else {
      // Show cost input modal
      setShowCostModal(true);
    }
  };

  const handleSaveCost = (cost: number) => {
    onUpdate(item.id, { purchased: true, cost });
    setShowCostModal(false);
  };

  const handleDelete = () => {
    Alert.alert(
      t('delete'),
      `${t('deleteConfirm')} "${item.name}"?`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => onDelete(item.id) },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 4,
      backgroundColor: item.purchased ? colors.primaryContainer : colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: item.purchased ? colors.primary : colors.outlineVariant,
      elevation: item.purchased ? 3 : 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: item.purchased ? 2 : 1 },
      shadowOpacity: item.purchased ? 0.15 : 0.1,
      shadowRadius: item.purchased ? 4 : 2,
    },
    content: {
      flex: 1,
      marginLeft: 12,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: item.purchased ? colors.onPrimaryContainer : colors.onSurface,
      fontFamily: 'NotoSansBengali-Regular',
      textDecorationLine: item.purchased ? 'line-through' : 'none',
      opacity: item.purchased ? 0.8 : 1,
    },
    costContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    costText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '700',
      fontFamily: 'NotoSansBengali-Bold',
      marginLeft: 4,
    },
    actionButton: {
      padding: 10,
      borderRadius: 12,
      marginLeft: 8,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    purchaseButton: {
      backgroundColor: item.purchased ? colors.tertiary : colors.primary,
    },
    deleteButton: {
      backgroundColor: colors.errorContainer,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.actionButton, styles.purchaseButton]}
          onPress={handleMarkPurchased}
        >
          {item.purchased ? (
            <X color={colors.onTertiary} size={20} />
          ) : (
            <Check color={colors.onPrimary} size={20} />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.itemName}>{item.name}</Text>
          
          {item.purchased && item.cost !== null && (
            <View style={styles.costContainer}>
              <ShoppingBag color={colors.primary} size={14} />
              <Text style={styles.costText}>
                ৳{item.cost.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Trash2 color={colors.onErrorContainer} size={18} />
        </TouchableOpacity>
      </View>

      <CostInputModal
        visible={showCostModal}
        itemName={item.name}
        onClose={() => setShowCostModal(false)}
        onSave={handleSaveCost}
      />
    </>
  );
};