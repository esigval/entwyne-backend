import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

import MarketingPromptCollectorCard from '../components/MarketingPromptCollector';

const fetchPromptsByStoryIdAndMediaType = async (storyId, mediaType) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/v1/getStoryPrompts`, {
            params: { storyId, mediaType }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const PromptCollectionScreen = ({ route }) => {
    const [prompts, setPrompts] = useState([]);
    const { storyId, mediaType } = route.params;

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = await fetchPromptsByStoryIdAndMediaType(storyId, mediaType);
                    setPrompts(data);
                } catch (error) {
                    console.error('Error fetching prompts:', error);
                }
            };
    
            fetchData();
    
            return () => {}; // optional cleanup function
        }, [storyId, mediaType])
    );

    

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Prompts</Text>
            <FlatList
                data={prompts}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <MarketingPromptCollectorCard
                        promptId={item._id}
                        title={item.promptTitle}
                        prompt={item.prompt}
                        storyId={item.storyId}
                    />
                )}
                ListEmptyComponent={<Text>No prompts available</Text>}
                // Optional: Add these for performance optimization and pull-to-refresh functionality
                // initialNumToRender={10}
                // maxToRenderPerBatch={5}
                // windowSize={5}
                // refreshControl={
                //   <RefreshControl
                //     refreshing={refreshing}
                //     onRefresh={yourRefreshFunction}
                //   />
                // }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
    contentContainerStyle: {
        paddingBottom: 20,
    },
});

export default PromptCollectionScreen;
