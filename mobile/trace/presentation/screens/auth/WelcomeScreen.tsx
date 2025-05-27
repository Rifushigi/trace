import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../../shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const HORIZONTAL_PADDING = 24;

export const WelcomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../assets/images/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Welcome to TRACE</Text>
                    <Text style={styles.subtitle}>
                        Track your attendance with ease
                    </Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/login')}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="login" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => router.push('/register/role')}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="person-add" size={20} color={colors.primary} style={styles.buttonIcon} />
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    content: {
        flex: 1,
        paddingHorizontal: HORIZONTAL_PADDING,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        paddingTop: height * 0.12,
    },
    logoContainer: {
        width: width * 0.4,
        height: width * 0.4,
        backgroundColor: colors.primary + '08',
        borderRadius: width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: width * 0.25,
        height: width * 0.25,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '400',
        textAlign: 'center',
    },
    footer: {
        paddingBottom: height * 0.04,
        gap: 12,
    },
    loginButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    buttonIcon: {
        marginRight: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    registerButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    version: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 14,
        marginTop: 12,
    },
}); 