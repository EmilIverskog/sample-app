import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, CheckBox, Modal } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { ItemPrototype } from '@/interfaces/itemInterface';
import { FireStoreContext } from '@/contexts/FireStoreContext';
import { AuthenticationContext } from '@/contexts/AuthenticationContext';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { useGoals } from '@/contexts/GoalsContext';
import { format } from 'date-fns';

export default function HomeScreen(props: any) {
  const db = useContext(FireStoreContext);
  const auth = useContext(AuthenticationContext);
  const userDataPath = `users/${auth.currentUser.uid}/goals`;
  const { goalRefresh, setGoalRefresh } = useGoals();

  const [datastate, setdatastate] = useState<ItemPrototype[]>([]);
  const [currentDate, setCurrentDate] = useState('');
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [noteModalVisible, setNoteModalVisible] = useState<boolean>(false);
  const [selectedGoalNotes, setSelectedGoalNotes] = useState<string | null>(null);

  // loads the goals 
  useEffect(() => {
    if (dataLoaded == false) {
      getGoals();
      setDataLoaded(true);
    }
  }, [dataLoaded]);

  // sets the dates 
  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, []);

  // reloads the goals when goalRefresh is true 
  useEffect(() => {
    if (goalRefresh) {
      getGoals();
      setGoalRefresh(false);
    }
  }, [goalRefresh]);

  // gets goals from firebase that matches today's date 
  const getGoals = async () => {
    if (auth.currentUser.uid) {
      const path = collection(db, userDataPath);
      const querySnapshot = await getDocs(path);

      const today = format(new Date(), 'yyyy/MM/dd');

      let userData: ItemPrototype[] = [];
      querySnapshot.forEach((userDocument) => {
        let document: any = userDocument.data();

        // Adding goals with the right date
        if (document.date && format(new Date(document.date.seconds * 1000), 'yyyy/MM/dd') === today) {
          document.id = userDocument.id;

          // Ensure status is set to either true or false
          if (document.status === undefined) {
            document.status = false;
          }

          userData.push(document);
        }
      });
      setdatastate(userData);
    }
  };

  // toggle the status by ID
  const toggleHabitCompletion = (id: string) => {
    setdatastate((prevData) =>
      prevData.map((habit) =>
        habit.id === id ? { ...habit, status: !habit.status } : habit
      )
    );
  };

  // open the notes modal
  const openNotesModal = (notes: string) => {
    setSelectedGoalNotes(notes);
    setNoteModalVisible(true);
  };

  // render each goal
  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.habitContainer}>
        <CheckBox
          value={item.status}
          onValueChange={() => toggleHabitCompletion(item.id)}
        />
        <Pressable 
          style={{ flex: 1 }} 
          onPress={() => openNotesModal(item.notes)}
        >
          <Text style={[styles.habitText, item.status && styles.completedHabit]}>
            {item.name}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Goals</Text>
      <Text style={styles.dateText}>{currentDate}</Text>
      <FlatList
        data={datastate}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Pressable style={styles.addButton} onPress={() => router.push("/addHabit")}>
        <Text style={styles.addButtonText}>Add Goal</Text>
      </Pressable>

      
      <Modal
        visible={noteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalBox}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Goal Notes</Text>
            <Text style={styles.modalNotes}>{selectedGoalNotes}</Text>
            <Pressable style={styles.modalButton} onPress={() => setNoteModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
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
    marginBottom: 10,
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  habitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  habitText: {
    fontSize: 18,
    marginLeft: 10,
  },
  completedHabit: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  addButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
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
  modalNotes: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
