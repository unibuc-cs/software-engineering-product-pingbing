import React, { useEffect, useState } from 'react';
import { Layout, Text, Input, ApplicationProvider } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';
import { getNote, updateNote } from '../../services/noteService';

export default function NoteScreen() {
  const { item } = useLocalSearchParams(); // Get note id from params
  const [noteTitle, setNoteTitle] = useState(''); // State for the note title
  const [noteContent, setNoteContent] = useState(''); // State for the note content
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (item) {
          const note = await getNote(item as string); // Fetch the note using the ID
          setNoteTitle(note.title); // Set the title
          setNoteContent(note.content); // Set the content
        }
      } catch (error) {
        console.error('Error fetching the note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [item]);

  useEffect(() => {
    // Save the note when the component unmounts
    return () => {
      const saveNote = async () => {
        try {
          if (item) {
            await updateNote(item as string, noteTitle, noteContent);
            console.log('Note updated successfully!');
          }
        } catch (error) {
          console.error('Error saving the note:', error);
        }
      };

      saveNote();
    };
  }, [noteTitle, noteContent]);

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
        <Layout style={styles.container}>
        <Text category="h4" style={styles.title}>📝 {noteTitle}</Text>
        <Input
            style={styles.input}
            multiline={true}
            textStyle={{ minHeight: 150 }}
            value={noteContent}
            onChangeText={setNoteContent}
        />
        </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 20,
  }
});
