import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useAppStore } from '../store';
import { User } from '../types';

export default function ProfileScreen() {
  const { user, setUser } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  
  // Format height from inches to feet and inches
  const formatHeight = (heightInInches: number): string => {
    const feet = Math.floor(heightInInches / 12);
    const inches = heightInInches % 12;
    return `${feet}'${inches}"`;
  };
  
  // Convert height from feet/inches format to total inches
  const parseHeight = (heightStr: string): number => {
    const regex = /(\d+)'(\d+)"/;
    const match = heightStr.match(regex);
    if (match) {
      const feet = parseInt(match[1], 10);
      const inches = parseInt(match[2], 10);
      return (feet * 12) + inches;
    }
    return user?.height || 72; // Default to 6'0" (72 inches)
  };
  
  const handleEditPress = () => {
    setEditedUser({...user!});
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (editedUser) {
      setUser(editedUser);
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleChangeText = (field: keyof User, value: string) => {
    if (!editedUser) return;
    
    const updatedUser = {...editedUser};
    
    switch (field) {
      case 'name':
        updatedUser.name = value;
        break;
      case 'weight':
        updatedUser.weight = parseInt(value) || 0;
        break;
      case 'height':
        // Height is stored in inches but displayed as ft'in"
        // We'll convert when saving
        updatedUser.height = parseHeight(value);
        break;
      case 'age':
        updatedUser.age = parseInt(value) || 0;
        break;
      case 'goals':
        updatedUser.goals = value;
        break;
    }
    
    setEditedUser(updatedUser);
  };
  
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Profile</Text>
        
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}></View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{user?.name || 'User'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}></View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{user?.weight || 0} lb</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}></View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>{user?.height ? formatHeight(user.height) : '6\'0"'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}></View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{user?.age || 30} years</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <View style={styles.goalItem}>
            <View style={styles.goalIcon}></View>
            <Text style={styles.goalText}>{user?.goals || 'Build strength'}</Text>
          </View>
        </View>
      </View>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedUser?.name}
                onChangeText={(text) => handleChangeText('name', text)}
                placeholder="Your name"
                placeholderTextColor="#777"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight (lb)</Text>
              <TextInput
                style={styles.input}
                value={editedUser?.weight?.toString()}
                onChangeText={(text) => handleChangeText('weight', text)}
                keyboardType="numeric"
                placeholder="Weight in pounds"
                placeholderTextColor="#777"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                style={styles.input}
                value={editedUser?.height ? formatHeight(editedUser.height) : ''}
                onChangeText={(text) => handleChangeText('height', text)}
                placeholder={'e.g. 6\'0"'}
                placeholderTextColor="#777"
              />
              <Text style={styles.inputHelper}>{"Format: feet'inches\" (e.g. 6'0\")"}</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={editedUser?.age?.toString()}
                onChangeText={(text) => handleChangeText('age', text)}
                keyboardType="numeric"
                placeholder="Your age"
                placeholderTextColor="#777"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Goals</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedUser?.goals || ''}
                onChangeText={(text) => handleChangeText('goals', text)}
                placeholder="Your fitness goals"
                placeholderTextColor="#777"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4080FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#4080FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C3E50',
    marginRight: 16,
  },
  infoContent: {},
  infoLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  goalIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4080FF',
    marginRight: 8,
  },
  goalText: {
    color: '#4080FF',
    fontSize: 16,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#DDDDDD',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputHelper: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4080FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
