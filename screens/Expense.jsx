import React, { useState , useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import Colors from '../theme/Colors';
import service from '../Appwrite/config';
import { useAuthUser } from '../hooks/useAuthUser';
import { Check , Calendar  , GitGraph, Navigation} from 'lucide-react-native';



const categories = [
  {
    name: 'Food',
    emoji: '🍔',
    description: 'Meals, groceries',
    type: 'daily',
    placeholder: 'How much did you munch today? (₹)',
    shown: true,
  },
  {
    name: 'Fuel',
    emoji: '⛽️',
    description: 'Kilometer driven',
    type: 'daily',
    placeholder: 'Enter distance you drove (km)',
    shown: true,
  },
  {
    name: 'Miscellaneous',
    emoji: '🧩',
    description: 'Other expenses',
    type: 'daily',
    placeholder: 'Any extra spending today? (₹)',
    shown: true,
  },
  {
    name: 'Electricity',
    emoji: '💡',
    description: 'Unit Consume',
    type: 'daily',
    placeholder: 'Units used today? (e.g. 3)',
    shown: true,
  },
  {
    name: 'Recharge',
    emoji: '📱',
    description: 'Mobile, DTH',
    type: 'monthly',
    placeholder: 'Recharge amount (₹)',
    shown: true,
  },
  {
    name: 'Rent',
    emoji: '🏠',
    description: 'House rental',
    type: 'monthly',
    status: 'Paid',
    shown: false,
    placeholder: 'How much rent paid? (₹)',
  },
];


const AlreadyAddedScreen = ({ onRefresh }) => {
  return (
    <View style={[styles.container , {alignItems: 'center' , justifyContent: 'center' , height: '100%'}]}>
      <View style={[styles.card , { width: '90%' , alignItems: 'center'}]}>
        <View style={styles.iconContainer}>
         <Check color={Colors.primary} size={40} />
        </View>
        <Text style={styles.mainTitle}>Today's Expenses</Text>
        <Text style={styles.subtitle}>You've already recorded your expenses for today</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Calendar color={Colors.primary} size={20} />
            <Text style={styles.infoText}>Next entry will be available tomorrow</Text>
          </View>
          <View style={styles.infoItem}>
            <GitGraph color={Colors.primary} size={20} />
            <Text style={styles.infoText}>View your spending reports in the Dashboard</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={onRefresh}>
          <Text style={styles.buttonText}>View Today's Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const SelectExpenseCard = ({navigation}) => {



  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data , setData] = useState({});
  const [amounts, setAmounts] = useState({});
  const [reason, setReason] = useState('');
  const [animation] = useState(new Animated.Value(0));
  const [expenseData , setExpenseData] = useState([]);
  const [isAlreadyAdd , setIsAlreadyAdd] = useState(false);
  const [rentPaid , setRentPaid ] = useState(false);
  
  const user_id = useAuthUser();


  const categories = [
  {
    name: 'Food',
    emoji: '🍔',
    description: 'Meals, groceries',
    type: 'daily',
    placeholder: 'How much did you munch today? (₹)',
    shown: true,
  },
  {
    name: 'Fuel',
    emoji: '⛽️',
    description: 'Kilometer driven',
    type: 'daily',
    placeholder: 'Enter distance you drove (km)',
    shown: true,
  },
  {
    name: 'Miscellaneous',
    emoji: '🧩',
    description: 'Other expenses',
    type: 'daily',
    placeholder: 'Any extra spending today? (₹)',
    shown: true,
  },
  {
    name: 'Electricity',
    emoji: '💡',
    description: 'Unit Consume',
    type: 'daily',
    placeholder: 'Units used today? (e.g. 3)',
    shown: true,
  },
  {
    name: 'Recharge',
    emoji: '📱',
    description: 'Mobile, DTH',
    type: 'monthly',
    placeholder: 'Recharge amount (₹)',
    shown: rentPaid ? false : true,
  },
  {
    name: 'Rent',
    emoji: '🏠',
    description: 'House rental',
    type: 'monthly',
    status: 'Paid',
    shown: false,
    placeholder: 'How much rent paid? (₹)',
  },
];



  console.log( 'Expense Data:', expenseData);


  



  const fetchBasic = async ( ) => {
    try {
        const response = await service.GetBasic(user_id);
        setData(response.documents[0]);
    } catch (error) {
        console.error('Error fetching basic:', error);
    }
   
  }


  const fetchTodaysExpense = async () => {
    try {
        const response = await service.GetTodaysExpense(user_id);
        setExpenseData(response.documents);
    } catch (error) {
        console.error('Error fetching today\'s expense:', error);
    }
  }



  const fetchRent = async () => {
    
    const isRentPaidThisMonth = (expense) => {
  if (!expense?.rent_expense || expense?.rent_expense === 0) return false;

  const expenseDate = new Date(expense.date);
  const now = new Date();

  const sameMonth = expenseDate.getMonth() === now.getMonth();
  const sameYear = expenseDate.getFullYear() === now.getFullYear();

  return sameMonth && sameYear;
};

if (isRentPaidThisMonth(expenseData[0])) {
  setRentPaid(true);
} else {
  setRentPaid(false);
}

  }


const checkIfAlreadyAdded = () => {

    const today = new Date().toLocaleDateString('en-US'); // only the date part
    const isToday = expenseData.some(expense => {
      const expenseDate = new Date(expense.date).toLocaleDateString('en-US');
      return expenseDate === today;
    });
    setIsAlreadyAdd(isToday);
  
};

  console.log('isAlreadyAdd:', isAlreadyAdd);
   





  useEffect(() => {
    if(user_id){fetchBasic(); fetchTodaysExpense();}
  },
  [user_id]);   


  useEffect(() => {
    checkIfAlreadyAdded();
    fetchRent();
  }, [expenseData]);

  const handleCardPress = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setSelectedCategory(category);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAmountChange = (text, category) => {
    setAmounts({ ...amounts, [category]: text });
  };

  

  const handleSave = async() => {

    const fuelExpense = parseInt((amounts.Fuel/parseInt(data.vehicle_milage))*95);

    try {


        const response  = await service.PostTodaysExpense(user_id, parseInt(amounts.Electricity*parseInt(data.electricity_unit_rate)) , parseInt(amounts.Food) , fuelExpense , parseInt(amounts.Miscellaneous) , parseInt(amounts.Recharge) , parseInt(amounts.Rent) , reason);
        if (response) {
            console.log('Expense saved:', response);
            alert('Expense saved successfully');
            setSelectedCategory(null);
            setReason('');
            navigation.replace('Home');
        }
        
    } catch (error) {
        console.error('Error saving expense:', error);
    }

    setSelectedCategory(null);
    setReason('');
  };

  const dailyCategories = categories.filter((item) => item.type === 'daily');
  const monthlyCategories = categories.filter((item) => item.type === 'monthly');

  const renderExpenseCards = (categoryList) =>
    categoryList.map((item, index) => {
      const isSelected = selectedCategory === item.name;
      const currentAmount = parseFloat(amounts[item.name]) || 0;

      return (
        <TouchableOpacity
          key={index}
          style={[styles.card, isSelected && styles.cardExpanded]}
          onPress={() => handleCardPress(item.name)}
          activeOpacity={0.8}
        >
          {item.status === 'Paid' && (
            <View style={styles.paidTag}>
              <Text style={styles.paidText}>Paid</Text>
            </View>
          )}
          <View style={styles.cardTop}>
            <View style={styles.cardLeft}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <View style={styles.textGroup}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.description}</Text>
              </View>
            </View>
            <Animated.Text
              style={[
                styles.arrow,
                { transform: [{ rotate: isSelected ? '90deg' : '0deg' }] },
              ]}
            >
              ›
            </Animated.Text>
          </View>

          {isSelected && (
            <Animated.View style={[styles.inputContainer, { opacity: animation }]}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={item.placeholder}
                placeholderTextColor={Colors.textLight}
                value={amounts[item.name] || ''}
                onChangeText={(text) => handleAmountChange(text, item.name)}
              />
              {item.name === 'Miscellaneous' && currentAmount >= 1000 && (
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Please enter the reason"
                  placeholderTextColor={Colors.textLight}
                  value={reason}
                  onChangeText={setReason}
                  multiline
                />
              )}
            </Animated.View>
          )}
        </TouchableOpacity>
      );
    });

  if (isAlreadyAdd)   return (
    <AlreadyAddedScreen
      onRefresh={()=>console.log('Refresh')}
     />
  )
 else { return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>Add Expense</Text>
        <Text style={styles.title}>Today's Expenses</Text>
        {renderExpenseCards(dailyCategories)}

        <Text style={styles.title}>Monthly Expenses</Text>
        {renderExpenseCards(monthlyCategories)}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  mainTitle: {
     fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accent,
    marginTop: 20,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardExpanded: {
    backgroundColor: 'rgba(24, 105, 90, 0.08)',
    borderColor: Colors.primary,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emoji: {
    fontSize: 24,
  },
  textGroup: {
    justifyContent: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  arrow: {
    fontSize: 28,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.accent,
  },
  reasonInput: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textDark,
    marginTop: 12,
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  paidTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paidText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
    infoContainer: {
    width: '100%',
    marginBottom: 24,
  },
    divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.border,
    marginVertical: 20,
  },

  infoItem: {
    width : '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap : 16,
    marginVertical: 8,
    height : 40,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.accent,
    flex: 1,
  },
   iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(24, 105, 90, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
    button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SelectExpenseCard;