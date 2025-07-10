import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, ScrollView, FlatList } from 'react-native';
import { Delete } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';
import { format } from 'date-fns';
import { MarketList } from '@/types';
import { toBengaliDigits } from '@/constants/Translations';
import { bn } from 'date-fns/locale';

export default function CalculatorScreen() {
  const { theme, t, language } = useApp();
  const colors = getColors(theme);
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string>('');
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [detailList, setDetailList] = useState<MarketList | null>(null);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHistory('');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setHistory(`${inputValue} ${nextOperation}`);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const result = calculate(currentValue, inputValue, operation);

      setDisplay(String(result));
      setPreviousValue(result);
      setHistory(`${currentValue} ${operation} ${inputValue} = ${result}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setHistory(`${previousValue} ${operation} ${inputValue}`);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const Button = ({ 
    onPress, 
    title, 
    style, 
    textStyle,
    icon
  }: { 
    onPress: () => void;
    title?: string;
    style?: any;
    textStyle?: any;
    icon?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon ? icon : <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    calculatorCard: {
      margin: 20,
      borderRadius: 32,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
      overflow: 'hidden',
    },
    header: {
      padding: 24,
      backgroundColor: colors.primaryContainer,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
    titleText: {
      fontSize: 40,
      fontWeight: '800',
      color: colors.onPrimaryContainer,
      fontFamily: 'NotoSansBengali-Bold',
      letterSpacing: 1.2,
    },
    displayContainer: {
      margin: 20,
      marginBottom: 0,
      padding: 24,
      borderRadius: 24,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1.5,
      borderColor: colors.primaryContainer,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      minHeight: 120,
    },
    historyText: {
      fontSize: 30,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'right',
      marginBottom: 8,
      opacity: 0.8,
      minHeight: 20,
    },
    display: {
      fontSize: 75,
      fontWeight: '700',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
      textAlign: 'right',
      minHeight: 64,
      letterSpacing: 1.2,
    },
    operationIndicator: {
      fontSize: 22,
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'right',
      marginTop: 4,
      minHeight: 24,
    },
    buttonContainer: {
      padding: 20,
      backgroundColor: 'transparent',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    button: {
      width: 76,
      height: 76,
      borderRadius: 38,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      marginHorizontal: 2,
    },
    buttonText: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Bold',
    },
    operatorButton: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.18,
      shadowRadius: 8,
    },
    operatorButtonText: {
      color: colors.onPrimary,
      fontWeight: '800',
    },
    clearButton: {
      backgroundColor: colors.error,
      shadowColor: colors.error,
      shadowOpacity: 0.18,
      shadowRadius: 8,
    },
    clearButtonText: {
      color: colors.onError,
      fontWeight: '800',
    },
    equalsButton: {
      backgroundColor: colors.tertiary,
      shadowColor: colors.tertiary,
      shadowOpacity: 0.18,
      shadowRadius: 8,
    },
    equalsButtonText: {
      color: colors.onTertiary,
      fontWeight: '800',
    },
    zeroButton: {
      width: 160,
      borderRadius: 38,
    },
    backspaceButton: {
      backgroundColor: colors.secondary,
      shadowColor: colors.secondary,
      shadowOpacity: 0.18,
      shadowRadius: 8,
    },
    backspaceButtonText: {
      color: colors.onSecondary,
      fontWeight: '800',
    },
    listItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderColor: colors.outlineVariant,
    },
    smallText: { fontSize: 40 },
    largeText: { fontSize: 100 },
  });

  const renderListItem = ({ item }: { item: MarketList }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setDetailList(item);
        setShowDayDetail(true);
      }}
    >
      {/* ...existing code... */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calculatorCard}>
        <View style={styles.header}>
          <Text style={styles.titleText}>{t('calculator')}</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.historyText}>
            {language === 'bn' ? toBengaliDigits(history) : history}
          </Text>
          <Text style={styles.display}>
            {language === 'bn' ? toBengaliDigits(display) : display}
          </Text>
       
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <Button
              title={t('clear')}
              onPress={clear}
              style={styles.clearButton}
              textStyle={[styles.clearButtonText, { fontSize: 18 }]}
            />
            <Button
              onPress={handleBackspace}
              style={styles.backspaceButton}
              icon={<Delete color={colors.onSecondary} size={26} />}
            />
            <Button
              title="%"
              onPress={() => {
                const value = parseFloat(display);
                setDisplay(String(value / 100));
              }}
              textStyle={styles.buttonText}
            />
            <Button
              title="÷"
              onPress={() => performOperation('÷')}
              style={styles.operatorButton}
              textStyle={styles.operatorButtonText}
            />
          </View>

          <View style={styles.buttonRow}>
            <Button title={language === 'bn' ? toBengaliDigits('7') : '7'} onPress={() => inputNumber('7')} textStyle={styles.buttonText} />
            <Button title={language === 'bn' ? toBengaliDigits('8') : '8'} onPress={() => inputNumber('8')} textStyle={styles.buttonText} />
            <Button title={language === 'bn' ? toBengaliDigits('9') : '9'} onPress={() => inputNumber('9')} textStyle={styles.buttonText} />
            <Button title="×" onPress={() => performOperation('×')} style={styles.operatorButton} textStyle={styles.operatorButtonText} />
          </View>

          <View style={styles.buttonRow}>
            <Button title={language === 'bn' ? toBengaliDigits('4') : '4'} onPress={() => inputNumber('4')} textStyle={styles.buttonText} />
            <Button title={language === 'bn' ? toBengaliDigits('5') : '5'} onPress={() => inputNumber('5')} textStyle={styles.buttonText} />
            <Button title={language === 'bn' ? toBengaliDigits('6') : '6'} onPress={() => inputNumber('6')} textStyle={styles.buttonText} />
            <Button title="−" onPress={() => performOperation('-')} style={styles.operatorButton} textStyle={styles.operatorButtonText} />
          </View>

          <View style={styles.buttonRow}>
            <Button title={language === 'bn' ? toBengaliDigits('1') : '1'} onPress={() => inputNumber('1')} textStyle={styles.buttonText} />
            <Button title={language === 'bn' ? toBengaliDigits('2') : '2'} onPress={() => inputNumber('2')} textStyle={styles.buttonText} />
            <Button title={language === 'bn' ? toBengaliDigits('3') : '3'} onPress={() => inputNumber('3')} textStyle={styles.buttonText} />
            <Button title="+" onPress={() => performOperation('+')} style={styles.operatorButton} textStyle={styles.operatorButtonText} />
          </View>

          <View style={styles.buttonRow}>
            <Button
              title={language === 'bn' ? toBengaliDigits('0') : '0'}
              onPress={() => inputNumber('0')}
              style={styles.zeroButton}
              textStyle={styles.buttonText}
            />
            <Button title="." onPress={inputDecimal} textStyle={styles.buttonText} />
            <Button
              title="="
              onPress={handleEquals}
              style={styles.equalsButton}
              textStyle={styles.equalsButtonText}
            />
          </View>
        </View>
      </View>

      <Modal visible={showDayDetail} animationType="slide" onRequestClose={() => setShowDayDetail(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 16 }}>
            {detailList ? toBengaliDigits(format(new Date(detailList.date), 'MMM dd, yyyy')) : ''}
          </Text>
          <ScrollView>
            {detailList?.items.map(item => (
              <View key={item.id} style={{ padding: 16, borderBottomWidth: 1, borderColor: colors.outlineVariant }}>
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                <Text>
                  {language === 'bn' ? toBengaliDigits(item.cost?.toFixed(2) ?? '--') : item.cost?.toFixed(2) ?? '--'} ৳
                </Text>
                <Text>{item.purchased ? 'Bought' : 'Not bought'}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => {
            setTimeout(() => setShowDayDetail(false), 50);
          }} style={{ margin: 16 }}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{t('close') ?? 'Close'}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}