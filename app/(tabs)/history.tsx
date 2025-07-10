import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, Share, Modal, ScrollView } from 'react-native';
import { Calendar, TrendingUp, Download, FileText, Image } from 'lucide-react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';
import { MarketList } from '@/types';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface DateRange {
  start: Date;
  end: Date;
}

export default function HistoryScreen() {
  const { theme, t, marketLists } = useApp();
  const colors = getColors(theme);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [detailList, setDetailList] = useState<MarketList | null>(null);

  // Calculate monthly summary
  const monthlyData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    const monthLists = marketLists.filter(list => {
      const listDate = new Date(list.date);
      return listDate >= monthStart && listDate <= monthEnd;
    });

    const totalExpense = monthLists.reduce((sum, list) => sum + list.totalCost, 0);
    const totalDays = monthLists.length;
    const totalItems = monthLists.reduce((sum, list) => sum + list.items.length, 0);
    
    return {
      totalExpense,
      totalDays,
      totalItems,
      averageDaily: totalDays > 0 ? totalExpense / totalDays : 0,
      lists: monthLists.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  }, [marketLists, selectedDate]);

  // Get daily data for selected date
  const dailyData = useMemo(() => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    return marketLists.find(list => list.date === dateString);
  }, [marketLists, selectedDate]);

  // Ref for summary view
  const summaryRef = React.useRef(null);

  const handleExportPDF = async () => {
    // Simple HTML table for monthly summary
    const html = `
      <html><body>
        <h2>${t('monthlyTotal')}</h2>
        <table border="1" style="border-collapse:collapse;width:100%">
          <tr><th>${t('totalExpense')}</th><th>Days</th><th>Items</th><th>Daily Avg</th></tr>
          <tr>
            <td>৳${monthlyData.totalExpense.toFixed(2)}</td>
            <td>${monthlyData.totalDays}</td>
            <td>${monthlyData.totalItems}</td>
            <td>৳${monthlyData.averageDaily.toFixed(0)}</td>
          </tr>
        </table>
      </body></html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
    } catch (e) {
      const err = e as Error;
      Alert.alert(t('exportError'), err.message);
    }
  };

  const handleExportImage = async () => {
    try {
      if (!summaryRef.current) return;
      const uri = await captureRef(summaryRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png' });
    } catch (e) {
      const err = e as Error;
      Alert.alert(t('exportError'), err.message);
    }
  };

  const renderListItem = ({ item }: { item: MarketList }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setDetailList(item);
        setShowDayDetail(true);
      }}
    >
      <View style={styles.listItemHeader}>
        <Text style={styles.listItemDate}>
          {format(new Date(item.date), 'MMM dd, yyyy')}
        </Text>
        <Text style={styles.listItemCost}>
          ৳{item.totalCost.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.listItemInfo}>
        {item.items.length} items • {item.items.filter(i => i.purchased).length} purchased
      </Text>
    </TouchableOpacity>
  );

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
    titleText: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.onPrimaryContainer,
      fontFamily: 'NotoSansBengali-Bold',
    },
    content: {
      flex: 1,
    },
    summaryContainer: {
      margin: 16,
      padding: 20,
      backgroundColor: colors.surface,
      borderRadius: 16,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
    },
    monthSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryContainer,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    monthText: {
      fontSize: 14,
      color: colors.onPrimaryContainer,
      fontFamily: 'NotoSansBengali-Regular',
      marginLeft: 8,
    },
    summaryGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    summaryItem: {
      alignItems: 'center',
      flex: 1,
    },
    summaryLabel: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Bold',
      marginTop: 4,
    },
    exportContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    exportButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.tertiary,
      borderRadius: 8,
      gap: 6,
    },
    exportButtonText: {
      fontSize: 12,
      color: colors.onTertiary,
      fontFamily: 'NotoSansBengali-Regular',
      fontWeight: '600',
    },
    dailyContainer: {
      margin: 16,
      marginTop: 0,
      padding: 20,
      backgroundColor: colors.surface,
      borderRadius: 16,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    dailyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    dailyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
    },
    dailyDate: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
    },
    dailyInfo: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Bold',
      textAlign: 'center',
    },
    noDailyData: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'center',
      fontStyle: 'italic',
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
    listItem: {
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 4,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    listItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    listItemDate: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Regular',
    },
    listItemCost: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Bold',
    },
    listItemInfo: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>{t('expenseHistory')}</Text>
      </View>

      <FlatList
        style={styles.content}
        data={[]}
        keyExtractor={(item, index) => `header-${index}`}
        renderItem={() => null}
        ListHeaderComponent={
          <View>
            {/* Monthly Summary */}
            <View style={styles.summaryContainer} ref={summaryRef} collapsable={false}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>{t('monthlyTotal')}</Text>
                <TouchableOpacity style={styles.monthSelector}>
                  <Calendar color={colors.onPrimaryContainer} size={16} />
                  <Text style={styles.monthText}>
                    {format(selectedDate, 'MMMM yyyy')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{t('totalExpense')}</Text>
                  <Text style={styles.summaryValue}>
                    ৳{monthlyData.totalExpense.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Days</Text>
                  <Text style={styles.summaryValue}>
                    {monthlyData.totalDays}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Items</Text>
                  <Text style={styles.summaryValue}>
                    {monthlyData.totalItems}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Daily Avg</Text>
                  <Text style={styles.summaryValue}>
                    ৳{monthlyData.averageDaily.toFixed(0)}
                  </Text>
                </View>
              </View>

              <View style={styles.exportContainer}>
                <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
                  <FileText color={colors.onTertiary} size={16} />
                  <Text style={styles.exportButtonText}>{t('exportPDF')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportButton} onPress={handleExportImage}>
                  <Image color={colors.onTertiary} size={16} />
                  <Text style={styles.exportButtonText}>{t('exportImage')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Daily Summary */}
            <View style={styles.dailyContainer}>
              <View style={styles.dailyHeader}>
                <Text style={styles.dailyTitle}>{t('dailyTotal')}</Text>
                <Text style={styles.dailyDate}>
                  {format(selectedDate, 'MMM dd, yyyy')}
                </Text>
              </View>
              {dailyData ? (
                <Text style={styles.dailyInfo}>
                  ৳{dailyData.totalCost.toFixed(2)} • {dailyData.items.length} items
                </Text>
              ) : (
                <Text style={styles.noDailyData}>{t('noExpenseData')}</Text>
              )}
            </View>

            {/* Section Header */}
            {monthlyData.lists.length > 0 && (
              <View style={styles.sectionHeader}>
                <TrendingUp color={colors.onSurface} size={20} />
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          monthlyData.lists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('noExpenseData')}</Text>
            </View>
          ) : null
        }
      />

      {/* Monthly Lists */}
      {monthlyData.lists.length > 0 && (
        <FlatList
          style={{ maxHeight: 300 }}
          data={monthlyData.lists}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Day Detail Modal */}
      <Modal visible={showDayDetail} animationType="slide" onRequestClose={() => setShowDayDetail(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 16 }}>
            {detailList ? format(new Date(detailList.date), 'MMM dd, yyyy') : ''}
          </Text>
          <ScrollView>
            {detailList?.items.map(item => (
              <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: colors.outlineVariant }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  <Text>{item.purchased ? 'Bought' : 'Not bought'}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 12 }}>৳{item.cost !== null ? item.cost.toFixed(2) : '--'}</Text>
              </View>
            ))}
            {detailList?.items.length === 0 && (
              <Text style={{ padding: 16, color: colors.onSurfaceVariant }}>{t('noItemsYet')}</Text>
            )}
          </ScrollView>
          {/* Total at the bottom */}
          {detailList && detailList.items.length > 0 && (
            <View style={{ padding: 16, borderTopWidth: 1, borderColor: colors.outlineVariant, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{t('total') ?? 'Total'}:</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>
                ৳{detailList.items.reduce((sum, item) => sum + (item.cost || 0), 0).toFixed(2)}
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setShowDayDetail(false)} style={{ margin: 16 }}>
            <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>{t('close') ?? 'Close'}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}