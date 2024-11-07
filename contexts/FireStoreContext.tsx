import { createContext } from "react";
import {Firestore} from '@firebase/firestore'

export const FireStoreContext = createContext < Firestore | any>(null)