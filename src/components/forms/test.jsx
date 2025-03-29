import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    Switch
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_BASE_URL } from '../../constant/Constatnt';

const GramSamarastaSurvey = () => {
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(1);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        surveyerName: Yup.string().required('Surveyer Name is required'),
        village: Yup.string().required('Village is required'),
        grampanchayat: Yup.string().required('Gram Panchayat is required'),
        taluka: Yup.string().required('Taluka is required'),
        district: Yup.string().required('District is required'),
        pinCode: Yup.string()
            .matches(/^\d{6}$/, 'Pin Code must be 6 digits')
            .required('Pin Code is required'),
        
        // Conditional validations
        villageTemple: Yup.object().shape({
            name: Yup.string().when('exists', {
                is: true,
                then: () => Yup.string().required('Temple Name is required')
            })
        }),
        socialEvents: Yup.array().of(
            Yup.object().shape({
                otherEventDetails: Yup.string().when('eventType', {
                    is: 'Other',
                    then: () => Yup.string().required('Other Event Details are required')
                })
            })
        ),
        religiousPlaces: Yup.array().of(
            Yup.object().shape({
                otherSpecify: Yup.string().when('type', {
                    is: 'Other',
                    then: () => Yup.string().required('Please specify the religious place')
                })
            })
        ),
        utsavMela: Yup.object().shape({
            details: Yup.string().when('exists', {
                is: true,
                then: () => Yup.string().required('Utsav Mela Details are required')
            })
        }),
        bhjanMandal: Yup.object().shape({
            name: Yup.string().when('exists', {
                is: true,
                then: () => Yup.string().required('Bhajan Mandal Name is required')
            }),
            contactNumber: Yup.string().when('exists', {
                is: true,
                then: () => Yup.string()
                    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
                    .required('Contact Number is required')
            })
        }),
        otherSocialWorkOrganizations: Yup.object().shape({
            details: Yup.string().when('exists', {
                is: true,
                then: () => Yup.string().required('Organization Details are required')
            })
        })
    });

    // Initial Form Values
    const initialFormValues = {
        surveyerName: '',
        village: '',
        grampanchayat: '',
        taluka: '',
        district: '',
        pinCode: '',
        
        festivals: [],
        villageTemple: {
            exists: false,
            name: ''
        },
        socialEvents: [{ 
            eventType: '', 
            otherEventDetails: '' 
        }],
        otherCommunityCenter: false,
        religiousPlaces: [{ 
            type: '', 
            name: '', 
            otherSpecify: '' 
        }],
        utsavMela: {
            exists: false,
            details: ''
        },
        kuldeviTemple: {
            exists: false,
            name: ''
        },
        bhjanMandal: {
            exists: false,
            name: '',
            contactNumber: ''
        },
        otherSocialWorkOrganizations: {
            exists: false,
            details: ''
        }
    };

    // Form Submission Handler
    const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
        try {
            setSubmitting(true);
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/gramsamarasta/survey`,
                values
            );

            Alert.alert(
                'Success',
                'Survey submitted successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetForm({ values: initialFormValues });
                            setProgress(0);
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error submitting survey:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Error submitting survey. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Formik
                    initialValues={initialFormValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        values,
                        errors,
                        touched
                    }) => (
                        <View>
                            {/* Basic Survey Details */}
                            <Text style={styles.sectionTitle}>Survey Details</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Surveyer Name"
                                onChangeText={handleChange('surveyerName')}
                                value={values.surveyerName}
                            />
                            {touched.surveyerName && errors.surveyerName && (
                                <Text style={styles.errorText}>{errors.surveyerName}</Text>
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder="Village"
                                onChangeText={handleChange('village')}
                                value={values.village}
                            />
                            {touched.village && errors.village && (
                                <Text style={styles.errorText}>{errors.village}</Text>
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder="Gram Panchayat"
                                onChangeText={handleChange('grampanchayat')}
                                value={values.grampanchayat}
                            />
                            {touched.grampanchayat && errors.grampanchayat && (
                                <Text style={styles.errorText}>{errors.grampanchayat}</Text>
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder="Taluka"
                                onChangeText={handleChange('taluka')}
                                value={values.taluka}
                            />
                            {touched.taluka && errors.taluka && (
                                <Text style={styles.errorText}>{errors.taluka}</Text>
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder="District"
                                onChangeText={handleChange('district')}
                                value={values.district}
                            />
                            {touched.district && errors.district && (
                                <Text style={styles.errorText}>{errors.district}</Text>
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder="Pin Code"
                                keyboardType="numeric"
                                onChangeText={handleChange('pinCode')}
                                value={values.pinCode}
                            />
                            {touched.pinCode && errors.pinCode && (
                                <Text style={styles.errorText}>{errors.pinCode}</Text>
                            )}

                            {/* Village Temple Section */}
                            <Text style={styles.sectionTitle}>Village Temple</Text>
                            <View style={styles.switchContainer}>
                                <Text>Village Temple Exists</Text>
                                <Switch
                                    value={values.villageTemple.exists}
                                    onValueChange={(value) => 
                                        setFieldValue('villageTemple.exists', value)
                                    }
                                />
                            </View>
                            {values.villageTemple.exists && (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Temple Name"
                                    onChangeText={handleChange('villageTemple.name')}
                                    value={values.villageTemple.name}
                                />
                            )}

                            {/* Social Events Section */}
                            <Text style={styles.sectionTitle}>Social Events</Text>
                            <Dropdown
                                style={styles.dropdown}
                                data={[
                                    { label: 'Ganesh Sthapana', value: 'Ganesh Sthapana' },
                                    { label: 'Navratri', value: 'Navratri' },
                                    { label: 'Other', value: 'Other' }
                                ]}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Social Event"
                                value={values.socialEvents[0].eventType}
                                onChange={(item) => 
                                    setFieldValue('socialEvents[0].eventType', item.value)
                                }
                            />
                            {values.socialEvents[0].eventType === 'Other' && (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Other Event Details"
                                    onChangeText={handleChange('socialEvents[0].otherEventDetails')}
                                    value={values.socialEvents[0].otherEventDetails}
                                />
                            )}

                           
                        </View>
                        
                    )}
                </Formik>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: 'black'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        color: 'black'
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default GramSamarastaSurvey;