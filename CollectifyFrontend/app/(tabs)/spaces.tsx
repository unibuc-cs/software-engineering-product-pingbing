import React from 'react';
import { Layout, Text, List, ListItem, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';

// Dummy data for folders
const folders: string[] = ['Work', 'Personal', 'Ideas', 'a', 'd', 'f', 'e', 't', 'y', 'i'];

export default function FoldersScreen() {
  const router = useRouter();

  // Render folder items
  const renderFolder: ListRenderItem<string> = ({ item }) => (
    <ListItem
      title={`📁 ${item}`}
      onPress={() =>
        router.push({
          pathname: '../spaces/[item]',
          params: { item }, // Pass the dynamic item as params
        })
      }
      style={styles.listItem}
    />
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <List data={folders} renderItem={renderFolder} style={styles.list} />
      </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#F7F9FC',
  },
  sectionTitle: {
    marginLeft: 10,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  list: {
    marginHorizontal: 10,
  },
  listItem: {
    marginVertical: 2,
  }
});
