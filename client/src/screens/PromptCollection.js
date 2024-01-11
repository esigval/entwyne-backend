import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { DataContext } from '../utils/dataContext';
import MarketingPromptCollectorCardromptCard from '../components/MarketingPromptCollector';

const PromptCollectionScreen = ({ route }) => {
    const { prompts } = useContext(DataContext);
    const [filteredPrompts, setFilteredPrompts] = useState([]);

    // Extract storylineId and mediaType from route parameters
    const { storyId, mediaType } = route.params;
    console.log('PromptCollectionScreen params:', storyId, mediaType);

    useEffect(() => {
        // Log the entire DataContext to see its structure
        console.log('DataContext prompts:', prompts);
        // Filter the prompts based on storylineId and mediaType
        const filtered = prompts.filter(prompt => 
            prompt.storyId === storyId && prompt.mediaType === mediaType
        );
         // Log the filtered prompts
         console.log('Filtered prompts:', filtered);
        setFilteredPrompts(filtered);
    }, [storyId, mediaType, prompts]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Prompts</Text>
            <FlatList
                data={filteredPrompts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <MarketingPromptCollectorCardromptCard
                        promptId={item._id}
                        title={item.promptTitle}
                        prompt={item.prompt}
                    />
                )}
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
