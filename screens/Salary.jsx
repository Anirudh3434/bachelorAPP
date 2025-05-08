import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState , useEffect } from 'react';
import Colors from '../theme/Colors';
import service from '../Appwrite/config';
import { useNavigation } from '@react-navigation/native';
import { useAuthUser } from '../hooks/useAuthUser';

const Salary = () => {

  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');

 const userId = useAuthUser();

   const fetchName = async () => {
    try {
      const response = await service.getUser(userId)
      if (response) {
        console.log('User data:', response);
        setName(response.documents[0].user_name);

      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchName();
    }
  }, [userId]);



  const handleSave = async () => {
    try {
      const response = await service.StoreUserSalary(userId, +salary);
        if (response) {
        console.log('User salary saved:', response);
        navigation.replace('Vehicle');
      }
    } catch (error) {
      console.error('Error saving user salary:', error);
    }
  }


  console.log('User ID:', userId);
  




  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.welcomeContainer}>
      <Text style={styles.greeting}>Hey {name}</Text>
      <Text style={styles.tagline}>Let’s get your finances in shape!</Text>
     </View>

     <View style={{height: 500 , width: '100%' , justifyContent: 'center'}}>
      <Text style={styles.label}>Enter your monthly salary</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., ₹40,000"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={salary}
        onChangeText={setSalary}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
     </View>

      
    </SafeAreaView>
  );
};

export default Salary;

const styles = StyleSheet.create({
  container: {
    marginTop : 20,
    flex: 1,
    backgroundColor: Colors.background,

    alignItems: 'center',
    padding: 24,
  },

  welcomeContainer: {

    width: '100%',
    marginTop : 40,

    marginBottom: 32,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.primary,
    
  },
  tagline: {
    fontSize: 16,
    color: Colors.accent,
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    color: Colors.accent,
    marginBottom: 12,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2,
  },
  button: {
    marginTop : 20,
    width: 200,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});