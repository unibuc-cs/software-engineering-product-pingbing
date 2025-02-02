import React, { useState } from 'react';
import { Layout, Text, List, ListItem, Button, Input, ApplicationProvider } from '@ui-kitten/components';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { getNotesByGroupId, addNote, deleteNote } from '../../services/noteService';
import { getGroup, updateGroup } from '../../services/groupService';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


type Note = {
  id: string;
  title: string;
  content: string;
};

export default function GroupNotesScreen() {
  const router = useRouter();
  const { item: groupId } = useLocalSearchParams<{ item: string }>();
  

  const [groupName, setGroupName] = useState<string>(''); 
  const [notes, setNotes] = useState<Note[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  
  let debounceTimeout: NodeJS.Timeout;

  const fetchGroupAndNotes = async () => {
    try {
      if (groupId) {
       
        const group = await getGroup(groupId as string);
        setGroupName(group.name);

       
        const fetchedData = await getNotesByGroupId(groupId as string);
        const fetchedNotes = fetchedData.$values ? fetchedData.$values : [];
        setNotes(fetchedNotes);
      }
    } catch (err) {
      console.error('Error fetching group or notes:', err);
      setError('Failed to load group or notes. Please try again.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGroupAndNotes(); 
    }, [groupId])
  );

  const debouncedSaveGroupName = (name: string) => {
    clearTimeout(debounceTimeout); 
    debounceTimeout = setTimeout(async () => {
      try {
        if (groupId) {
          await updateGroup(groupId as string, name); 
          console.log('Group name updated successfully!');
        }
      } catch (error) {
        console.error('Error updating the group name:', error);
      }
    }, 1000); 
  };

  
  const handleAddNote = async () => {
    try {
      await addNote('New Note', '', groupId as string); 
      fetchGroupAndNotes(); 
    } catch (error) {
      console.error('Error adding a new note:', error);
    }
  };

  
  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId); 
      fetchGroupAndNotes(); 
    } catch (error) {
      console.error('Error deleting the note:', error);
    }
  };

  
  const renderNote = ({ item }: { item: Note }) => (
    <ListItem
      title={() => (
        <View style={styles.noteContainer}>
          <Text style={styles.title}>📝 {item.title}</Text>
          <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
            <FontAwesome5 name="trash-alt" size={18} color="red" />
          </TouchableOpacity>
        </View>
      )}
      onPress={() =>
        router.push({
          pathname: '../notes/[item]',
          params: { item: item.id },
        })
      }
      style={styles.listItem}
    />
  );

  if (error) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </Layout>
      </ApplicationProvider>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ImageBackground
        source={require('../../assets/images/background.jpeg')} 
        style={styles.backgroundImage}
      >
        <Layout style={styles.container}>
          
          <Input
            style={styles.nameInput}
            textStyle={{ fontSize: 24, fontWeight: 'bold' }}
            value={groupName}
            onChangeText={(text) => {
              setGroupName(text); 
              debouncedSaveGroupName(text);
            }}
            placeholder="Group Name"
          />
          
         
          <View style={styles.buttonGroup}>
           
            <Button
              status="info"
              onPress={() => router.push({
                pathname: '../qrCode',
                params: { item:groupId } 
              })}
              style={styles.qrButton}
            >
              Show QR Code
            </Button>

            
            <Button
              status="primary"
              onPress={() => router.push({
                pathname: './groupmembers',
                params: { item:groupId } 
              })}
              style={styles.membersButton}
            >
              See Members
            </Button>
          </View>

         
          <List
            data={notes}
            renderItem={renderNote}
            keyExtractor={(note) => note.id.toString()} 
            style={styles.list}
          /> 
          <Button
            status="warning"
            onPress={handleAddNote}
            style={styles.newNoteButton}
          >
            New Note
          </Button>
        </Layout>
      </ImageBackground>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  qrButton: {
    borderRadius: 8,
    paddingVertical: 8,   
    paddingHorizontal: 12, 
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    borderColor: '#ccc',  
    borderWidth: 1,       
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    flex: 1,
    marginRight: 10,
  },
  membersButton: {
    borderRadius: 8,
    paddingVertical: 8,   
    paddingHorizontal: 12, 
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    borderColor: '#ccc',  
    borderWidth: 1,       
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'white',
    opacity: 0.9,
    borderWidth: 0,
    borderRadius: 15,
  },
  title: {
    marginBottom: 10,
  },
  list: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 15,
  },
  listItem: {
    marginVertical: 4,
    height: 70,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  newNoteButton: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
