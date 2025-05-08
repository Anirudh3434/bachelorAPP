import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import Colors from '../theme/Colors';
import { useAuthUser } from '../hooks/useAuthUser';
import service from '../Appwrite/config';

export default function VehicleForm({navigation}) {

    const user_id = useAuthUser();


    

  const [formData, setFormData] = useState({
    vehicle: false,
    vehicle_type: '',
    vehicle_milage: 0.0,
    electricity_unit_rate: 0.0
  });
  const [loading , setLoading ] = useState(false)
  
  const [vehicleTypeDropdownOpen, setVehicleTypeDropdownOpen] = useState(false);
  const vehicleTypes = ['Car', 'Bike'];
  
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = async () => {

    setLoading(true)
    
    try {
      const response = await service.Post_basic( user_id, formData.vehicle, formData.vehicle_type, parseFloat(formData.vehicle_milage), parseFloat(formData.electricity_unit_rate) );
      if (response) {
        console.log('Vehicle details saved:', response);
        alert('Vehicle details saved successfully');
        setLoading(false)
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Error saving vehicle details:', error);
      setLoading(false)
    }


  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vehicle Information</Text>
        <Text style={styles.subheaderText}>Please provide your vehicle details</Text>
      </View>
      
      <View style={styles.card}>
      
        
        {/* Vehicle Toggle */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Vehicle</Text>
          <View style={styles.toggleContainer}>
            <Switch
              value={formData.vehicle}
              onValueChange={(value) => handleChange('vehicle', value)}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
            <Text style={styles.toggleText}>{formData.vehicle ? 'Yes' : 'No'}</Text>
            <Text style={styles.requiredBadge}>Required</Text>
          </View>
    
        </View>
        
        {/* Vehicle Type Dropdown */}
        {formData.vehicle && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Vehicle Type</Text>
            <View>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setVehicleTypeDropdownOpen(!vehicleTypeDropdownOpen)}
              >
                <Text style={formData.vehicle_type ? styles.input : styles.placeholderText}>
                  {formData.vehicle_type || "Select vehicle type"}
                </Text>
                <ChevronDown size={20} color={Colors.textDark} />
              </TouchableOpacity>
              
              {vehicleTypeDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {vehicleTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => {
                        handleChange('vehicle_type', type);
                        setVehicleTypeDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{type}</Text>
                      {formData.vehicle_type === type && (
                        <Check size={16} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
        
        {/* Vehicle Mileage Field */}
        {formData.vehicle && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Vehicle Mileage</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.vehicle_milage}
                onChangeText={(text) => handleChange('vehicle_milage', text)}
                placeholder="Enter vehicle mileage"
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}
        
        {/* Electricity Unit Rate Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Electricity Unit Rate</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={formData.electricity_unit_rate}
              onChangeText={(text) => handleChange('electricity_unit_rate', text)}
              placeholder="Enter electricity unit rate"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
            />
            <Text style={styles.requiredBadge}>Required</Text>
          </View>
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{loading ? 'Saving...' : 'Save Information'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subheaderText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
    paddingVertical: 8,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textLight,
    paddingVertical: 8,
  },
  fieldType: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.textLight,
  },
  requiredBadge: {
    backgroundColor: '#F0F5F4',
    color: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  toggleText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.textDark,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
    paddingTop: 4,
  },
  dropdownMenu: {
    marginTop: 4,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.textDark,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  }
});