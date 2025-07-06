import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Theme, MarketList, MarketItem } from '@/types';
import { getTranslation } from '@/constants/Translations';

interface AppContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
  marketLists: MarketList[];
  currentList: MarketList | null;
  addMarketList: (list: MarketList) => void;
  updateMarketList: (list: MarketList) => void;
  deleteMarketList: (listId: string) => void;
  getTodaysList: () => MarketList | null;
  getListByDate: (date: string) => MarketList | null;
  createTodaysList: () => MarketList;
  addItemToList: (listId: string, item: MarketItem) => void;
  updateItemInList: (listId: string, itemId: string, updates: Partial<MarketItem>) => void;
  deleteItemFromList: (listId: string, itemId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('light');
  const [marketLists, setMarketLists] = useState<MarketList[]>([]);
  const [currentList, setCurrentList] = useState<MarketList | null>(null);

  // Load saved settings
  useEffect(() => {
    loadSettings();
    loadMarketLists();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      const savedTheme = await AsyncStorage.getItem('theme');
      
      if (savedLanguage) setLanguageState(savedLanguage as Language);
      if (savedTheme) setThemeState(savedTheme as Theme);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadMarketLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem('marketLists');
      if (savedLists) {
        const parsedLists = JSON.parse(savedLists);
        setMarketLists(parsedLists);
        
        // Set current list to today's list if it exists
        const today = new Date().toISOString().split('T')[0];
        const todaysList = parsedLists.find((list: MarketList) => list.date === today);
        setCurrentList(todaysList || null);
      }
    } catch (error) {
      console.error('Error loading market lists:', error);
    }
  };

  const saveMarketLists = async (lists: MarketList[]) => {
    try {
      await AsyncStorage.setItem('marketLists', JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving market lists:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const t = (key: string): string => {
    const translations = getTranslation(language);
    return translations[key as keyof typeof translations] || key;
  };

  const addMarketList = (list: MarketList) => {
    const newLists = [...marketLists, list];
    setMarketLists(newLists);
    saveMarketLists(newLists);
    
    // If it's today's list, set it as current
    const today = new Date().toISOString().split('T')[0];
    if (list.date === today) {
      setCurrentList(list);
    }
  };

  const updateMarketList = (updatedList: MarketList) => {
    const newLists = marketLists.map(list => 
      list.id === updatedList.id ? updatedList : list
    );
    setMarketLists(newLists);
    saveMarketLists(newLists);
    
    // Update current list if it's the one being updated
    if (currentList?.id === updatedList.id) {
      setCurrentList(updatedList);
    }
  };

  const deleteMarketList = (listId: string) => {
    const newLists = marketLists.filter(list => list.id !== listId);
    setMarketLists(newLists);
    saveMarketLists(newLists);
    
    // Clear current list if it's the one being deleted
    if (currentList?.id === listId) {
      setCurrentList(null);
    }
  };

  const getTodaysList = (): MarketList | null => {
    const today = new Date().toISOString().split('T')[0];
    return marketLists.find(list => list.date === today) || null;
  };

  const getListByDate = (date: string): MarketList | null => {
    return marketLists.find(list => list.date === date) || null;
  };

  const createTodaysList = (): MarketList => {
    const today = new Date().toISOString().split('T')[0];
    const newList: MarketList = {
      id: Date.now().toString(),
      date: today,
      items: [],
      totalCost: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    addMarketList(newList);
    return newList;
  };

  const addItemToList = (listId: string, item: MarketItem) => {
    const list = marketLists.find(l => l.id === listId);
    if (list) {
      const updatedList = {
        ...list,
        items: [...list.items, item],
        updatedAt: new Date(),
      };
      updateMarketList(updatedList);
    }
  };

  const updateItemInList = (listId: string, itemId: string, updates: Partial<MarketItem>) => {
    const list = marketLists.find(l => l.id === listId);
    if (list) {
      const updatedItems = list.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      
      const totalCost = updatedItems.reduce((sum, item) => 
        sum + (item.purchased && item.cost ? item.cost : 0), 0
      );
      
      const updatedList = {
        ...list,
        items: updatedItems,
        totalCost,
        updatedAt: new Date(),
      };
      updateMarketList(updatedList);
    }
  };

  const deleteItemFromList = (listId: string, itemId: string) => {
    const list = marketLists.find(l => l.id === listId);
    if (list) {
      const updatedItems = list.items.filter(item => item.id !== itemId);
      const totalCost = updatedItems.reduce((sum, item) => 
        sum + (item.purchased && item.cost ? item.cost : 0), 0
      );
      
      const updatedList = {
        ...list,
        items: updatedItems,
        totalCost,
        updatedAt: new Date(),
      };
      updateMarketList(updatedList);
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        setLanguage,
        setTheme,
        t,
        marketLists,
        currentList,
        addMarketList,
        updateMarketList,
        deleteMarketList,
        getTodaysList,
        getListByDate,
        createTodaysList,
        addItemToList,
        updateItemInList,
        deleteItemFromList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};