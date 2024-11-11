import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet, FlatList, Pressable, CheckBox } from 'react-native'
import { useNavigation, Link } from 'expo-router'
import { ItemPrototype } from '@/interfaces/itemInterface'
import { FireStoreContext } from '@/contexts/FireStoreContext'
import { AuthenticationContext } from '@/contexts/AuthenticationContext'
import { collection, query, where, getDocs } from '@firebase/firestore'
import { useGoals } from '@/contexts/GoalsContext'
import { format } from 'date-fns'

export default function HomeScreen(props: any) {
  const db = useContext(FireStoreContext)
  const auth = useContext(AuthenticationContext)
  const userDataPath = `users/${auth.currentUser.uid}/goals`
  const { goalRefresh, setGoalRefresh } = useGoals()



  const [datastate, setdatastate] = useState<ItemPrototype[]>([])
  const [currentDate, setCurrentDate] = useState('')
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  // loads the goals 
  useEffect(() => {
    if (dataLoaded == false) {
      getGoals()
      setDataLoaded(true)
    }
  }, [dataLoaded])

  // sets the dates 
  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    setCurrentDate(today.toLocaleDateString(undefined, options))
  }, []);

  // reloads the goals when goalRefresh is true 
  useEffect(() => {
    if (goalRefresh) {
      getGoals()
      setGoalRefresh(false)
    }
  }), [goalRefresh]

  // gets goals from firebase that matches todays date 
  const getGoals = async () => {
    if (auth.currentUser.uid) {
      const path = collection(db, userDataPath)
      const querySnapshot = await getDocs(path)


      const today = format(new Date(), 'yyyy/MM/dd')

      let userData: ItemPrototype[] = [];
      querySnapshot.forEach((userDocument) => {
        let document: any = userDocument.data()

        // Adding goals with the right date 
        if (document.date && format(new Date(document.date.seconds * 1000), 'yyyy/MM/dd') === today) {
          document.id = userDocument.id;
          userData.push(document);
        }
      });
      setdatastate(userData);
    }
  }

  // toggle the status by ID
  const toggleHabitCompletion = (id: string) => {
    setdatastate((prevData) =>
      prevData.map((habit) =>
        habit.id === id ? { ...habit, status: !habit.status } : habit
      )
    )
  }

  // render each goal
  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.habitContainer}>
        <CheckBox
          value={item.status}
          onValueChange={() => toggleHabitCompletion(item.id)}
        />
        <Text style={[styles.habitText, item.status && styles.completedHabit]}>
          {item.name}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Goals</Text>
      <Text style={styles.dateText}>{currentDate}</Text>
      <FlatList
        data={datastate}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Pressable style={styles.addButton}>
        <Link href={{ pathname: "/(tabs)/addHabit" }}>
          <Text style={styles.addButtonText}>Add New Goal</Text>
        </Link>
      </Pressable>
    </View>
  )
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
});
