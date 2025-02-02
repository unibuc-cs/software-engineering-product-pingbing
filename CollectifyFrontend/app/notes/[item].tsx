import React, { useEffect, useState } from 'react';
import { Layout, Text, Input, ApplicationProvider } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, ImageBackground } from 'react-native';
import * as eva from '@eva-design/eva';
import { getNote, updateNote } from '../../services/noteService';

export default function NoteScreen() {
  const { item } = useLocalSearchParams(); 
  const [noteTitle, setNoteTitle] = useState(''); 
  const [noteContent, setNoteContent] = useState(''); 
  const [loading, setLoading] = useState(true); 

  
  let debounceTimeout: NodeJS.Timeout;

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (item) {
          const note = await getNote(item as string); 
          setNoteTitle(note.title); 
          setNoteContent(note.content); 
        }
      } catch (error) {
        console.error('Error fetching the note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [item]);

  
  const debouncedSaveNote = (content: string, title: string) => {
    clearTimeout(debounceTimeout); 
    debounceTimeout = setTimeout(async () => {
      try {
        if (item) {
          await updateNote(item as string, title, content); 
          console.log('Note updated successfully!');
        }
      } catch (error) {
        console.error('Error saving the note:', error);
      }
    }, 1000); 
  };

  if (loading) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
          <Text>Loading Note...</Text>
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
            style={styles.titleInput}
            textStyle={{ fontSize: 24, fontWeight: 'bold' }}
            value={noteTitle}
            onChangeText={(text) => {
              setNoteTitle(text); 
              debouncedSaveNote(noteContent, text); 
            }}
          />
  
        
          <Input
            style={styles.contentInput}
            multiline={true}
            textStyle={{ minHeight: '100%', textAlignVertical: 'top' }}
            value={noteContent}
            onChangeText={(text) => {
              setNoteContent(text); 
              debouncedSaveNote(text, noteTitle); 
            }}
            autoFocus
          />
        </Layout>
      </ImageBackground>
    </ApplicationProvider>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
    backgroundColor: 'transparent', 
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: 'white', 
    opacity: 0.9,
    borderWidth: 0, 
    borderRadius: 15,
  },
  contentInput: {
    flex: 1, 
    backgroundColor: 'white', 
    opacity: 0.9,
    borderWidth: 0, 
    borderRadius: 15,
  },
  backgroundImage: {
    flex: 1, 
    resizeMode: 'cover', 
  },
});
