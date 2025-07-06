import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { format } from 'date-fns';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';

export const TimeWatch: React.FC = () => {
  const { theme } = useApp();
  const colors = getColors(theme);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = format(currentTime, 'h:mm');
  const ampm = format(currentTime, 'a');
  const seconds = format(currentTime, 'ss');

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 24,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    clockIcon: {
      marginRight: 8,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    timeText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Bold',
      letterSpacing: 0.5,
    },
    secondsText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      marginLeft: 2,
      opacity: 0.8,
    },
    ampmText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      marginLeft: 4,
      textTransform: 'uppercase',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.clockIcon}>
        <Clock color={colors.primary} size={18} />
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{timeString}</Text>
        <Text style={styles.secondsText}>:{seconds}</Text>
        <Text style={styles.ampmText}>{ampm}</Text>
      </View>
    </View>
  );
};