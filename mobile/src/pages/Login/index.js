import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function Login(){
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg}/>
            </View>

            
        </View>
    );
}