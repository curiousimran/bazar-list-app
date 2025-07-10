import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, Image } from 'react-native';
import { Globe, Moon, Sun, Info, User } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getColors } from '@/constants/Colors';

export default function SettingsScreen() {
  const { theme, language, setTheme, setLanguage, t } = useApp();
  const colors = getColors(theme);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement && (
        <View style={styles.settingRight}>
          {rightElement}
        </View>
      )}
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
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Bold',
      marginBottom: 16,
      marginLeft: 4,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 8,
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Regular',
    },
    settingSubtitle: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      marginTop: 2,
    },
    settingRight: {
      marginLeft: 16,
    },
    languageButton: {
      backgroundColor: colors.primaryContainer,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    languageButtonText: {
      fontSize: 14,
      color: colors.onPrimaryContainer,
      fontFamily: 'NotoSansBengali-Regular',
      fontWeight: '600',
    },
    aboutContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginTop: 20,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    aboutTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    aboutText: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      lineHeight: 20,
      marginBottom: 8,
      textAlign: 'center',
    },
    developerSection: {
      alignItems: 'center',
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant,
      paddingBottom: 24,
    },
    developerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      fontFamily: 'NotoSansBengali-Bold',
      marginBottom: 12,
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 12,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 8,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    developerName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onSurface,
      fontFamily: 'NotoSansBengali-Bold',
      textAlign: 'center',
    },
    developerRole: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      textAlign: 'center',
      marginTop: 4,
    },
    versionText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      fontFamily: 'NotoSansBengali-Regular',
      marginTop: 16,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>{t('settings')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <SettingItem
            icon={theme === 'light' ? <Sun color={colors.onSurface} size={24} /> : <Moon color={colors.onSurface} size={24} />}
            title={t('darkMode')}
            subtitle={theme === 'light' ? 'Light mode' : 'Dark mode'}
            rightElement={
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.outline, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
          />

          <SettingItem
            icon={<Globe color={colors.onSurface} size={24} />}
            title={t('language')}
            subtitle={language === 'en' ? 'English' : 'বাংলা'}
            onPress={toggleLanguage}
            rightElement={
              <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                <Text style={styles.languageButtonText}>
                  {language === 'en' ? 'বাংলা' : 'English'}
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          
          <SettingItem
            icon={<Info color={colors.onSurface} size={24} />}
            title={t('about')}
            subtitle={t('version') + ' 1.0.0'}
          />
        </View>

        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>
            {language === 'en' ? 'Daily Market List' : 'বাজারের লিস্ট'}
          </Text>
          <Text style={styles.aboutText}>
            {language === 'en' 
              ? 'A simple and efficient app to manage your daily market shopping and track expenses.'
              : 'আপনার দৈনিক বাজারের কেনাকাটা এবং খরচ ট্র্যাক করার জন্য একটি সহজ এবং দক্ষ অ্যাপ।'
            }
          </Text>
          <Text style={styles.aboutText}>
            {language === 'en'
              ? 'Features include item management, expense tracking, history viewing, and data export.'
              : 'বৈশিষ্ট্যগুলির মধ্যে রয়েছে আইটেম ম্যানেজমেন্ট, খরচ ট্র্যাকিং, ইতিহাস দেখা এবং ডেটা এক্সপোর্ট।'
            }
          </Text>

          <View style={styles.developerSection}>
            <Text style={styles.developerTitle}>
              {language === 'en' ? 'Developed by' : 'ডেভেলপ করেছেন'}
            </Text>
            <View style={styles.profileContainer}>
              <Image
                source={require('@/assets/images/imranpic.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <Text style={styles.developerName}>Muhammad Imran</Text>
              <Text style={styles.developerRole}>
                {language === 'en' ? 'Mobile App Developer' : 'মোবাইল অ্যাপ ডেভেলপার'}
              </Text>
              <Text style={{ fontSize: 14, color: colors.primary, fontFamily: 'NotoSansBengali-Regular', textAlign: 'center', marginTop: 4 }}>
                curiousimran@gmail.com
              </Text>
            </View>
          </View>

          <Text style={styles.versionText}>
            {t('version')} 1.0.0 • Built with React Native & Expo
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}