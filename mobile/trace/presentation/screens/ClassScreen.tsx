import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { ClassViewModel } from '../viewmodels/ClassViewModel';
import { ClassCard } from '../components/ClassCard';
import { Header } from '../components/common/Header';
import { colors } from '../../shared/constants/theme';

interface ClassScreenProps {
  viewModel: ClassViewModel;
}

export const ClassScreen: React.FC<ClassScreenProps> = observer(({ viewModel }) => {
  useEffect(() => {
    viewModel.loadClasses();
  }, [viewModel]);

  const handleRefresh = () => {
    viewModel.loadClasses();
  };

  const handleSearch = (query: string) => {
    viewModel.searchClasses(query);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Classes"
        rightAction={{
          icon: 'search',
          onPress: () => {/* Implement search */},
        }}
      />
      <FlatList
        data={viewModel.classes}
        renderItem={({ item }) => (
          <ClassCard
            class={item}
            onPress={() => {/* Navigate to class details */}}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={viewModel.isLoading}
        onRefresh={handleRefresh}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
}); 