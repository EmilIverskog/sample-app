import React, { useState, useContext } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from 'react-native'
import DatePicker from 'react-native-modern-datepicker'
import { getFormatedDate } from 'react-native-modern-datepicker'
import { FireStoreContext } from '@/contexts/FireStoreContext'
import { AuthenticationContext } from '@/contexts/AuthenticationContext'
import { collection, addDoc } from '@firebase/firestore'
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from 'expo-router';
import { useGoals } from '@/contexts/GoalsContext'

export default function AddHabit() {
  const db = useContext(FireStoreContext)
  const auth = useContext(AuthenticationContext)
  const userDataPath = `users/${auth.currentUser.uid}/goals`
  const navigation = useNavigation();
  // varible for sending updates to the homeScreen
  const { setGoalRefresh } = useGoals()

  // Varibles to store input from user
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)


  // setting the start date todays date, so user can't add goals for days before 
  const today = new Date();
  const startDate = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY/MM/DD')

  const [showConfirmation, setShowConfirmation] = useState(false)

  // visibility for selecting date 
  function handleOnPress() {
    setOpen(!open);
  }

  // handles the date change
  function handleDateChange(propDate: string) {
    setDate(new Date(propDate));
  }

  // adds new goal to firebase 
  const addGoal = async () => {
    const userId = auth.currentUser.uid
    if (userId) {
      try {
        const path = collection(db, userDataPath)
        await addDoc(path, {
          name: name,
          notes: notes,
          date: date,
        })

        // resets the textboxes
        setName('')
        setNotes('')
        setDate(new Date())
        setGoalRefresh(true)



        setShowConfirmation(true);
      } catch (error) {
        console.error("Error adding document: ", error)
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </Pressable>
      <Text style={styles.title}>Add New Goal</Text>

      <Text style={styles.label}>Goal Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter goal name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Additional notes"
        value={notes}
        onChangeText={setNotes}
        multiline={true}
      />

      <Pressable style={styles.dateButton} onPress={handleOnPress}>
        <Text style={styles.dateButtonText}>Choose Date</Text>
      </Pressable>
      <Text style={styles.selectedText}>
        Selected Date: {date ? getFormatedDate(date, 'YYYY/MM/DD') : 'None'}
      </Text>

      <Modal animationType="slide" transparent={true} visible={open}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <DatePicker
              mode="calendar"
              minimumDate={startDate}
              selected={getFormatedDate(date, 'YYYY/MM/DD')}
              onDateChange={handleDateChange}
            />
            <Pressable style={styles.closeButton} onPress={handleOnPress}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Pressable style={styles.saveButton} onPress={addGoal}>
        <Text style={styles.saveButtonText}>Save Goal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF5C5C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    padding: 5,
  },
});
