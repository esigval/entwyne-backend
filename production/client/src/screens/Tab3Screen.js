import React, { useContext, useState } from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { DataContext } from '../utils/dataContext';
import LoadingComponent from '../components/LoadingComponent';
import TwyneGrid from '../components/TwyneGrid';
import { useNavigation } from '@react-navigation/native';

const Tab3Screen = () => {
  const { twynes, refreshData } = useContext(DataContext);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = () => {
    setRefreshing(true);
    refreshData().then(() => setRefreshing(false));
  };

  if (twynes.length === 0) {
    return <LoadingComponent loadingText="Loading twynes..." />;
  }

  const imageUrls = twynes.map(twyne => twyne.thumbnailUrl);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Your Twynes</Text>
      <TwyneGrid
        data={imageUrls}
        onPressItem={(index) => {
          const { thumbnailUrl, videoUri } = twynes[index];
          navigation.navigate('FullScreenMediaScreen', { imageUrl: thumbnailUrl, videoUri });
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default Tab3Screen;
