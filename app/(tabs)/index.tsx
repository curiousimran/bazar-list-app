import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Plus, ShoppingCart } from 'lucide-react-native';
import { format } from 'date-fns';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';
import { MarketItem } from '@/components/MarketItem';
import { TimeWatch } from '@/components/TimeWatch';
import { MarketItem as MarketItemType } from '@/types';
import { toBengaliDigits } from '@/constants/Translations';
import { bn } from 'date-fns/locale';

export default function MarketListScreen() {
  const { theme, t, language, currentList, createTodaysList, getTodaysList, addItemToList, updateItemInList, deleteItemFromList, addMarketList } = useApp();
  const colors = getColors(theme);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    // Update current date every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const todaysList = getTodaysList();
  const activeList = currentList || todaysList;

  const handleAddItem = (itemName: string) => {
    let listToUse = activeList;

    if (!listToUse) {
      // If no list exists, create a new one and add the item directly to its items array
      const today = new Date().toISOString().split('T')[0];
      const newList: MarketItemType[] = [];
      const newItem: MarketItemType = {
        id: Date.now().toString(),
        name: itemName,
        purchased: false,
        cost: null,
        createdAt: new Date(),
      };
      // Create the new list with the item already included
      const createdList = {
        id: Date.now().toString(),
        date: today,
        items: [newItem],
        totalCost: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Add the new list to context
      addMarketList(createdList);
      // Optionally, set currentList if needed (context should handle this)
      setNewItemName('');
      return;
    }

    // If list exists, add item as usual
    const newItem: MarketItemType = {
      id: Date.now().toString(),
      name: itemName,
      purchased: false,
      cost: null,
      createdAt: new Date(),
    };
    addItemToList(listToUse.id, newItem);
    setNewItemName('');
  };

  const handleUpdateItem = (itemId: string, updates: Partial<MarketItemType>) => {
    if (activeList) {
      updateItemInList(activeList.id, itemId, updates);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (activeList) {
      deleteItemFromList(activeList.id, itemId);
    }
  };

  const purchasedItems = activeList?.items.filter(item => item.purchased) || [];
  const pendingItems = activeList?.items.filter(item => !item.purchased) || [];

  const handleAddItemInline = () => {
    if (newItemName.trim()) {
      handleAddItem(newItemName.trim());
      setNewItemName('');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 50,
      backgroundColor: colors.primaryContainer,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    headerLeft: {
      flex: 1,
    },
    dateText: {
      fontSize: 17,
      color: colors.onPrimaryContainer,
      fontFamily: 'NotoSansBengali-Regular',
      opacity: 0.8,
    },
    titleText: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.onPrimaryContainer,
      fontFamily: 'NotoSansBengali-Bold',
      marginTop: 4,
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderRadius: 12,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Bold',
      marginTop: 4,
    },
    content: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
      marginLeft: 8,
    },
    sectionCount: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      marginLeft: 8,
    },
    listContainer: {
      paddingVertical: 8,
    },
    addItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      marginTop: 30,
      marginBottom: 16,
      zIndex: 2,
    },
    addItemInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.onSurface,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      fontFamily: 'NotoSansBengali-Regular',
    },
    addItemButton: {
      marginLeft: 8,
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    watermarkText: {
      position: 'absolute',
      top: '45%',
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 40,
      color: colors.onSurfaceVariant,
      opacity: 0.13,
      fontWeight: 'bold',
      zIndex: 0,
      fontFamily: 'NotoSansBengali-Bold',
      pointerEvents: 'none',
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      zIndex: 10,
    },
  });

  // For focusing the input from FAB
  const inputRef = React.useRef<TextInput>(null);
  const handleFabPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.dateText}>
              {language === 'bn'
                ? toBengaliDigits(format(currentDate, 'd MMMM yyyy, EEEE', { locale: bn }))
                : format(currentDate, 'EEEE, MMMM dd, yyyy')}
            </Text>
            <Text style={styles.titleText}>{t('todaysMarket')}</Text>
          </View>
          <TimeWatch />
        </View>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('total')}</Text>
            <Text style={styles.summaryValue}>
              {language === 'bn' 
                ? `৳${toBengaliDigits((activeList?.totalCost ?? 0).toFixed(2))}`
                : `৳${(activeList?.totalCost ?? 0).toFixed(2)}`
              }
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('purchased')}</Text>
            <Text style={styles.summaryValue}>
              {language === 'bn' 
                ? toBengaliDigits(purchasedItems.length)
                : purchasedItems.length
              }
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('pending')}</Text>
            <Text style={styles.summaryValue}>
              {language === 'bn' 
                ? toBengaliDigits(pendingItems.length)
                : pendingItems.length
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Inline Add Item Input - moved below header/summary */}
      <View style={styles.addItemRow}>
        <TextInput
          ref={inputRef}
          style={styles.addItemInput}
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder={t('enterItemName')}
          placeholderTextColor={colors.onSurfaceVariant}
          onSubmitEditing={handleAddItemInline}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addItemButton}
          onPress={handleAddItemInline}
          activeOpacity={0.8}
        >
          <Plus color={colors.onPrimary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Floating Add Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
        activeOpacity={0.8}
      >
        <Plus color={colors.onPrimary} size={32} />
      </TouchableOpacity>

      <FlatList
        style={styles.content}
        data={[
          { type: 'section', title: t('pending'), items: pendingItems },
          { type: 'section', title: t('purchased'), items: purchasedItems },
        ]}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item: section }) => (
          <View>
            {section.items.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionCount}>({section.items.length})</Text>
                </View>
                <FlatList
                  data={section.items}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <MarketItem
                      item={item}
                      listId={activeList?.id ?? ''}
                      onUpdate={handleUpdateItem}
                      onDelete={handleDeleteItem}
                    />
                  )}
                  contentContainerStyle={styles.listContainer}
                />
              </>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* Watermark absolutely positioned in the background */}
            <Text style={styles.watermarkText}>No item added</Text>
            <View style={{alignItems: 'center', zIndex: 1}}>
              <View style={styles.emptyIcon}>
                <ShoppingCart color={colors.onSurfaceVariant} size={64} />
              </View>
              <Text style={styles.emptyTitle}>{t('noItemsYet')}</Text>
              <Text style={styles.emptySubtitle}>{t('tapPlusToAdd')}</Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}