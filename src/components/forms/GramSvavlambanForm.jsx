
import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Dropdown } from 'react-native-element-dropdown';
import * as Progress from 'react-native-progress';
import useAuth from '../../hooks/auth/useAuth';
import axios from 'axios';
import { API_BASE_URL } from '../../constant/Constatnt';

const { width } = Dimensions.get('window');

// Reusable Required Label Component

const RequiredLabel = ({ children, required = false }) => (

    <View style={styles.labelContainer}>

        <Text style={styles.label}>{children}</Text>

        {required && <Text style={styles.requiredAsterisk}>*</Text>}

    </View>

);
const GramSvavlambanForm = () => {
    const { userInfo, userToken } = useAuth();
    const [formProgress, setFormProgress] = useState(0);

    const [assignedAreas, setAssignedAreas] = useState({
        districts: {}
    });

    const [selectedAreas, setSelectedAreas] = useState({
        district: '',
        subdistrict: '',
        village: ''
    });

    // Fetch assigned areas when component mounts
    useEffect(() => {
        const fetchAssignedAreas = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/gram-survey/assigned-areas`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                console.log('Assigned Areas:', response.data);

                if (response.data.success) {
                    setAssignedAreas(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching assigned areas:', error);
                Alert.alert('Error', 'Could not fetch assigned areas');
            }
        };

        fetchAssignedAreas();
    }, [userToken]);

    // Filter subdistricts based on selected district
    const filteredSubdistricts = selectedAreas.district
        ? Object.keys(assignedAreas.districts[selectedAreas.district]?.subdistricts || {}).map(subdistrict => ({
            label: subdistrict,
            value: subdistrict
        }))
        : [];

    // Filter villages based on selected subdistrict
    const filteredVillages = (selectedAreas.district && selectedAreas.subdistrict)
        ? (assignedAreas.districts[selectedAreas.district]?.subdistricts[selectedAreas.subdistrict]?.villages || []).map(village => ({
            label: village,
            value: village
        }))
        : [];

    // Dropdown Options
    const DROPDOWN_OPTIONS = {
        YES_NO: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        VILLAGE: [
            { label: 'Village A', value: 'villageA' },
            { label: 'Village B', value: 'villageB' },
            { label: 'Village C', value: 'villageC' }
        ],
        GRAMPANCHAYAT: [
            { label: 'Grampanchayat 1', value: 'gramp1' },
            { label: 'Grampanchayat 2', value: 'gramp2' },
            { label: 'Grampanchayat 3', value: 'gramp3' }
        ],
        TALUKA: [
            { label: 'Taluka X', value: 'talukaX' },
            { label: 'Taluka Y', value: 'talukaY' },
            { label: 'Taluka Z', value: 'talukaZ' }
        ],
        DISTRICT: [
            { label: 'District 1', value: 'district1' },
            { label: 'District 2', value: 'district2' },
            { label: 'District 3', value: 'district3' }
        ],
        ROAD_CONDITIONS: [
            { label: 'RCC', value: 'RCC' },
            { label: 'Asphalt', value: 'Asphalt' },
            { label: 'Row and Rough Streets', value: 'RawRough' },
            { label: 'Other', value: 'Other' }
        ],
        MOBILE_NETWORK: [
            { label: 'Good', value: 'good' },
            { label: 'Weak', value: 'weak' },
            { label: 'Poor', value: 'poor' },
            { label: 'No Signal', value: 'noSignal' }
        ],
        SIM_NETWORK: [
            { label: 'Airtel', value: 'Airtel' },
            { label: 'VI', value: 'VI' },
            { label: 'Jio', value: 'Jio' },
            { label: 'BSNL', value: 'BSNL' }
        ],
        RELIGIOUS_PLACE: [
            { label: 'Church', value: 'Church' },
            { label: 'Masjid', value: 'Majjid' },
            { label: 'Other', value: 'Other' },
            { label: 'None', value: 'None' }
        ],
        AGRICULTURAL_PRODUCTION: [
            { label: 'Rice', value: 'Rice' },
            { label: 'Jowar', value: 'Jowar' },
            { label: 'Finger Millet', value: 'FingerMillet' },
            { label: 'Barnyard Millet', value: 'BarnyardMillet' },
            { label: 'Wheat', value: 'Wheat' },
            { label: 'Other', value: 'Other' }
        ],
        OTHER_INCOME: [
            { label: 'Labour', value: 'Labour' },
            { label: 'Goats', value: 'Goats' },
            { label: 'Poultry', value: 'Poultry' },
            { label: 'Mango Tree', value: 'MangoTree' },
            { label: 'Other', value: 'Other' }
        ],
        PRIMARY_HEALTH_CENTER: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        POLICE_STATION: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        OTHER_COMMUNITY_CENTER: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        UTSAV_OR_MELA: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        MAHILA_BACHAT_GAT: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        KRISHI_GAT: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ]
    };

    // Initial Form Values
    const initialFormValues = {
        surveyerName: userInfo.userName,
        village: '',
        grampanchayat: '',
        taluka: '',
        district: '',
        pinCode: '',

        primaryHealthCenter: '',
        primaryHealthCenterDistance: '',
        arogySevakName: '',
        arogySevakContact: '',

        policeStation: '',
        policeStationDistance: '',
        policeAdhikariName: '',
        policeAdhikariContact: '',

        otherCommunityCenter: '',
        temple: '',
        templeName: '',

        otherReligiousPlace: {
            type: '',
            specify: ''
        },

        utsavOrMela: '',
        utsavOrMelaDetails: '',

        roadCondition: {
            type: '',
            specify: ''
        },

        mobileNetworkCall: '',
        mobileNetworkInternet: '',
        goodNetworkSim: '',

        sarpanch: {
            name: '',
            contactNo: ''
        },

        pramukh: {
            name: '',
            contactNo: ''
        },

        mahilaBachatGat: '',
        mahilaBachatGatGroups: {
            name: '',
            numberOfGroups: '',
            sadasyaPerGroup: ''
        },

        krishiGat: '',
        krishiGatGroups: {
            name: '',
            numberOfGroups: '',
            sadasyaPerGroup: ''
        },

        primaryAgriculturalProduction: {
            type: '',
            specify: ''
        },

        otherIncomeSource: {
            type: '',
            specify: ''
        },

        otherInformation: ''
    };
    const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
        try {
            // Show loading indicator
            setSubmitting(true);

            // Make API call to submit form data
            const response = await fetch(`${API_BASE_URL}/api/v1/gram-svavlamban/gram-svavlamban-create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            // Parse the response
            const result = await response.json();

            // Check if submission was successful
            if (response.ok) {
                // Show success message
                Alert.alert(
                    'Success',
                    'Survey submitted successfully!',
                    [{ text: 'OK', onPress: () => resetForm() }]
                );
            } else {
                // Show error message with details from the server
                Alert.alert(
                    'Submission Failed',
                    result.message || 'There was an error submitting the form. Please try again.'
                );
                console.log('Submission Error:', result);
                
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error submitting form:', error);
            Alert.alert(
                'Error',
                'Network error or server is unreachable. Please check your connection and try again.'
            );
            console.log('Network Error:', error);
            
        } finally {
            // Ensure submitting state is reset
            setSubmitting(false);
        }
    };


    // Validation Schema
    const validationSchema= [
        // Yup.object().shape({
        //     // surveyerName: Yup.string().required('Surveyer Name is required'),
        //     village: Yup.string().required('Village is required'),
        //     grampanchayat: Yup.string().required('Grampanchayat is required'),
        //     taluka: Yup.string().required('Taluka is required'),
        //     district: Yup.string().required('District is required'),
        //     pinCode: Yup.string()
        //         .matches(/^\d{6}$/, 'PIN Code must be exactly 6 digits')
        //         .required('PIN Code is required'),

        //     primaryHealthCenter: Yup.string()
        //         .oneOf(['Yes', 'No'], 'Select Yes or No')
        //         .required('Primary Health Center is required'),
        //     arogySevakName: Yup.string()
        //         .when('primaryHealthCenter', {
        //             is: 'Yes',
        //             then: () => Yup.string().required('Arogya Sevak Name is required')
        //         }),
        //     arogySevakContact: Yup.string()
        //         .when('primaryHealthCenter', {
        //             is: 'Yes',
        //             then: () => Yup.string()
        //                 .matches(/^[6-9]\d{9}$/, 'Invalid contact number')
        //                 .required('Contact number is required')
        //         }),

        //     policeStation: Yup.string()
        //         .oneOf(['Yes', 'No'], 'Select Yes or No')
        //         .required('Police Station is required'),
        //     policeStationDistance: Yup.string()
        //         .when('policeStation', {
        //             is: 'Yes',
        //             then: () => Yup.string().required('Distance is required')
        //         }),
        //     policeAdhikariName: Yup.string()
        //         .when('policeStation', {
        //             is: 'Yes',
        //             then: () => Yup.string().required('Police Adhikari Name is required')
        //         }),
        //     policeAdhikariContact: Yup.string()
        //         .when('policeStation', {
        //             is: 'Yes',
        //             then: () => Yup.string()
        //                 .matches(/^[6-9]\d{9}$/, 'Invalid contact number')
        //                 .required('Contact number is required')
        //         }),

        //     otherCommunityCenter: Yup.string().required('Other Community Center is required'),

        //     templeName: Yup.string().required('Temple Name is required'),

        //     otherReligiousPlace: Yup.object().shape({
        //         type: Yup.string()
        //             .oneOf(['Church', 'Majjid', 'Other', 'None'], 'Invalid religious place type')
        //             .required('Religious Place Type is required'),
        //         specify: Yup.string().when('type', {
        //             is: 'Other',
        //             then: () => Yup.string().required('Please specify Religious Place')
        //         })
        //     }),

        //     utsavOrMela: Yup.string()
        //         .oneOf(['Yes', 'No'], 'Select Yes or No')
        //         .required('Utsav or Mela information is required'),
        //     utsavOrMelaDetails: Yup.string().when('utsavOrMela', {
        //         is: 'Yes',
        //         then: () => Yup.string().required('Utsav or Mela details are required')
        //     }),

        //     roadCondition: Yup.object().shape({
        //         type: Yup.string()
        //             .oneOf(['RCC', 'Asphalt', 'Row and Rough Streets', 'Other'], 'Invalid road condition')
        //             .required('Road Condition is required'),
        //         specify: Yup.string().when('type', {
        //             is: 'Other',
        //             then: () => Yup.string().required('Please specify Road Condition')
        //         })
        //     }),

        //     mobileNetworkCall: Yup.string()
        //         .oneOf(['good', 'weak', 'poor', 'no signal'], 'Invalid network quality')
        //         .required('Mobile Network Call Quality is required'),
        //     mobileNetworkInternet: Yup.string()
        //         .oneOf(['good', 'weak', 'poor', 'no signal'], 'Invalid network quality')
        //         .required('Mobile Network Internet Quality is required'),
        //     goodNetworkSim: Yup.string()
        //         .oneOf(['Airtel', 'VI', 'Jio', 'BSNL'], 'Invalid SIM selection')
        //         .required('Good Network Sim is required'),

        //     sarpanch: Yup.object().shape({
        //         name: Yup.string().required('Sarpanch Name is required'),
        //         contactNo: Yup.string()
        //             .matches(/^[6-9]\d{9}$/, 'Invalid contact number')
        //             .required('Sarpanch Contact Number is required')
        //     }),

        //     pramukh: Yup.object().shape({
        //         name: Yup.string().required('Pramukh Name is required'),
        //         contactNo: Yup.string()
        //             .matches(/^[6-9]\d{9}$/, 'Invalid contact number')
        //             .required('Pramukh Contact Number is required')
        //     }),

        //     mahilaBachatGat: Yup.string()
        //         .oneOf(['Yes', 'No'], 'Select Yes or No')
        //         .required('Mahila Bachat Gat is required'),
        //     mahilaBachatGatGroups: Yup.object().when('mahilaBachatGat', {
        //         is: 'Yes',
        //         then: () => Yup.object().shape({
        //             name: Yup.string().required('Group Name is required'),
        //             numberOfGroups: Yup.string()
        //                 .required('Number of Groups is required'),
        //             sadasyaPerGroup: Yup.string()
        //                 .required('Sadasya per Group is required')
        //         }),
        //         otherwise: () => Yup.object().shape({
        //             name: Yup.string().notRequired(),
        //             numberOfGroups: Yup.string().notRequired(),
        //             sadasyaPerGroup: Yup.string().notRequired()
        //         })
        //     }),

        //     krishiGat: Yup.string()
        //         .oneOf(['Yes', 'No'], 'Select Yes or No')
        //         .required('Krishi Gat is required'),
        //     krishiGatGroups: Yup.object().when('krishiGat', {
        //         is: 'Yes',
        //         then: () => Yup.object().shape({
        //             name: Yup.string().required('Group Name is required'),
        //             numberOfGroups: Yup.string()
        //                 .required('Number of Groups is required'),
        //             sadasyaPerGroup: Yup.string()
        //                 .required('Sadasya per Group is required')
        //         })
        //     }),

        //     primaryAgriculturalProduction: Yup.object().shape({
        //         type: Yup.string()
        //             .oneOf(['Rice', 'Jowar', 'Finger Millet', 'Barnyard Millet', 'Wheat', 'Other'], 'Invalid agricultural production')
        //             .required('Primary Agricultural Production is required'),
        //         specify: Yup.string().when('type', {
        //             is: 'Other',
        //             then: () => Yup.string().required('Please specify Agricultural Production')
        //         })
        //     }),

        //     otherIncomeSource: Yup.object().shape({
        //         type: Yup.string()
        //             .oneOf(['Labour', 'Goats', 'Poultry', 'Mango Tree', 'Other'], 'Invalid income source')
        //             .required('Other Income Source is required'),
        //         specify: Yup.string().when('type', {
        //             is: 'Other',
        //             then: () => Yup.string().required('Please specify Other Income Source')
        //         })
        //     }),

        //     otherInformation: Yup.string()
        // })
    ]
    // State for tracking form progress


    // Function to calculate form progress dynamically

    const calculateFormProgress = (values) => {
        const totalFields = Object.keys(initialFormValues).length;
        const filledFields = Object.values(values).filter(
            (value) => value !== '' && value !== null
        ).length;
        return Math.min(1, filledFields / totalFields);

    };
    return (
        <Formik
            initialValues={initialFormValues}
            // validationSchema={validationSchema}
            onSubmit={handleSubmitForm}
        >
            {({
                handleChange,
                handleSubmit,
                values,
                setFieldValue,
                resetForm,
                touched,
                errors,
                isSubmitting
            }) => {
                // Update form progress

                useEffect(() => {

                    setFormProgress(calculateFormProgress(values));

                }, [values]);

                return (

                    <ScrollView style={styles.container}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Progress Tracking */}

                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                Form Completion: {Math.round(formProgress * 100)}%
                            </Text>
                            <Progress.Bar
                                progress={formProgress}
                                width={null}
                                color="#4CAF50"
                                unfilledColor="#E0E0E0"
                                borderWidth={0}
                                style={styles.progressBar}
                            />

                        </View>
                        {/* Form Title */}

                        <View style={styles.formTitleContainer}>
                            <Text style={styles.formTitle}>Gram Svavalamban Survey</Text>
                        </View>


                        {/* Surveyor Name */}

                        <RequiredLabel required>Surveyor Name</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Surveyer Name"
                            placeholderTextColor="gray"
                            value={userInfo.userName}
                        // editable={false}

                        />

                        {touched.surveyerName && errors.surveyerName && (
                            <Text style={styles.errorText}>{errors.surveyerName}</Text>
                        )}



                        {/* Village Dropdown */}

                        <RequiredLabel required>District</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={[
                                { label: 'Select District', value: '' },
                                ...Object.keys(assignedAreas.districts).map(district => ({
                                    label: district,
                                    value: district
                                }))
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select District"
                            value={values.district}
                            onChange={item => {
                                setSelectedAreas(prev => ({
                                    ...prev,
                                    district: item.value,
                                    subdistrict: '', // Reset subdistrict when district changes
                                    village: '' // Reset village when district changes
                                }));
                                setFieldValue('district', item.value);
                            }}
                        />
                        {touched.district && errors.district && (
                            <Text style={styles.errorText}>{errors.district}</Text>
                        )}

                        <RequiredLabel required>Taluka</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={[
                                { label: 'Select Taluka', value: '' },
                                ...filteredSubdistricts
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Taluka"
                            value={values.taluka}
                            onChange={item => {
                                setSelectedAreas(prev => ({
                                    ...prev,
                                    subdistrict: item.value,
                                    village: '' // Reset village when subdistrict changes
                                }));
                                setFieldValue('taluka', item.value);
                            }}
                        />
                        {touched.taluka && errors.taluka && (
                            <Text style={styles.errorText}>{errors.taluka}</Text>
                        )}
                        <RequiredLabel required>Village</RequiredLabel>
                        <Dropdown
                            style={[
                                styles.dropdown,
                                touched.village && errors.village && styles.errorInput
                            ]}
                            data={[
                                { label: 'Select Village', value: '' },
                                ...filteredVillages
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Village"
                            value={values.village}
                            onChange={item => {
                                setSelectedAreas(prev => ({
                                    ...prev,
                                    village: item.value
                                }));
                                setFieldValue('village', item.value);
                            }}
                        />
                        {touched.village && errors.village && (
                            <Text style={styles.errorText}>{errors.village}</Text>
                        )}
                        {/* PIN Code remains the same */}
                        <RequiredLabel required>Pin Code</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            keyboardType='numeric'
                            maxLength={6}
                            placeholder="Enter 6-digit PIN Code"
                            placeholderTextColor="gray"
                            value={values.pinCode}
                            onChangeText={handleChange('pinCode')}
                        />
                        {touched.pinCode && errors.pinCode && (
                            <Text style={styles.errorText}>{errors.pinCode}</Text>
                        )}
                        {/* Other location dropdowns remain the same */}
                        <RequiredLabel required>Grampanchayat</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Gram Panchayat"
                            placeholderTextColor="gray"
                            onChangeText={handleChange('grampanchayat')}
                            value={values.grampanchayat}
                        />
                        {touched.grampanchayat && errors.grampanchayat && (
                            <Text style={styles.errorText}>{errors.grampanchayat}</Text>
                        )}

                        {/* Primary Health Center */}
                        <RequiredLabel required>Primary Health Center</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.YES_NO}
                            labelField="label"
                            valueField="value"
                            placeholder="Exists?"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.primaryHealthCenter}
                            onChange={item => {
                                setFieldValue('primaryHealthCenter', item.value);
                            }}
                        />
                        {touched.primaryHealthCenter && errors.primaryHealthCenter && (
                            <Text style={styles.errorText}>{errors.primaryHealthCenter}</Text>
                        )}

                        {values.primaryHealthCenter === 'Yes' && (
                            <>
                                <RequiredLabel required>Arogya Sevak Name</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Arogy Sevak Name'
                                    placeholderTextColor="gray"
                                    value={values.arogySevakName}
                                    onChangeText={handleChange('arogySevakName')}
                                />
                                {touched.arogySevakName && errors.arogySevakName && (
                                    <Text style={styles.errorText}>{errors.arogySevakName}</Text>
                                )}

                                <RequiredLabel required>Arogya Sevak Contact</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Arogy Sevak Contact'
                                    keyboardType='numeric'
                                    placeholderTextColor="gray"
                                    maxLength={10}
                                    value={values.arogySevakContact}
                                    onChangeText={handleChange('arogySevakContact')}
                                />
                                {touched.arogySevakContact && errors.arogySevakContact && (
                                    <Text style={styles.errorText}>{errors.arogySevakContact}</Text>
                                )}
                            </>
                        )}

                        {/* Police Station */}
                        <RequiredLabel required>Police Station</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.YES_NO}
                            labelField="label"
                            valueField="value"
                            placeholder="Exists?"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.policeStation}
                            onChange={item => {
                                setFieldValue('policeStation', item.value);
                            }}
                        />
                        {touched.policeStation && errors.policeStation && (
                            <Text style={styles.errorText}>{errors.policeStation}</Text>
                        )}

                        {values.policeStation === 'Yes' && (
                            <>
                                <RequiredLabel required>Police Station Distance</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Police Station Distance'
                                    placeholderTextColor="gray"
                                    value={values.policeStationDistance}
                                    onChangeText={handleChange('policeStationDistance')}
                                />
                                {touched.policeStationDistance && errors.policeStationDistance && (
                                    <Text style={styles.errorText}>{errors.policeStationDistance}</Text>
                                )}
                                <RequiredLabel required>Police Adhikari Name</RequiredLabel>

                                <TextInput
                                    style={styles.input}
                                    placeholder='Police Adhikari Name'
                                    placeholderTextColor="gray"
                                    value={values.policeAdhikariName}
                                    onChangeText={handleChange('policeAdhikariName')}
                                />
                                {touched.policeAdhikariName && errors.policeAdhikariName && (
                                    <Text style={styles.errorText}>{errors.policeAdhikariName}</Text>
                                )}
                                <RequiredLabel required>Police Adhikari Contact</RequiredLabel>

                                <TextInput
                                    style={styles.input}
                                    placeholder='Police Adhikari Contact'
                                    keyboardType='numeric'
                                    placeholderTextColor="gray"
                                    value={values.policeAdhikariContact}
                                    maxLength={10}
                                    onChangeText={handleChange('policeAdhikariContact')}
                                />
                                {touched.policeAdhikariContact && errors.policeAdhikariContact && (
                                    <Text style={styles.errorText}>{errors.policeAdhikariContact}</Text>
                                )}
                            </>
                        )}

                        {/* Other Community Center */}
                        <RequiredLabel required>Other Community Center</RequiredLabel>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter Other Community Center Details"
                            placeholderTextColor="gray"
                            value={values.otherCommunityCenter}
                            onChangeText={handleChange('otherCommunityCenter')}

                        />
                        {touched.otherCommunityCenter && errors.otherCommunityCenter && (
                            <Text style={styles.errorText}>{errors.otherCommunityCenter}</Text>
                        )}


                        {/* Temple */}
                        <RequiredLabel required>Temple</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Temple Name"
                            placeholderTextColor="gray"
                            value={values.templeName}
                            onChangeText={handleChange('templeName')}
                        />
                        {touched.templeName && errors.templeName && (
                            <Text style={styles.errorText}>{errors.templeName}</Text>
                        )}

                        {/* Other Religious Place */}
                        <RequiredLabel required>Other Religious Place</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.RELIGIOUS_PLACE}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Religious Place Type"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.otherReligiousPlace.type}
                            onChange={item => {
                                setFieldValue('otherReligiousPlace.type', item.value);
                            }}
                        />
                        {touched.otherReligiousPlace?.type && errors.otherReligiousPlace?.type && (
                            <Text style={styles.errorText}>{errors.otherReligiousPlace.type}</Text>
                        )}


                        {values.otherReligiousPlace.type === 'Other' && (
                            <>
                                <RequiredLabel required>Specify Other Religious Place</RequiredLabel>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Specify Other Religious Place"
                                    placeholderTextColor="gray"
                                    value={values.otherReligiousPlace.specify}
                                    onChangeText={handleChange('otherReligiousPlace.specify')}
                                />
                                {touched.otherReligiousPlace?.specify && errors.otherReligiousPlace?.specify && (
                                    <Text style={styles.errorText}>{errors.otherReligiousPlace.specify}</Text>
                                )}
                            </>
                        )}

                        {/* Utsav or Mela */}
                        <RequiredLabel required>Utsav or Mela</RequiredLabel>

                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.YES_NO}
                            labelField="label"
                            valueField="value"
                            placeholder="Exists?"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.utsavOrMela}
                            onChange={item => {
                                setFieldValue('utsavOrMela', item.value);
                            }}
                        />
                        {touched.utsavOrMela && errors.utsavOrMela && (
                            <Text style={styles.errorText}>{errors.utsavOrMela}</Text>
                        )}

                        {values.utsavOrMela === 'Yes' && (
                            <>
                                <RequiredLabel required>Enter Utsav or Mela Details</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Utsav or Mela Details"
                                    value={values.utsavOrMelaDetails}
                                    onChangeText={handleChange('utsavOrMelaDetails')}
                                />
                            </>
                        )}
                        {touched.utsavOrMelaDetails && errors.utsavOrMelaDetails && (
                            <Text style={styles.errorText}>{errors.utsavOrMelaDetails}</Text>
                        )}

                        {/* Road Condition */}
                        <RequiredLabel required>Road Condition</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.ROAD_CONDITIONS}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Road Condition"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.roadCondition.type}
                            onChange={item => {
                                setFieldValue('roadCondition.type', item.value);
                            }}
                        />
                        {touched.roadCondition?.type && errors.roadCondition?.type && (
                            <Text style={styles.errorText}>{errors.roadCondition.type}</Text>
                        )}

                        {values.roadCondition.type === 'Other' && (
                            <>
                                <RequiredLabel required>Specify Road Condition</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Specify Road Condition"
                                    placeholderTextColor="gray"
                                    value={values.roadCondition.specify}
                                    onChangeText={handleChange('roadCondition.specify')}
                                />
                                {touched.roadCondition.specify && errors.roadCondition.specify && (
                                    <Text style={styles.errorText}>{errors.roadCondition.specify}</Text>
                                )}
                            </>
                        )}



                        {/* Mobile Network and Sim Fields */}
                        <RequiredLabel required>Mobile Network Call Quality</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.MOBILE_NETWORK}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Call Network Quality"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.mobileNetworkCall}
                            onChange={item => {
                                setFieldValue('mobileNetworkCall', item.value);
                            }}
                        />
                        {touched.mobileNetworkCall && errors.mobileNetworkCall && (
                            <Text style={styles.errorText}>{errors.mobileNetworkCall}</Text>
                        )}

                        <RequiredLabel required>Mobile Network Internet Quality</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.MOBILE_NETWORK}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Internet Network Quality"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.mobileNetworkInternet}
                            onChange={item => {
                                setFieldValue('mobileNetworkInternet', item.value);
                            }}
                        />
                        {touched.mobileNetworkInternet && errors.mobileNetworkInternet && (
                            <Text style={styles.errorText}>{errors.mobileNetworkInternet}</Text>
                        )}

                        <RequiredLabel required>Good Network Sim</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.SIM_NETWORK}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Sim with Good Network"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.goodNetworkSim}
                            onChange={item => {
                                setFieldValue('goodNetworkSim', item.value);
                            }}
                        />
                        {touched.goodNetworkSim && errors.goodNetworkSim && (
                            <Text style={styles.errorText}>{errors.goodNetworkSim}</Text>
                        )}

                        {/* Sarpanch Details */}
                        <RequiredLabel required>Sarpanch Name</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Sarpanch Name"
                            placeholderTextColor="gray"
                            value={values.sarpanch.name}
                            onChangeText={handleChange('sarpanch.name')}
                        />
                        {touched.sarpanch?.name && errors.sarpanch?.name && (
                            <Text style={styles.errorText}>{errors.sarpanch.name}</Text>
                        )}


                        <RequiredLabel required>Sarpanch Contact No</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={10}
                            placeholder="Enter 10-digit Contact Number"
                            placeholderTextColor={"gray"}
                            value={values.sarpanch.contactNo}
                            onChangeText={handleChange('sarpanch.contactNo')}
                        />
                        {touched.sarpanch?.contactNo && errors.sarpanch?.contactNo && (
                            <Text style={styles.errorText}>{errors.sarpanch?.contactNo}</Text>
                        )}

                        {/* Pramukh Details */}
                        <RequiredLabel required>Pramukh Citizen Name</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Pramukh Name"
                            placeholderTextColor="gray"
                            value={values.pramukh.name}
                            onChangeText={handleChange('pramukh.name')}
                        />
                        {touched.pramukh?.name && errors.pramukh?.name && (
                            <Text style={styles.errorText}>{errors.pramukh.name}</Text>
                        )}
                        <RequiredLabel required>Pramukh Citizen Contact No</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={10}
                            placeholder="Enter 10-digit Contact Number"
                            placeholderTextColor={"gray"}
                            value={values.pramukh.contactNo}
                            onChangeText={handleChange('pramukh.contactNo')}
                        />
                        {touched.pramukh?.contactNo && errors.pramukh?.contactNo && (
                            <Text style={styles.errorText}>{errors.pramukh?.contactNo}</Text>
                        )}

                        {/* Mahila Bachat Gat */}
                        <RequiredLabel required>Mahila Bachat Gat</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.YES_NO}
                            labelField="label"
                            valueField="value"
                            placeholder="Active Mahila Bachat Gat"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.mahilaBachatGat}
                            onChange={item => {
                                setFieldValue('mahilaBachatGat', item.value);
                            }}
                        />
                        {touched.mahilaBachatGat && errors.mahilaBachatGat && (
                            <Text style={styles.errorText}>{errors.mahilaBachatGat}</Text>
                        )}

                        {values.mahilaBachatGat === 'Yes' && (
                            <>
                                <RequiredLabel required>Group Name</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder={`Mahila Bachat Gat Group Name`}
                                    placeholderTextColor="gray"
                                    value={values.mahilaBachatGatGroups?.name}
                                    onChangeText={handleChange('mahilaBachatGatGroups.name')}
                                />
                                {touched.mahilaBachatGatGroups?.name && errors.mahilaBachatGatGroups?.name && (
                                    <Text style={styles.errorText}>{errors.mahilaBachatGatGroups.name}</Text>
                                )}
                                <RequiredLabel required>Group Numbers</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder={`Number of Groups`}
                                    placeholderTextColor="gray"
                                    value={values.mahilaBachatGatGroups?.numberOfGroups}
                                    onChangeText={handleChange('mahilaBachatGatGroups.numberOfGroups')}
                                />
                                {touched.mahilaBachatGatGroups?.numberOfGroups && errors.mahilaBachatGatGroups?.numberOfGroups && (
                                    <Text style={styles.errorText}>{errors.mahilaBachatGatGroups.numberOfGroups}</Text>
                                )}
                                <RequiredLabel required>Sadasya per Group</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder={`Sadasya per Group`}
                                    placeholderTextColor="gray"
                                    value={values.mahilaBachatGatGroups?.sadasyaPerGroup}
                                    onChangeText={handleChange('mahilaBachatGatGroups.sadasyaPerGroup')}
                                />
                                {touched.mahilaBachatGatGroups?.sadasyaPerGroup && errors.mahilaBachatGatGroups?.sadasyaPerGroup && (
                                    <Text style={styles.errorText}>{errors.mahilaBachatGatGroups.sadasyaPerGroup}</Text>
                                )}
                            </>
                        )}

                        {/* Similar pattern for Krishi Gat */}
                        <RequiredLabel required>Krishi Gat</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.KRISHI_GAT}
                            labelField="label"
                            valueField="value"
                            placeholder="Exists?"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.krishiGat}
                            onChange={item => {
                                setFieldValue('krishiGat', item.value);
                            }}
                        />
                        {touched.krishiGat && errors.krishiGat && (
                            <Text style={styles.errorText}>{errors.krishiGat}</Text>
                        )}
                        {values.krishiGat === 'Yes' && (
                            <>
                                <RequiredLabel required>Group Name</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder={'Krishi Gat Group Name'}
                                    placeholderTextColor="gray"
                                    value={values.krishiGatGroups.name}
                                    onChangeText={handleChange('krishiGatGroups.name')}
                                />
                                {touched.krishiGatGroups?.name && errors.krishiGatGroups?.name && (
                                    <Text style={styles.errorText}>{errors.krishiGatGroups?.name}</Text>
                                )}
                                <RequiredLabel required>Group Number</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder={'Number of Groups'}
                                    placeholderTextColor="gray"
                                    value={values.krishiGatGroups.numberOfGroups}
                                    onChangeText={handleChange('krishiGatGroups.numberOfGroups')}
                                />
                                {touched.krishiGatGroups?.numberOfGroups && errors.krishiGatGroups?.numberOfGroups && (
                                    <Text style={styles.errorText}>{errors.krishiGatGroups?.numberOfGroups}</Text>
                                )}
                                <RequiredLabel required>Sadasya per Group</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder={'Sadasya per Group'}
                                    placeholderTextColor="gray"
                                    value={values.krishiGatGroups.sadasyaPerGroup}
                                    onChangeText={handleChange('krishiGatGroups.sadasyaPerGroup')}
                                />
                                {touched.krishiGatGroups?.sadasyaPerGroup && errors.krishiGatGroups?.sadasyaPerGroup && (
                                    <Text style={styles.errorText}>{errors.krishiGatGroups.sadasyaPerGroup}</Text>
                                )}
                            </>
                        )}

                        {/* Primary Agricultural Production */}
                        <RequiredLabel required>Primary Agricultural Production</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.AGRICULTURAL_PRODUCTION}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Agricultural Production"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.primaryAgriculturalProduction.type}
                            onChange={item => {
                                setFieldValue('primaryAgriculturalProduction.type', item.value);
                            }}
                        />
                        {touched.primaryAgriculturalProduction?.type && errors.primaryAgriculturalProduction?.type && (
                            <Text style={styles.errorText}>{errors.primaryAgriculturalProduction?.type}</Text>
                        )}
                        {values.primaryAgriculturalProduction.type === 'Other' && (
                            <>
                                <RequiredLabel required>Specify Agricultural Production</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Specify Agricultural Production"
                                    placeholderTextColor="gray"
                                    value={values.primaryAgriculturalProduction.specify}
                                    onChangeText={handleChange('primaryAgriculturalProduction.specify')}
                                />
                                {touched.primaryAgriculturalProduction.specify && errors.primaryAgriculturalProduction.specify && (
                                    <Text style={styles.errorText}>{errors.primaryAgriculturalProduction.specify}</Text>
                                )}
                            </>
                        )}

                        {/* Other Income Source */}
                        <RequiredLabel required>Other Income Source</RequiredLabel>
                        <Dropdown
                            style={styles.dropdown}
                            data={DROPDOWN_OPTIONS.OTHER_INCOME}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Other Income Source"
                            placeholderStyle={styles.placeholderStyle}
                            value={values.otherIncomeSource.type}
                            onChange={item => {
                                setFieldValue('otherIncomeSource.type', item.value);
                            }}
                        />
                        {touched.otherIncomeSource?.type && errors.otherIncomeSource?.type && (
                            <Text style={styles.errorText}>{errors.otherIncomeSource?.type}</Text>
                        )}
                        {values.otherIncomeSource.type === 'Other' && (
                            <>
                                <RequiredLabel required>Specify Other Income Source</RequiredLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Specify Other Income Source"
                                    placeholderTextColor="gray"
                                    value={values.otherIncomeSource.specify}
                                    onChangeText={handleChange('otherIncomeSource.specify')}
                                />
                                {touched.otherIncomeSource.specify && errors.otherIncomeSource.specify && (
                                    <Text style={styles.errorText}>{errors.otherIncomeSource.specify}</Text>
                                )}
                            </>
                        )}

                        {/* Other Information */}
                        <RequiredLabel required>Other Information</RequiredLabel>
                        <TextInput
                            style={styles.input}
                            multiline
                            numberOfLines={4}
                            placeholder="Enter Additional Information"
                            placeholderTextColor="gray"
                            value={values.otherInformation}
                            onChangeText={handleChange('otherInformation')}
                        />
                        {touched.otherInformation && errors.otherInformation && (
                            <Text style={styles.errorText}>{errors.otherInformation}</Text>
                        )}

                        {/* Submit and Reset Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.resetButton]}
                                onPress={() => {
                                    Alert.alert(
                                        'Reset Survey',
                                        'Are you sure you want to reset the entire survey?',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Reset',
                                                style: 'destructive',
                                                onPress: () => resetForm()
                                            }

                                        ]

                                    );

                                }}

                            >

                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.submitButton,
                                    isSubmitting && styles.disabledButton

                                ]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >

                                <Text style={styles.buttonText}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </ScrollView>

                );

            }}
        </Formik>
    );
};

// Styles remain the same as in the previous implementation
// const styles = StyleSheet.create({
//   container: { 
//     margin: 10,
//     padding: 20,
//     paddingBottom: 20, 
//     backgroundColor: '#f5f5f5' 
//   },
//   progressContainer: {
//     marginBottom: 20,
//     alignItems: 'center'
//   },
//   formTitle: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: 24,
//     color: 'orange',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10
//   },
//   progressBar: {
//     borderColor: '#ccc',  
//     marginVertical: 10,
//     marginHorizontal: 20,
//   },
//   progressText: {
//     color: 'black', 
//     fontWeight: 'bold'
//   },
//   label: { 
//     fontSize: 16, 
//     fontWeight: 'bold', 
//     marginTop: 10 
//   },
//   input: { 
//     borderWidth: 1, 
//     borderColor: '#ccc', 
//     padding: 10, 
//     marginVertical: 5, 
//     borderRadius: 5, 
//     backgroundColor: '#fff' 
//   },
//   dropdown: {
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     marginVertical: 5,
//     backgroundColor: 'white'
//   },
//   buttonContainer: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     marginVertical: 20 
//   },
//   error: { 
//     color: 'red', 
//     fontSize: 12, 
//     marginTop: 5 
//   },

// });


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15
    },
    // labelContainer: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   marginTop: 10
    // },
    labelContainer: {

        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        flex: 1, // This ensures all label containers have equal width
        // justifyContent: 'space-between', // Optional: helps distribute space evenly
        // Optional: set a minimum height if you want consistent height
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34495e'
    },
    requiredAsterisk: {
        color: 'red',
        marginLeft: 5,
        fontSize: 16
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'white',
        fontSize: 16
    },
    errorInput: {
        borderColor: '#e74c3c'
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 5
    },
    dropdown: {
        height: 50,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: 'white'
    },
    progressContainer: {
        marginVertical: 15,
        paddingHorizontal: 10
    },
    progressText: {
        textAlign: 'center',
        color: '#333',
        marginBottom: 5
    },
    progressBar: {
        alignSelf: 'stretch',
        height: 10,
        borderRadius: 5
    },
    formTitleContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50'
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#aaa',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 10
    },
    resetButton: {
        backgroundColor: '#e74c3c'
    },
    submitButton: {
        backgroundColor: '#2ecc71'
    },
    disabledButton: {
        opacity: 0.5
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});
export default GramSvavlambanForm;


