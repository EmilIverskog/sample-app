import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal } from 'react-native';
import { FireStoreContext } from '@/contexts/FireStoreContext';
import { AuthenticationContext } from '@/contexts/AuthenticationContext';
import { collection, getDocs, Timestamp } from '@firebase/firestore';
import { useNavigation } from 'expo-router';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';  

interface Goal {
  id: string;
  name: string;
  date: Timestamp;
  status: boolean;
  notes: string; 
}

export default function PreviousGoalsScreen() {
  const db = useContext(FireStoreContext);
  const auth = useContext(AuthenticationContext);
  const [goals, setGoals] = useState<{ [key: string]: Goal[] }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedNotes, setSelectedNotes] = useState<string>('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGoals = async () => {
      if (auth.currentUser) {
        const userDataPath = `users/${auth.currentUser.uid}/goals`;
        const path = collection(db, userDataPath);
        const querySnapshot = await getDocs(path);
        const fetchedGoals: Goal[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedGoals.push({
            id: doc.id,
            name: data.name,
            date: data.date,
            status: data.status ?? false,
            notes: data.notes ?? '', 
          });
        });

       
        const today = format(new Date(), 'yyyy/MM/dd');
        const pastGoals = fetchedGoals.filter((goal) => {
          const goalDate = format(new Date(goal.date.seconds * 1000), 'yyyy/MM/dd');
          return goalDate < today; // Only show goals before today
        });

        // Group goals by date
        const groupedGoals: { [key: string]: Goal[] } = pastGoals.reduce((acc, goal) => {
          const formattedDate = format(new Date(goal.date.seconds * 1000), 'dd MMMM yyyy');
          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }
          acc[formattedDate].push(goal);
          return acc;
        }, {});

        setGoals(groupedGoals);
      }
    };

    fetchGoals();
  }, [auth.currentUser]);

  // Function to open the modal and show notes
  const openNotesModal = (notes: string) => {
    setSelectedNotes(notes);
    setModalVisible(true);
  };

  // Render each date group
  const renderGroup = ({ item }: any) => {
    const [date, goals] = item;

    return (
      <View>
        <Text style={styles.dateText}>{date}</Text>
        {goals.map((goal) => (
          <Pressable
            key={goal.id}
            style={styles.goalBox}
            onPress={() => openNotesModal(goal.notes)}
          >
            <Text style={styles.goalText}>{goal.name}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </Pressable>

      <Text style={styles.title}>Previous Goals</Text>

      <FlatList
        data={Object.entries(goals)}
        renderItem={renderGroup}
        keyExtractor={(item) => item[0]}
      />

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContnt}>
            <Text style={styles.modalTitle}>Goal Notes</Text>
            <Text style={styles.modalText}>{selectedNotes}</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 15,
    textAlign: 'center',
  },
  goalBox: {
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  goalText: {
    fontSize: 16,
    color: '#000000',
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContnt: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

