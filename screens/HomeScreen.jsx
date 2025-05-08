import React, { useState , useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Dimensions
} from 'react-native';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  CreditCard, 
  BarChart2, 
  PieChart,
  ArrowRight,
  Bell,
  User,
  Search,
  Sparkles
} from 'lucide-react-native';
import { useAuthUser } from '../hooks/useAuthUser';
import service from '../Appwrite/config';
import axios from 'axios';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {

  const [salary, setSalary] = useState(0);
  const [expenseData , setExpenseData] = useState([]);
  const [name, setName] = useState('');



  


  const total = expenseData.reduce((total, expense) => total + expense.total, 0);
  
  const housing = expenseData.reduce((total, expense) => total + expense.rent_expense, 0);
  const food = expenseData.reduce((total, expense) => total + expense.food_expense, 0);
  const transport = expenseData.reduce((total, expense) => total + expense.fuel_expense, 0);
  const utilities = expenseData.reduce((total, expense) => total + expense.mobile_expense, 0);
  const electricity = expenseData.reduce((total, expense) => total + expense.electricity_expense, 0);
  const others = expenseData.reduce((total, expense) => total + expense.miscellaneous_expense, 0);


  const wrapData = {
    salary,
    expenseData,
    housing,
    food,
    transport,
    utilities,
    electricity,
    others,
    name,
    total
  }


  console.log( 'Wrap Data:', wrapData )





  const totalSalary = salary;
  const totalExpenses = total;
  const usedPercent = (totalExpenses / totalSalary) * 100;
  const savings = totalSalary - totalExpenses;

    const user_id = useAuthUser();

    const fetchSalary = async () => {
    try {
      const response = await service.GetSalary(user_id);
      if (response) {
        setSalary(response.documents[0].salary);
      }
    } catch (error) {
      console.error('Error fetching salary:', error);
    }
  };

  const fetchExpense = async () => {
    try {
      const response = await service.GetTodaysExpense(user_id);
      if (response) {
        
        setExpenseData(response.documents);
      }
    } catch (error) {
      console.error('Error fetching salary:', error);
    }
  }

  const fetchUser = async () => {
    try {
      const response = await service.getUser(user_id);
      if (response) {
        console.log('User data:', response.documents[0].user_name);
        setName(response.documents[0].user_name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    if(user_id) {
      fetchExpense();
      fetchSalary();
      fetchUser();
    }
  }, [user_id]);






  const expenseCategories = [
    { name: 'Housing', percentage: parseFloat((housing/total)*100).toFixed(2), color: '#354F52' },
    { name: 'Food', percentage: parseFloat((food/total)*100).toFixed(2), color: '#52796F' },
    { name: 'Transport', percentage: parseFloat((transport/total)*100).toFixed(2), color: '#84A98C' },
    { name: 'Utilities', percentage: parseFloat((utilities/total)*100).toFixed(2), color: '#CAD2C5' },
    { name: 'Electricity', percentage: parseFloat((electricity/total)*100).toFixed(2), color: '#2F3E46' },
    { name: 'Others', percentage: parseFloat((others/total)*100).toFixed(2), color: '#2F3E46' },
  ];
  
 

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>April 19, 2025</Text>
          <Text style={styles.greeting}>Welcome back, {name}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search color="#1C524D" size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell color="#1C524D" size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.profileButton]}>
            <User color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.balanceScrollView}
      >
        <View style={[styles.balanceCard, { backgroundColor: '#18695A' }]}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>Monthly Income</Text>
            <CreditCard color="#FFFFFF" size={20} />
          </View>
          <Text style={styles.balanceAmount}>₹{totalSalary}</Text>
          <Text style={styles.balanceDate}>Last updated today</Text>
        </View>
        
        <View style={[styles.balanceCard, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.cardTop}>
            <Text style={[styles.cardLabel, { color: '#1C524D' }]}>Monthly Expenses</Text>
            <ArrowDownRight color="#1C524D" size={20} />
          </View>
          <Text style={[styles.balanceAmount, { color: '#1C524D' }]}>₹{totalExpenses}</Text>
          <View style={styles.percentChange}>
            <ArrowUpRight color="#F44336" size={16} />
            <Text style={[styles.percentChangeText, { color: '#F44336' }]}>8% from last month</Text>
          </View>
        </View>
      </ScrollView>

    

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Budget Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ExpenseList')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.budgetContainer}>
          <View style={styles.budgetTop}>
            <View>
              <Text style={styles.budgetLabel}>Monthly Budget</Text>
              <Text style={styles.budgetAmount}>₹{totalSalary}</Text>
            </View>
            <View>
              <Text style={styles.expenseLabel}>Spent</Text>
              <Text style={styles.expenseAmount}>₹{totalExpenses}</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${usedPercent}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressUsed}>{usedPercent.toFixed(0)}% used</Text>
              <Text style={styles.progressRemaining}>₹{savings} remaining</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expense Analysis</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ExpenseAnalysis')}>
            <Text style={styles.seeAll}>View Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.expenseAnalysis}>
          <View style={styles.chartContainer}>
            {/* This is a placeholder for a chart component */}
            <View style={styles.pieChartPlaceholder}>
              <PieChart color="#18695A" size={28} />
            </View>
          </View>
          
          <View style={styles.categories}>
            {expenseCategories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View 
                    style={[styles.categoryDot, { backgroundColor: category.color }]} 
                  />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        

        {/* Financial Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Financial Insights</Text>
          <Text style={styles.insightsDesc}>
            Your spending in food category increased by 15% compared to last month. Consider reviewing your expenses.
          </Text>
          <TouchableOpacity 
            style={styles.insightsButton}
            onPress={() => navigation.navigate('Analysis')}
          >
            <Text style={styles.insightsButtonText}>View Detailed Analysis</Text>
            <ArrowRight color="#FFFFFF" size={16} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <BarChart2 color="#18695A" size={24} />
          <Text style={[styles.navText, { color: "#18695A" }]}>Dashboard</Text>
        </TouchableOpacity> 
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Suggestion' , wrapData)}
        >
          <Sparkles color="#5C7570" size={24} />
          <Text style={styles.navText}>AI Suggestion</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('Expense')}
        >
          <View style={styles.addButtonInner}>
            <Text style={styles.addButtonPlus}>+</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Budget')}
        >
          <PieChart color="#5C7570" size={24} />
          <Text style={styles.navText}>Budget</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <User color="#5C7570" size={24} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  date: {
    fontSize: 12,
    color: '#5C7570',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C524D',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  profileButton: {
    backgroundColor: '#18695A',
  },
  balanceScrollView: {
    flexGrow: 0,
    paddingLeft: 20,
    marginTop: 5,
  },
  balanceCard: {
    width: width * 0.75,
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    marginBottom: 10,
    shadowColor: '#18695A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.85,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  balanceDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  percentChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentChangeText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#18695A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5C7570',
  },
  activeTabText: {
    color: '#18695A',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C524D',
  },
  seeAll: {
    fontSize: 13,
    color: '#18695A',
    fontWeight: '500',
  },
  budgetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 25,
  },
  budgetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#5C7570',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C524D',
  },
  expenseLabel: {
    fontSize: 12,
    color: '#5C7570',
    marginBottom: 4,
    textAlign: 'right',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C524D',
  },
  progressContainer: {
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#18695A',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressUsed: {
    fontSize: 12,
    color: '#18695A',
    fontWeight: '500',
  },
  progressRemaining: {
    fontSize: 12,
    color: '#5C7570',
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C524D',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#5C7570',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  expenseAmount: {
    color: '#F44336',
  },
  expenseAnalysis: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 25,
    flexDirection: 'row',
  },
  chartContainer: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categories: {
    flex: 1,
    marginLeft: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 13,
    color: '#1C524D',
  },
  categoryPercentage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C524D',
  },
  savingGoal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 15,
  },
  goalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C524D',
  },
  goalAmount: {
    fontSize: 14,
    color: '#5C7570',
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  goalProgressFill: {
    height: 6,
    backgroundColor: '#18695A',
    borderRadius: 3,
  },
  goalBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalPercentage: {
    fontSize: 12,
    color: '#5C7570',
  },
  addFundsButton: {
    backgroundColor: '#F0F4F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addFundsText: {
    fontSize: 12,
    color: '#18695A',
    fontWeight: '500',
  },
  insightsContainer: {
    backgroundColor: '#18695A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  insightsDesc: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.85,
    marginBottom: 15,
    lineHeight: 20,
  },
  insightsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  insightsButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    width: '18%',
  },
  navText: {
    fontSize: 10,
    color: '#5C7570',
    marginTop: 5,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F4F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    shadowColor: '#18695A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#18695A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPlus: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '400',
  },
});

export default HomeScreen;