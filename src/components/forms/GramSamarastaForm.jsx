// import { View, Text } from 'react-native'
// import React from 'react'

// const GramSamarastaSurvey = () => {
//   return (
//     <View>
//       <Text>GramSamarastaForm</Text>
//     </View>
//   )
// }

// export default GramSamarastaSurvey

import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { API_BASE_URL } from '../../constant/Constatnt';
import useAuth from '../../hooks/auth/useAuth';

const GramSamarastaSurvey = () => {
    const [progress, setProgress] = useState(0);
    const { userInfo, userToken } = useAuth();

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
    // Comprehensive validation schema
    const validationSchema =
        Yup.object().shape({
            surveyerName: Yup.string()
                .required('Surveyer Name is required')
                .min(2, 'Name must be at least 2 characters'),

            village: Yup.string()
                .required('Village is required'),

            grampanchayat: Yup.string()
                .required('Gram Panchayat is required'),

            taluka: Yup.string()
                .required('Taluka is required'),

            district: Yup.string()
                .required('District is required'),

            pinCode: Yup.string()
                .matches(/^\d{6}$/, 'Pin Code must be 6 digits')
                .required('Pin Code is required'),

            villageTemple: Yup.string()
                .oneOf(['Yes', 'No'], 'Please select an option')
                .required('Village Temple status is required'),

            villageTempleName: Yup.string().when('villageTemple', {
                is: 'Yes',
                then: () => Yup.string()
                    .required('Village Temple Name is required')
                    .min(2, 'Temple name must be at least 2 characters'),
            }),

            socialEvents: Yup.array().of(
                Yup.object().shape({
                    eventType: Yup.string()
                        .oneOf(['Ganesh Sthapana', 'Navratri', 'Other'], 'Invalid Event Type')
                        .required('Event Type is required'),
                    otherEventDetails: Yup.string().when('eventType', {
                        is: 'Other',
                        then: () => Yup.string()
                            .required('Other Event Details are required')
                            .min(2, 'Details must be at least 2 characters'),
                    }),
                })
            ),

            utsavMela: Yup.string()
                .oneOf(['Yes', 'No'], 'Please select an option')
                .required('Utsav Mela status is required'),

            utsavMelaDetails: Yup.string().when('utsavMela', {
                is: 'Yes',
                then: () => Yup.string()
                    .required('Utsav Mela Details are required')
                    .min(2, 'Details must be at least 2 characters'),
            }),

            kuldeviTemple: Yup.string()
                .oneOf(['Yes', 'No'], 'Please select an option')
                .required('Kuldevi Temple status is required'),

            kuldeviTempleName: Yup.string().when('kuldeviTemple', {
                is: 'Yes',
                then: () => Yup.string()
                    .required('Kuldevi Temple Name is required')
                    .min(2, 'Temple name must be at least 2 characters'),
            }),

            bhjanMandal: Yup.string()
                .oneOf(['Yes', 'No'], 'Please select an option')
                .required('Bhajan Mandal status is required'),

            bhjanMandalName: Yup.string().when('bhjanMandal', {
                is: 'Yes',
                then: () => Yup.string()
                    .required('Bhajan Mandal Name is required')
                    .min(2, 'Mandal name must be at least 2 characters'),
            }),

            bhjanMandalContactNumber: Yup.string().when('bhjanMandal', {
                is: 'Yes',
                then: () => Yup.string()
                    .matches(/^[0-9]{10}$/, 'Contact Number must be 10 digits')
                    .required('Contact Number is required'),
            }),

            otherSocialWorkOrganizations: Yup.string()
                .oneOf(['Yes', 'No'], 'Please select an option')
                .required('Other Social Work Organizations status is required'),

            otherSocialWorkOrganizationsDetails: Yup.string().when('otherSocialWorkOrganizations', {
                is: 'Yes',
                then: () => Yup.string()
                    .required('Social Work Organizations Details are required')
                    .min(2, 'Details must be at least 2 characters'),
            }),
        });

    // Initial form values
    const initialFormValues = {
        surveyerName: '',
        village: '',
        grampanchayat: '',
        taluka: '',
        district: '',
        pinCode: '',

        festivals: [],

        villageTemple: '',
        villageTempleName: '',

        socialEvents: [{
            eventType: '',
            otherEventDetails: ''
        }],

        utsavMela: '',
        utsavMelaDetails: '',

        kuldeviTemple: '',
        kuldeviTempleName: '',

        bhjanMandal: '',
        bhjanMandalName: '',
        bhjanMandalContactNumber: '',

        otherSocialWorkOrganizations: '',
        otherSocialWorkOrganizationsDetails: '',
    };

    // Calculate progress based on filled fields
    const calculateProgress = (values) => {
        const requiredFields = [
            'surveyerName', 'village', 'grampanchayat', 'taluka',
            'district', 'pinCode', 'villageTemple', 'utsavMela',
            'kuldeviTemple', 'bhjanMandal', 'otherSocialWorkOrganizations'
        ];

        const filledFields = requiredFields.filter(field =>
            values[field] !== undefined &&
            values[field] !== null &&
            values[field] !== ''
        ).length;

        return Math.round((filledFields / requiredFields.length) * 100);
    };

    // Form submission handler
    const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
        try {
            // Prepare the payload, removing any empty or null values
            const cleanedValues = Object.fromEntries(
                Object.entries(values).filter(([_, v]) =>
                    v !== null && v !== '' &&
                    (!(v instanceof Array) || v.length > 0)
                )
            );

            const response = await axios.post(
                `${API_BASE_URL}/api/v1/gram-samrasta`,
                cleanedValues,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                Alert.alert('Success', 'Form submitted successfully!');
                resetForm(); // Reset the form after successful submission
                setProgress(0); // Reset progress
            } else {
                Alert.alert('Error', 'Failed to submit the form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message ||
                'An error occurred while submitting the form. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Gram Samarasta Survey</Text>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.percentageText}>{progress}% Completed</Text>

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
                        touched,
                        isSubmitting
                    }) => {
                        // Recalculate progress when values change
                        useEffect(() => {
                            setProgress(calculateProgress(values));
                        }, [values]);


                        return (
                            <View>

                                <View>
                                    <Text style={styles.label}>
                                        Name of Surveyer <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Surveyer Name"
                                        placeholderTextColor="gray"
                                        onChangeText={handleChange('surveyerName')}
                                        onBlur={handleBlur('surveyerName')}
                                        value={userInfo.userName}
                                    />
                                    {touched.surveyerName && errors.surveyerName && (
                                        <Text style={styles.errorText}>{errors.surveyerName}</Text>
                                    )}


                                    {/* Location Details */}
                                    <Text style={styles.label}>
                                        District <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        data={[
                                            { label: 'Select District', value: '' },
                                            ...Object.keys(assignedAreas.districts).map(district => ({
                                                label: district,
                                                value: district
                                            }))
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        search
                                        searchPlaceholder="Search District..." // Placeholder for search
                                        placeholder="Select District"
                                        value={selectedAreas.district}
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
                                    <Text style={styles.label}>
                                        Taluka <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        data={[
                                            { label: 'Select Taluka', value: '' },
                                            ...filteredSubdistricts
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        search
                                        searchPlaceholder="Search Taluka..." // Placeholder for search
                                        placeholder="Select Taluka"
                                        value={selectedAreas.subdistrict}
                                        disable={!selectedAreas.district} // Disable if no district selected
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
                                    <Text style={styles.label}>
                                        Village <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        data={[
                                            { label: 'Select Village', value: '' },
                                            ...filteredVillages
                                        ]}
                                        labelField="label"
                                        search
                                        searchPlaceholder="Search village..." // Placeholder for search
                                        valueField="value"
                                        placeholder="Select Village"
                                        value={selectedAreas.village}
                                        disable={!selectedAreas.subdistrict} // Disable if no subdistrict selected
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

                                    <Text style={styles.label}>
                                        Gram Panchayat <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Gram Panchayat"
                                        placeholderTextColor="gray"
                                        onChangeText={handleChange('grampanchayat')}
                                        onBlur={handleBlur('grampanchayat')}
                                        value={values.grampanchayat}
                                    />
                                    {touched.grampanchayat && errors.grampanchayat && (
                                        <Text style={styles.errorText}>{errors.grampanchayat}</Text>
                                    )}





                                    <Text style={styles.label}>
                                        Pin Code <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Pin Code"
                                        placeholderTextColor="gray"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        onChangeText={handleChange('pinCode')}
                                        onBlur={handleBlur('pinCode')}
                                        value={values.pinCode}
                                    />
                                    {touched.pinCode && errors.pinCode && (
                                        <Text style={styles.errorText}>{errors.pinCode}</Text>
                                    )}

                                    {/* Village Temple */}
                                    <Text style={styles.label}>
                                        Village Temple <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        data={[
                                            { label: 'Select', value: '' },
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={values.villageTemple}
                                        onChange={item => {
                                            setFieldValue('villageTemple', item.value);
                                            // Clear temple name if No is selected
                                            if (item.value === 'No') {
                                                setFieldValue('villageTempleName', '');
                                            }
                                        }}
                                    />
                                    {touched.villageTemple && errors.villageTemple && (
                                        <Text style={styles.errorText}>{errors.villageTemple}</Text>
                                    )}

                                    {values.villageTemple === 'Yes' && (
                                        <>
                                            <Text style={styles.label}>
                                                Village Temple Name <Text style={styles.requiredMarker}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter Village Temple Name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChange('villageTempleName')}
                                                onBlur={handleBlur('villageTempleName')}
                                                value={values.villageTempleName}
                                            />
                                            {touched.villageTempleName && errors.villageTempleName && (
                                                <Text style={styles.errorText}>{errors.villageTempleName}</Text>
                                            )}
                                        </>
                                    )}

                                    {/* Social Events */}
                                    <FieldArray name="socialEvents">
                                        {({ push, remove }) => (
                                            <>
                                                {values.socialEvents.map((event, index) => (
                                                    <View key={index} style={styles.arrayFieldContainer}>
                                                        <Text style={styles.label}>
                                                            Social Events <Text style={styles.requiredMarker}>*</Text>
                                                        </Text>
                                                        <Dropdown
                                                            style={styles.dropdown}
                                                            placeholderStyle={styles.placeholderStyle}
                                                            selectedTextStyle={styles.selectedTextStyle}
                                                            data={[
                                                                { label: 'Select Event', value: '' },
                                                                { label: 'Ganesh Sthapana', value: 'Ganesh Sthapana' },
                                                                { label: 'Navratri', value: 'Navratri' },
                                                                { label: 'Other', value: 'Other' },
                                                            ]}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder="Select Event"
                                                            value={event.eventType}
                                                            onChange={item => {
                                                                setFieldValue(`socialEvents.${index}.eventType`, item.value);
                                                                // Clear other details if not 'Other'
                                                                if (item.value !== 'Other') {
                                                                    setFieldValue(`socialEvents.${index}.otherEventDetails`, '');
                                                                }
                                                            }}
                                                        />
                                                        {touched.socialEvents?.[index]?.eventType &&
                                                            errors.socialEvents?.[index]?.eventType && (
                                                                <Text style={styles.errorText}>
                                                                    {errors.socialEvents[index].eventType}
                                                                </Text>
                                                            )}

                                                        {event.eventType === 'Other' && (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Other Event Details <Text style={styles.requiredMarker}>*</Text>
                                                                </Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    placeholder="Enter Other Event Details"
                                                                    placeholderTextColor="gray"
                                                                    onChangeText={handleChange(`socialEvents.${index}.otherEventDetails`)}
                                                                    onBlur={handleBlur(`socialEvents.${index}.otherEventDetails`)}
                                                                    value={event.otherEventDetails}
                                                                />
                                                                {touched.socialEvents?.[index]?.otherEventDetails &&
                                                                    errors.socialEvents?.[index]?.otherEventDetails && (
                                                                        <Text style={styles.errorText}>
                                                                            {errors.socialEvents[index].otherEventDetails}
                                                                        </Text>
                                                                    )}
                                                            </>
                                                        )}

                                                        {/* {values.socialEvents.length > 1 && (
                                                            <TouchableOpacity
                                                                style={styles.removeButton}
                                                                onPress={() => remove(index)}
                                                            >
                                                                <Text style={styles.removeButtonText}>Remove Event</Text>
                                                            </TouchableOpacity>
                                                        )} */}
                                                    </View>
                                                ))}
                                                {/* <TouchableOpacity
                                                    style={styles.addButton}
                                                    onPress={() => push({ eventType: '', otherEventDetails: '' })}
                                                >
                                                    <Text style={styles.addButtonText}>Add Another Event</Text>
                                                </TouchableOpacity> */}
                                            </>
                                        )}
                                    </FieldArray>

                                    {/* Utsav Mela */}
                                    <Text style={styles.label}>
                                        Utsav Mela <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        data={[
                                            { label: 'Select', value: '' },
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={values.utsavMela}
                                        onChange={item => {
                                            setFieldValue('utsavMela', item.value);
                                            // Clear details if No is selected
                                            if (item.value === 'No') {
                                                setFieldValue('utsavMelaDetails', '');
                                            }
                                        }}
                                    />
                                    {touched.utsavMela && errors.utsavMela && (
                                        <Text style={styles.errorText}>{errors.utsavMela}</Text>
                                    )}

                                    {values.utsavMela === 'Yes' && (
                                        <>
                                            <Text style={styles.label}>
                                                Utsav Mela Details <Text style={styles.requiredMarker}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter Utsav Mela Details"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChange('utsavMelaDetails')}
                                                onBlur={handleBlur('utsavMelaDetails')}
                                                value={values.utsavMelaDetails}
                                            />
                                            {touched.utsavMelaDetails && errors.utsavMelaDetails && (
                                                <Text style={styles.errorText}>{errors.utsavMelaDetails}</Text>
                                            )}
                                        </>
                                    )}

                                    {/* Kuldevi Temple */}
                                    <Text style={styles.label}>
                                        Kuldevi Temple <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        data={[
                                            { label: 'Select', value: '' },
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={values.kuldeviTemple}
                                        onChange={item => {
                                            setFieldValue('kuldeviTemple', item.value);
                                            // Clear temple name if No is selected
                                            if (item.value === 'No') {
                                                setFieldValue('kuldeviTempleName', '');
                                            }
                                        }}
                                    />
                                    {touched.kuldeviTemple && errors.kuldeviTemple && (
                                        <Text style={styles.errorText}>{errors.kuldeviTemple}</Text>
                                    )}

                                    {values.kuldeviTemple === 'Yes' && (
                                        <>
                                            <Text style={styles.label}>
                                                Kuldevi Temple Name <Text style={styles.requiredMarker}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter Kuldevi Temple Name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChange('kuldeviTempleName')}
                                                onBlur={handleBlur('kuldeviTempleName')}
                                                value={values.kuldeviTempleName}
                                            />
                                            {touched.kuldeviTempleName && errors.kuldeviTempleName && (
                                                <Text style={styles.errorText}>{errors.kuldeviTempleName}</Text>
                                            )}
                                        </>
                                    )}

                                    {/* Bhajan Mandal */}
                                    <Text style={styles.label}>
                                        Bhajan Mandal <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        data={[
                                            { label: 'Select', value: '' },
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={values.bhjanMandal}
                                        onChange={item => {
                                            setFieldValue('bhjanMandal', item.value);
                                            // Clear mandal details if No is selected
                                            if (item.value === 'No') {
                                                setFieldValue('bhjanMandalName', '');
                                                setFieldValue('bhjanMandalContactNumber', '');
                                            }
                                        }}
                                    />
                                    {touched.bhjanMandal && errors.bhjanMandal && (
                                        <Text style={styles.errorText}>{errors.bhjanMandal}</Text>
                                    )}

                                    {values.bhjanMandal === 'Yes' && (
                                        <>
                                            <Text style={styles.label}>
                                                Bhajan Mandal Name <Text style={styles.requiredMarker}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter Bhajan Mandal Name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChange('bhjanMandalName')}
                                                onBlur={handleBlur('bhjanMandalName')}
                                                value={values.bhjanMandalName}
                                            />
                                            {touched.bhjanMandalName && errors.bhjanMandalName && (
                                                <Text style={styles.errorText}>{errors.bhjanMandalName}</Text>
                                            )}

                                            <Text style={styles.label}>
                                                Bhajan Mandal Contact Number <Text style={styles.requiredMarker}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter Contact Number"
                                                placeholderTextColor="gray"
                                                keyboardType="phone-pad"
                                                maxLength={10}
                                                onChangeText={handleChange('bhjanMandalContactNumber')}
                                                onBlur={handleBlur('bhjanMandalContactNumber')}
                                                value={values.bhjanMandalContactNumber}
                                            />
                                            {touched.bhjanMandalContactNumber && errors.bhjanMandalContactNumber && (
                                                <Text style={styles.errorText}>{errors.bhjanMandalContactNumber}</Text>
                                            )}
                                        </>
                                    )}

                                    {/* Other Social Work Organizations */}
                                    <Text style={styles.label}>
                                        Other Social Work Organizations <Text style={styles.requiredMarker}>*</Text>
                                    </Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        data={[
                                            { label: 'Select', value: '' },
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={values.otherSocialWorkOrganizations}
                                        onChange={item => {
                                            setFieldValue('otherSocialWorkOrganizations', item.value);
                                            // Clear details if No is selected
                                            if (item.value === 'No') {
                                                setFieldValue('otherSocialWorkOrganizationsDetails', '');
                                            }
                                        }}
                                    />
                                    {touched.otherSocialWorkOrganizations && errors.otherSocialWorkOrganizations && (
                                        <Text style={styles.errorText}>{errors.otherSocialWorkOrganizations}</Text>
                                    )}

                                    {values.otherSocialWorkOrganizations === 'Yes' && (
                                        <>
                                            <Text style={styles.label}>
                                                Other Social Work Organizations Details <Text style={styles.requiredMarker}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter Social Work Organizations Details"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChange('otherSocialWorkOrganizationsDetails')}
                                                onBlur={handleBlur('otherSocialWorkOrganizationsDetails')}
                                                value={values.otherSocialWorkOrganizationsDetails}
                                            />
                                            {touched.otherSocialWorkOrganizationsDetails && errors.otherSocialWorkOrganizationsDetails && (
                                                <Text style={styles.errorText}>{errors.otherSocialWorkOrganizationsDetails}</Text>
                                            )}
                                        </>
                                    )}



                                </View>


                                <TouchableOpacity
                                    style={styles.nextButton}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.buttonText}>
                                        {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                                    </Text>
                                </TouchableOpacity>



                            </View>
                        )
                    }}
                </Formik>


            </ScrollView>

        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    progressBarContainer: {
        height: 30,
        width: '100%',
        backgroundColor: '#f3f3f3',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
    percentageText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        color: 'black',
    },

    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: hp('10%'),
    },
    backButton: {
        backgroundColor: '#E7E7E7',
        marginRight: 10,
    },
    backButtonText: {
        color: 'gray',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 10
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    label: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        // padding: hp('1.5%'),
        marginBottom: hp('2%'),
        fontSize: hp('2%'),
        color: 'black',
        backgroundColor: '#D9D9D9',
    },

    dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#D9D9D9',
        color: 'black'
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#aaa',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333',
    },
    itemTextStyle: {
        color: 'black', // Dropdown options color
        fontSize: 16,
    },


    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    requiredMarker: {
        color: 'red'
    }


});

export default GramSamarastaSurvey