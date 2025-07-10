export const translations = {
  en: {
    // Navigation
    marketList: 'Market List',
    history: 'History',
    settings: 'Settings',
    calculator: 'Calculator',
    
    // Market List
    todaysMarket: "Today's Market",
    addNewItem: 'Add New Item',
    enterItemName: 'Enter item name',
    add: 'Add',
    markAsPurchased: 'Mark as Purchased',
    enterCost: 'Enter Cost',
    costAmount: 'Cost Amount',
    cost: 'Cost',
    total: 'Total',
    purchased: 'Purchased',
    pending: 'Pending',
    noItemsYet: 'No items added yet',
    tapPlusToAdd: 'Tap the + button to add items',
    enterValidCost: 'Please enter a valid cost',
    confirmZeroCost: 'Confirm Zero Cost',
    areYouSureZeroCost: 'Are you sure the cost is ৳0.00?',
    deleteConfirm: 'Are you sure you want to delete',
    
    // History
    expenseHistory: 'Expense History',
    selectDate: 'Select Date',
    monthlyTotal: 'Monthly Total',
    dailyTotal: 'Daily Total',
    totalExpense: 'Total Expense',
    noExpenseData: 'No expense data',
    exportPDF: 'Export PDF',
    exportImage: 'Export Image',
    
    // Settings
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    about: 'About',
    version: 'Version',
    
    // Calculator
    clear: 'Clear',
    equals: 'Equals',
    
    // Common
    ok: 'OK',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    done: 'Done',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    retry: 'Retry',
    yes: 'Yes',
    no: 'No',
    
    // Date & Time
    today: 'Today',
    yesterday: 'Yesterday',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    
    // Messages
    itemAdded: 'Item added successfully',
    itemPurchased: 'Item marked as purchased',
    exportSuccess: 'Export successful',
    exportError: 'Export failed',
    deletionSuccess: 'Item deleted successfully',
    clearList: 'Clear List',
    clearListConfirm: 'Are you sure you want to clear all items from this list?',
    listCleared: 'List cleared successfully',
  },
  bn: {
    // Navigation
    marketList: 'বাজারের লিস্ট',
    history: 'হিসাব',
    settings: 'সেটিংস',
    calculator: 'ক্যালকুলেটর',
    
    // Market List
    todaysMarket: "আজকের বাজার",
    addNewItem: 'নতুন আইটেম যোগ করুন',
    enterItemName: 'আইটেমের নাম লিখুন',
    add: 'যোগ করুন',
    markAsPurchased: 'কেনা হয়েছে',
    enterCost: 'দাম লিখুন',
    costAmount: 'দামের পরিমাণ',
    cost: 'দাম',
    total: 'মোট',
    purchased: 'কেনা হয়েছে',
    pending: 'বাকি',
    noItemsYet: 'এখনো কোনো আইটেম যোগ করা হয়নি',
    tapPlusToAdd: 'আইটেম যোগ করতে + বাটনে ট্যাপ করুন',
    enterValidCost: 'দয়া করে সঠিক দাম লিখুন',
    confirmZeroCost: 'শূন্য দাম নিশ্চিত করুন',
    areYouSureZeroCost: 'আপনি কি নিশ্চিত যে দাম ৳০.০০?',
    deleteConfirm: 'আপনি কি আসলেই মুছে ফেলতে চান',
    
    // History
    expenseHistory: 'খরচের হিসাব',
    selectDate: 'তারিখ নির্বাচন করুন',
    monthlyTotal: 'মাসিক মোট',
    dailyTotal: 'দৈনিক মোট',
    totalExpense: 'মোট খরচ',
    noExpenseData: 'কোনো খরচের তথ্য নেই',
    exportPDF: 'PDF এক্সপোর্ট',
    exportImage: 'ছবি এক্সপোর্ট',
    
    // Settings
    language: 'ভাষা',
    theme: 'থিম',
    darkMode: 'ডার্ক মোড',
    about: 'সম্পর্কে',
    version: 'সংস্করণ',
    
    // Calculator
    clear: 'পরিষ্কার',
    equals: 'সমান',
    
    // Common
    ok: 'ঠিক আছে',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ',
    delete: 'মুছে ফেলুন',
    edit: 'সম্পাদনা করুন',
    update: 'আপডেট',
    done: 'শেষ',
    error: 'ত্রুটি',
    success: 'সফল',
    loading: 'লোড হচ্ছে...',
    retry: 'আবার চেষ্টা করুন',
    yes: 'হ্যাঁ',
    no: 'না',
    
    // Date & Time
    today: 'আজ',
    yesterday: 'গতকাল',
    thisMonth: 'এই মাস',
    lastMonth: 'গত মাস',
    
    // Messages
    itemAdded: 'আইটেম সফলভাবে যোগ করা হয়েছে',
    itemPurchased: 'আইটেম কেনা হয়েছে হিসেবে চিহ্নিত',
    exportSuccess: 'এক্সপোর্ট সফল',
    exportError: 'এক্সপোর্ট ব্যর্থ',
    deletionSuccess: 'আইটেম সফলভাবে মুছে ফেলা হয়েছে',
    clearList: 'লিস্ট পরিষ্কার করুন',
    clearListConfirm: 'আপনি কি নিশ্চিত যে এই লিস্ট থেকে সব আইটেম মুছে ফেলতে চান?',
    listCleared: 'লিস্ট সফলভাবে পরিষ্কার করা হয়েছে',
  },
};

export const getTranslation = (language: 'en' | 'bn') => translations[language];

// Utility: Convert English digits to Bengali digits
export function toBengaliDigits(input: string | number) {
  const en = '0123456789';
  const bn = '০১২৩৪৫৬৭৮৯';
  return input.toString().replace(/[0-9]/g, d => bn[en.indexOf(d)]);
}