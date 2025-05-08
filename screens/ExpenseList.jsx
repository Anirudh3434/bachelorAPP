import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../theme/Colors';
import { useAuthUser } from '../hooks/useAuthUser';
import service from '../Appwrite/config';
import { 
  Coffee, Fuel, ShoppingBag, Lightbulb, Smartphone, Home, CreditCard, 
  Calendar, AlertCircle
} from 'lucide-react-native';

export default function ExpenseList() {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = useAuthUser();

  const fetchTodaysExpense = async () => {
    try {
      setLoading(true);
      const response = await service.GetTodaysExpense(user_id);
      setExpenseData(response.documents);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user_id) fetchTodaysExpense();
  }, [user_id]);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const getExpenseIcon = (expenseType) => {
    const iconColor = Colors.primary;
    const iconSize = 22;
    
    switch (expenseType) {
      case 'food':
        return <Coffee size={iconSize} color={iconColor} />;
      case 'fuel':
        return <Fuel size={iconSize} color={iconColor} />;
      case 'miscellaneous':
        return <ShoppingBag size={iconSize} color={iconColor} />;
      case 'electricity':
        return <Lightbulb size={iconSize} color={iconColor} />;
      case 'mobile':
        return <Smartphone size={iconSize} color={iconColor} />;
      case 'rent':
        return <Home size={iconSize} color={iconColor} />;
      default:
        return <CreditCard size={iconSize} color={iconColor} />;
    }
  };

  // Function to render a single expense item row
  const renderExpenseItem = (name, amount) => {
    if (amount === null || amount === undefined || amount === 0) {
      return null;
    }

    return (
      <View style={styles.expenseItem} key={name}>
        <View style={styles.expenseLeftSection}>
          {getExpenseIcon(name.toLowerCase())}
          <Text style={styles.expenseName}>{name}</Text>
        </View>
        <Text style={styles.expenseAmount}>
          {formatCurrency(amount)}
        </Text>
      </View>
    );
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses List</Text>
    <ScrollView style={{ flex: 1 , padding: 16 }} showsVerticalScrollIndicator={false}>


      
      {expenseData.length === 0 ? (
        <View style={styles.emptyState}>
          <AlertCircle size={60} color={Colors.gray} />
          <Text style={styles.emptyStateText}>No expenses recorded for today</Text>
          <Text style={styles.emptyStateSubText}>Add expenses to track your spending</Text>
        </View>
      ) : (
        expenseData.map((expense) => (
          <View key={expense.$id} style={styles.expenseCard}>
            <View style={styles.cardHeader}>
              <View style={styles.dateContainer}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={styles.date}>{new Date(expense.date).toLocaleDateString('en-GB')}</Text>
              </View>
            </View>
            
            {renderExpenseItem('Food', expense.food_expense)}
            {renderExpenseItem('Fuel', expense.fuel_expense)}
            {renderExpenseItem('Miscellaneous', expense.miscellaneous_expense)}
            {renderExpenseItem('Electricity', expense.electricity_expense)}
            {renderExpenseItem('Mobile', expense.mobile_expense)}
            {renderExpenseItem('Rent', expense.rent_expense)}
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(expense.total)}
              </Text>
            </View>
          </View>
        ))
      )}
      
      <View style={styles.bottomPadding} />
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
    letterSpacing: 0.25,
    marginTop: 20,
    padding: 16
  },
  expenseCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,

  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: Colors.primary || '#666666',
    marginLeft: 6,
    fontWeight: '500',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || '#F5F5F5',
  },
  expenseLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseName: {
    fontSize: 16,
    color: Colors.textPrimary || '#333333',
    marginLeft: 14,
    fontWeight: '500',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary || '#007BFF',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary || '#333333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary || '#007BFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    marginVertical: 20,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.textSecondary || '#666666',
    textAlign: 'center',
  },
  emptyStateSubText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary || '#888888',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  }
});