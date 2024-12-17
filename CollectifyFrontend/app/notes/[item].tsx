import React, { useState } from 'react';
import { Layout, Text, Input, Button, Icon, ApplicationProvider } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';

export default function NoteScreen() {
  const { item } = useLocalSearchParams(); // Get note title from params
  const [noteContent, setNoteContent] = useState('');

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
        <Text category="h4" style={styles.title}>📝 {item}</Text>
        <Input
            style={styles.input}
            placeholder="Write your note here..."
            multiline={true}
            textStyle={{ minHeight: 150 }}
            value={noteContent}
            onChangeText={(text) => setNoteContent(text)}
        />
        <Button
            style={styles.button}
            status="success"
            //accessoryLeft={(props) => <Icon {...props} name="save-outline" />}
            onPress={() => alert('Note saved!')}
        >
            Save Note
        </Button>
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
  },
  button: {
    marginTop: 10,
  },
});
