import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GoogleGenAI } from "@google/genai"
import Colors from '../theme/Colors';
import { useRoute } from '@react-navigation/native';

const ai = new GoogleGenAI({ apiKey: "AIzaSyCKcr93-brHYeTKEvoAUJ_MmiChoE720G8" });

const Suggestion = () => {
  const route = useRoute();
  const wrapData = route.params || {};
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   generateSuggestion();
  }, []);

  const generateSuggestion = async () => {
    setLoading(true);

    const prompt = `Analyze the provided financial data:
      Salary: ₹${wrapData.salary}
      Expense Data: ${JSON.stringify(wrapData.expenseData)}
      Housing Budget: ₹${wrapData.housing}
      Food Budget: ₹${wrapData.food}
      Transport Budget: ₹${wrapData.transport}
      Utilities Budget: ₹${wrapData.utilities}
      Electricity Budget: ₹${wrapData.electricity}
      Other Budget: ₹${wrapData.others}
      Total Expenses: ₹${wrapData.total}
      Name: ${wrapData.name}
      Provide the following:
      1. **Expense Breakdown and Analysis:**
      - Calculate the total expenses.
      - Show the percentage of each expense category relative to the total expenses.
      - Compare the actual expenses against the provided budget categories. Highlight any significant variances.
      2. **Financial Suggestions:**
      - Based on the income and expenses, suggest areas where ${wrapData.name} could potentially save money or optimize spending.
      3. **Expense Status:**
      - Determine if ${wrapData.name}'s expense status for this period is "good," "bad," or "normal" based on the data. Justify your assessment.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      if (response && response.text) {
        console.log("Gemini API Response:", response.text);
        setAnalysis(response.text);
      } else {
        console.error("No text in Gemini API response");
        setAnalysis("Failed to generate analysis. Please try again.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setAnalysis("An error occurred while generating the analysis. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    const elements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Section Header
      if (line.match(/^\d+\.\s.+/)) {
        elements.push(
          <Text key={i} style={styles.sectionHeader}>
            {line.replace(/^\d+\.\s/, '')}
          </Text>
        );
        continue;
      }



      // Bold text using **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split(boldRegex);
        elements.push(
          <Text key={i} style={styles.paragraph}>
            {parts.map((part, index) =>
              index % 2 === 1 ? (
                <Text key={index} style={styles.boldText}>{part}</Text>
              ) : (
                <Text key={index}>{part}</Text>
              )
            )}
          </Text>
        );
        continue;
      }

      // Bullet Point
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        elements.push(
          <Text key={i} style={styles.bulletPoint}>• {line.replace(/^[-*]\s*/, '')}</Text>
        );
        continue;
      }

      // Table (custom)
      if (line.includes('|')) {
        const cells = line.split('|').map(cell => cell.trim());
        elements.push(
          <View key={i} style={styles.tableRow}>
            {cells.map((cell, idx) => (
              <View key={idx} style={styles.tableCell}>
                <Text style={styles.tableText}>{cell}</Text>
              </View>
            ))}
          </View>
        );
        continue;
      }

      // Normal Paragraph
      if (line.trim() !== '') {
        elements.push(<Text key={i} style={styles.paragraph}>{line}</Text>);
      }
    }

    return elements;
  };

  

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Analyzing financial data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            <Text style={styles.header}>📊 Financial Analysis</Text>
            {renderFormattedText(analysis)}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Suggestion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.primary,
    marginTop: 40
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    color: Colors.primary,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#222',
  },
  bulletPoint: {
    fontSize: 16,
    marginLeft: 12,
    marginBottom: 4,
    lineHeight: 22,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 4,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: 4,
  },
  tableText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#444',
  },
});