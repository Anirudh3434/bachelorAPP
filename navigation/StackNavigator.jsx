import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignUp';
import LoginScreen from '../screens/Login';
import { Image, View, StyleSheet } from 'react-native';
import Colors from '../theme/Colors';
import Salary from '../screens/Salary';
import SelectExpenseCard from '../screens/Expense';
import VehicleForm from '../screens/BasicDetail';
import ProfileScreen from '../screens/Profile';
import ExpenseList from '../screens/ExpenseList';
import Suggesion from '../screens/Suggesion';
import Analysis from '../screens/Analysis';




const Stack = createNativeStackNavigator();


const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
     
      navigation.replace('Login'); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash.jpeg')}
        style={styles.image}
       
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
  <Stack.Screen 
          name="Splash" 
          component={SplashScreen}  
          options={ {
            headerShown: false
          } }
        />

        <Stack.Screen 
          name="Home" 
          component={HomeScreen}  
          options={ {
            headerShown: false
          } }
        />

      

        <Stack.Screen 
        name='Login'
        component={LoginScreen}
        options={{
            headerShown: false
        }}
        />

        <Stack.Screen 
        name='SignUp'
        component={SignupScreen}
         options={{
            headerShown: false
        }}
        />

        <Stack.Screen 
        name='Salary'
        component={Salary}
         options={{
            headerShown: false
        }}
        />

        <Stack.Screen 
        name='Expense'
        component={SelectExpenseCard}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen 
        name='Vehicle'
        component={VehicleForm}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen 
        name='ExpenseList'
        component={ExpenseList}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen 
        name='Suggestion'
        component={Suggesion}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen
        name='Analysis'
        component={Analysis}
        options={{
          headerShown: false
        }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}