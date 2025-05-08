import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import Colors from '../theme/Colors'; 
import service from '../Appwrite/config';
import { useAuthUser } from '../hooks/useAuthUser';



const { user_id } = useAuthUser();

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

const Analysis = () => {
  // Get screen width to make the chart responsive
  const screenWidth = Dimensions.get("window").width;
  
  // Sample data for the line chart
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(24, 105, 90, ${opacity})`, // primary color
        strokeWidth: 2
      }
    ],
    legend: ["Monthly Sales"]
  };
  
  // Chart configuration with your custom colors
  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(28, 82, 77, ${opacity})`, // textDark
    labelColor: (opacity = 1) => `rgba(92, 117, 112, ${opacity})`, // textLight
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: Colors.accent
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Analysis</Text>
      <LineChart
        data={data}
        width={screenWidth - 30} // padding
        height={220}
        chartConfig={chartConfig}
        bezier // for curved lines
        style={styles.chart}
      />
    </View>
  )
}

export default Analysis

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: Colors.white,
    padding: 10
  }
})