import React from 'react';
import { Layout, Text, List, ListItem, ApplicationProvider } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';

export default function FolderScreen() {
  const { item } = useLocalSearchParams(); // Get folder name
  const notes = [`${item} Note 1`, `${item} Note 2`, `${item} Note 3`];

  const renderNote = ({ item }) => (
    <ListItem
      title={`📝 ${item}`}
      style={styles.listItem}
      onPress={() => alert(`Opening: ${item}`)}
    />
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
        <Text category="h4" style={styles.title}>📁 {item} Folder</Text>
        <List
            data={notes}
            renderItem={renderNote}
            style={styles.list}
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
  list: {
    marginTop: 10,
  },
  listItem: {
    marginVertical: 2,
  },
});
