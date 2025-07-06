import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Plus, ShoppingCart } from 'lucide-react-native';
import { format } from 'date-fns';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';
import { MarketItem } from '@/components/MarketItem';
import { AddItemModal } from '@/components/AddItemModal';
import { TimeWatch } from '@/components/TimeWatch';
import { MarketItem as MarketItemType } from '@/types';

export default function MarketListScreen() {
  const { theme, t, currentList, createTodaysList, getTodaysList, addItemToList, updateItemInList, deleteItemFromList } = useApp();
  const colors = getColors(theme);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      listToUse = createTodaysList();
    }

    const newItem: MarketItemType = {
      id: Date.now().toString(),
      name: itemName,
      purchased: false,
      cost: null,
      createdAt: new Date(),
    };

    addItemToList(listToUse.id, newItem);
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
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
      fontSize: 14,
      color: colors.onPrimaryContainer,
      fontFamily: 'NotoSansBengali-Regular',
      opacity: 0.8,
    },
    titleText: {
      fontSize: 28,
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
    },
  });

  if (!activeList || activeList.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.dateText}>
                {format(currentDate, 'EEEE, MMMM dd, yyyy')}
              </Text>
              <Text style={styles.titleText}>{t('todaysMarket')}</Text>
            </View>
            <TimeWatch />
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <ShoppingCart color={colors.onSurfaceVariant} size={64} />
          </View>
          <Text style={styles.emptyTitle}>{t('noItemsYet')}</Text>
          <Text style={styles.emptySubtitle}>{t('tapPlusToAdd')}</Text>
        </View>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
        >
          <Plus color={colors.onPrimary} size={24} />
        </TouchableOpacity>

        <AddItemModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.dateText}>
              {format(currentDate, 'EEEE, MMMM dd, yyyy')}
            </Text>
            <Text style={styles.titleText}>{t('todaysMarket')}</Text>
          </View>
          <TimeWatch />
        </View>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('total')}</Text>
            <Text style={styles.summaryValue}>
              ৳{activeList.totalCost.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('purchased')}</Text>
            <Text style={styles.summaryValue}>
              {purchasedItems.length}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('pending')}</Text>
            <Text style={styles.summaryValue}>
              {pendingItems.length}
            </Text>
          </View>
        </View>
      </View>

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
                      listId={activeList.id}
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
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Plus color={colors.onPrimary} size={24} />
      </TouchableOpacity>

      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </SafeAreaView>
  );
}