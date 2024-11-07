import {Text,View, StyleSheet,FlatList} from 'react-native'

export function ListHeader(props:any){
<View style={styles.header}>
    <Text style={styles.headerText}>
        {props.Text}
    </Text>
</View>
}


const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        padding: 6,
    },

    headerText: {
        fontSize: 32,
        textAlign: "center",
    }
})