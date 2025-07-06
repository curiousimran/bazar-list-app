import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Delete } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';

export default function CalculatorScreen() {
  const { theme, t } = useApp();
  const colors = getColors(theme);
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string>('');

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
      setHistory(`${previousValue} ${operation} ${inputValue} = ${result}`);
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
    displayContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 20,
      backgroundColor: colors.surface,
      minHeight: 180,
    },
    historyText: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'right',
      marginBottom: 8,
      opacity: 0.7,
      minHeight: 20,
    },
    display: {
      fontSize: 48,
      fontWeight: '300',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'right',
      minHeight: 60,
    },
    operationIndicator: {
      fontSize: 20,
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'right',
      marginTop: 4,
      minHeight: 24,
    },
    buttonContainer: {
      padding: 20,
      backgroundColor: colors.background,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    button: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buttonText: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
    },
    operatorButton: {
      backgroundColor: colors.primary,
    },
    operatorButtonText: {
      color: colors.onPrimary,
    },
    clearButton: {
      backgroundColor: colors.error,
    },
    clearButtonText: {
      color: colors.onError,
    },
    equalsButton: {
      backgroundColor: colors.tertiary,
    },
    equalsButtonText: {
      color: colors.onTertiary,
    },
    zeroButton: {
      width: 156,
      borderRadius: 35,
    },
    backspaceButton: {
      backgroundColor: colors.secondary,
    },
    backspaceButtonText: {
      color: colors.onSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>{t('calculator')}</Text>
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.historyText}>{history}</Text>
        <Text style={styles.display}>{display}</Text>
        <Text style={styles.operationIndicator}>
          {operation && previousValue !== null ? `${previousValue} ${operation}` : ''}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Button
            title={t('clear')}
            onPress={clear}
            style={styles.clearButton}
            textStyle={[styles.clearButtonText, { fontSize: 16 }]}
          />
          <Button
            onPress={handleBackspace}
            style={styles.backspaceButton}
            icon={<Delete color={colors.onSecondary} size={20} />}
          />
          <Button
            title="%"
            onPress={() => {
              const value = parseFloat(display);
              setDisplay(String(value / 100));
            }}
          />
          <Button
            title="÷"
            onPress={() => performOperation('÷')}
            style={styles.operatorButton}
            textStyle={styles.operatorButtonText}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button title="7" onPress={() => inputNumber('7')} />
          <Button title="8" onPress={() => inputNumber('8')} />
          <Button title="9" onPress={() => inputNumber('9')} />
          <Button
            title="×"
            onPress={() => performOperation('×')}
            style={styles.operatorButton}
            textStyle={styles.operatorButtonText}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button title="4" onPress={() => inputNumber('4')} />
          <Button title="5" onPress={() => inputNumber('5')} />
          <Button title="6" onPress={() => inputNumber('6')} />
          <Button
            title="−"
            onPress={() => performOperation('-')}
            style={styles.operatorButton}
            textStyle={styles.operatorButtonText}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button title="1" onPress={() => inputNumber('1')} />
          <Button title="2" onPress={() => inputNumber('2')} />
          <Button title="3" onPress={() => inputNumber('3')} />
          <Button
            title="+"
            onPress={() => performOperation('+')}
            style={styles.operatorButton}
            textStyle={styles.operatorButtonText}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button
            title="0"
            onPress={() => inputNumber('0')}
            style={styles.zeroButton}
          />
          <Button title="." onPress={inputDecimal} />
          <Button
            title="="
            onPress={handleEquals}
            style={styles.equalsButton}
            textStyle={styles.equalsButtonText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}