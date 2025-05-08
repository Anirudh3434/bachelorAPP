import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LogOut, Settings, Pencil, User } from 'lucide-react-native';
import Colors from '../theme/Colors';
import { useAuthUser } from '../hooks/useAuthUser';
import service from '../Appwrite/config';
import { getAuth } from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  


  const user_id = useAuthUser();



  const handleLogout = async () => {
    try {
      await getAuth().signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchProfile = async () => {
  try {
    // Show loading state
    setIsLoading(true);
    
    // Fetch all data in parallel for better performance
    const [userResponse, salaryResponse, basicResponse] = await Promise.all([
      service.getUser(user_id),
      service.GetSalary(user_id),
      service.GetBasic(user_id)
    ]);
    
    // Update state once with all data to prevent multiple re-renders
    setProfileData(prevData => ({
      ...prevData,
      personal: userResponse.documents[0] || {},
      salary: salaryResponse.documents[0] || {},
      basic: basicResponse.documents[0] || {},
    }));
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    // Handle error state
    setError('Failed to load profile data. Please try again.');
  } finally {
    // Hide loading state regardless of success or failure
    setIsLoading(false);
  }
};

  useEffect(() => {
    if(user_id) {
      fetchProfile();   
    }
  }, [user_id]);

  console.log(profileData);


  
  const user = {
    name: profileData?.personal?.user_name,
    email: profileData?.personal?.email,
    role: 'Senior Product Manager',
    salary: profileData?.salary?.salary,
    vehicle: {
      type: profileData?.basic?.vehicle_type,
      milage: profileData?.basic?.vehicle_milage
    }
  };

  const renderSectionContent = () => {
    switch(activeSection) {
      case 'personal':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name:</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Salary :</Text>
              <Text style={styles.infoValue}>{user.salary} per month</Text>
            </View>
          </View>
        );
      case 'vehicle':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vehicle Type:</Text>
              <Text style={styles.infoValue}>{user.vehicle.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Milage:</Text>
              <Text style={styles.infoValue}>{user.vehicle.milage} km/l</Text>
            </View>
           
         
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <User size={40} color={Colors.primary} style={styles.icon} />
          <TouchableOpacity style={styles.editButton}>
            <Pencil size={12} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      {/* Information Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'personal' && styles.activeTab]} 
          onPress={() => setActiveSection('personal')}>
          <Text style={[styles.tabText, activeSection === 'personal' && styles.activeTabText]}>Personal</Text>
        </TouchableOpacity>
   
       
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'vehicle' && styles.activeTab]} 
          onPress={() => setActiveSection('vehicle')}>
          <Text style={[styles.tabText, activeSection === 'vehicle' && styles.activeTabText]}>Vehicle</Text>
        </TouchableOpacity>
      </View>

      {/* Section Content */}
      <View style={styles.infoCard}>
        {renderSectionContent()}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Settings size={20} color={Colors.accent} />
          <Text style={styles.actionText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
          <LogOut size={20} color="#e63946" />
          <Text style={[styles.actionText, { color: '#e63946' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: 60,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  icon: {
    borderWidth: 1,
    borderRadius: 60,
    padding: 10,
  },
  editButton: {
    position: 'absolute',
    right: -5,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    padding: 5,
  },
  nameSection: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  email: {
    fontSize: 14,
    color: Colors.textLight,
  },
  role: {
    fontSize: 13,
    color: Colors.accent,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 25,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 5,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: Colors.textDark,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  sectionContent: {
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  infoLabel: {
    fontSize: 15,
    color: Colors.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '600',
  },
  actions: {
    marginTop: 25,
    gap: 15,
    marginBottom: 40,
  },
  actionBtn: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: '500',
  },
});