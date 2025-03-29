import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    Button,
    Alert,
    PermissionsAndroid,
    Pressable,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox'
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_BASE_URL } from '../../../constant/Constatnt';
import { Dropdown } from 'react-native-element-dropdown';

const PartialKIF = () => {


    const [showDatePickerdate, setShowDatePicker] = useState(false);
    const [countries, setCountries] = useState([]);
    const [progress, setProgress] = useState(0);
    const [datePickerVisible, setDatePickerVisible] = useState(null); // Track which field is open
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedFamilyMemberIndex, setSelectedFamilyMemberIndex] = useState(null); // New state for family member index
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [expandedSection, setExpandedSection] = useState('personaldetails'); // State to track expanded section
    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section); // Toggle section
    };
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    const [formValues, setFormValues] = useState({ initialFormValues });
    const [showDropdown, setShowDropdown] = useState(false);




    const handleNext = async (validateForm, setFieldTouched) => {
        // Trigger validation for the current step
        const errors = await validateForm();
        console.log(errors);


        // Set all fields as touched to show errors
        Object.keys(errors).forEach(field => {
            setFieldTouched(field, true);
        });

        // If there are no validation errors, move to the next step
        if (Object.keys(errors).length === 0) {
            setStep(prevStep => Math.min(prevStep + 1, totalSteps));
        }
    };





    const handlePrevious = () => {
        setStep(prevStep => Math.max(prevStep - 1, 1));
    };

    useEffect(() => {
        const fetchStates = async () => {

            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/zoneArea/testAreaRouter/get-zone-json`)
                // console.log("Response received:", response); // Log the entire response

                const zones = response.data;
                // console.log('zones:', zones);

                const allStates = zones.flatMap(zone => zone.states); // Use flatMap for nested arrays
                setStates(allStates);
                // console.log('allStates:', allStates);

            } catch (error) {
                console.error("Error occurred while fetching states:", error); // Log the error object

                if (error.response) {
                    // Server responded with a status code outside the 2xx range
                    console.error("Server responded with an error:", error.response);
                    console.log("Error status:", error.response.status); // Log the status code
                    console.log("Error data:", error.response.data); // Log the error data
                } else if (error.request) {
                    // Request was made but no response was received
                    console.error("No response received:", error.request);
                    alert("Unable to connect to the server. Please check your network.");
                } else {
                    // Something else happened
                    console.error("Error fetching states:", error.message);
                }

                // Optionally set default states or handle the error gracefully
                setStates([]);
            }
        };

        fetchStates();
    }, []);


    const handleStateChange = (value, setFieldValue) => {
        setFieldValue("state", value);
        setFieldValue("district", "");
        setFieldValue("taluka", "");
        setFieldValue("village", "");
        setFieldValue("pincode", "");

        const selectedState = states.find(s => s.StateName === value);
        if (selectedState) {
            const uniqueDistricts = Array.from(new Set(selectedState.districts.map(d => d.Districtname)))
                .map(districtName => selectedState.districts.find(d => d.Districtname === districtName));
            setDistricts(uniqueDistricts);
        } else {
            setDistricts([]);
        }
    };

    const handleDistrictChange = (value, setFieldValue) => {
        setFieldValue("district", value);
        setFieldValue("taluka", "");
        setFieldValue("village", "");
        setFieldValue("pincode", "");

        const selectedDistrict = districts.find(d => d.Districtname === value);
        if (selectedDistrict) {
            const uniqueSubdistricts = Array.from(new Set(selectedDistrict.subdistricts.map(sd => sd['Sub-distname'])))
                .map(talukaName => selectedDistrict.subdistricts.find(sd => sd['Sub-distname'] === talukaName));
            setSubdistricts(uniqueSubdistricts);
        } else {
            setSubdistricts([]);
        }
    };

    const handleSubdistrictChange = (value, setFieldValue) => {
        setFieldValue("taluka", value);
        setFieldValue("village", "");
        setFieldValue("pincode", "");

        const selectedSubdistrict = subdistricts.find(sd => sd['Sub-distname'] === value);
        if (selectedSubdistrict) {
            const uniqueVillages = Array.from(new Set(selectedSubdistrict.details.map(v => v.VillageName)))
                .map(villageName => selectedSubdistrict.details.find(v => v.VillageName === villageName));
            setVillages(uniqueVillages);
        } else {
            setVillages([]);
        }
    };

    const handleVillageChange = (value, setFieldValue) => {
        const selectedVillage = villages.find(v => v.VillageName === value);
        setFieldValue("village", value);
        setFieldValue("pincode", selectedVillage ? selectedVillage.Pincode : "");
    };


    const calculateProgress = (values) => {
        const totalFields = [
            'firstName',
            'middleName',
            'lastName',
            'gender',
            ...(values.gender === 'other' ? ['customGender'] : []),
            'dateOfBirth',
            'nationality',

            //communication details
            'state',
            'district',
            'taluka',
            'village',
            'pincode',
            'houseAddress',
            'landmark',
            'gramPanchayat',
            'primaryMobileRelation',
            'countryCode',
            'primaryMobileNumber',
            'familyMobileNumber',
            'familyRelation',
            'otherFamilyRelation',
            'isWhatsappNumber',
            'secondaryMobile',
            'emergencyContact',
            'emergencyRelation',
            'otherEmergencyRelation',

        ];

        const filledFields = totalFields.filter((field) => {
            const value = values[field];
            return value !== undefined && value !== null && value !== ''; // Check for non-empty values
        }).length;

        return Math.round((filledFields / totalFields.length) * 100);
    };


    const validationSchema = [
        Yup.object().shape({
            firstName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'First name can only contain letters and spaces'
                )
                .required('First Name is required'),
            middleName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Middle name can only contain letters and spaces'
                )
                .required('Middle Name is required'),
            lastName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Last name can only contain letters and spaces'
                )
                .required('Last Name is required'),

            gender: Yup.string().required('Gender is required'),
            customGender: Yup.string().when('gender', {
                is: 'other', // Only apply validation if 'gender' is 'other'
                then: () => Yup.string().required('Custom Gender is required'),
                otherwise: () => Yup.string().notRequired(),
            }),
            nationality: Yup.string().required('Nationality is required'),
            dateOfBirth: Yup.string().required('Date of Birth is required'),
        }),

        Yup.object().shape({
            state: Yup.string().required('State is required'),
            district: Yup.string().required('District is required'),
            taluka: Yup.string().required('Taluka is required'),
            village: Yup.string().required('Village is required'),
            houseAddress: Yup.string().required('House Address is required'),
            landmark: Yup.string().required('Landmark is required'),
            gramPanchayat: Yup.string().required('Grampanchayat is required'),
            primaryMobileRelation: Yup.string().required('Please select relationship'),
            primaryMobileNumber: Yup.string()
                .when('primaryMobileRelation', {
                    is: 'Own',
                    then: () => Yup.string()
                        .matches(/^\d{10}$/, 'Invalid phone number')
                        .required('Primary Phone Number is required'),
                    otherwise: () => Yup.string().notRequired()
                }),
            familyMobileNumber: Yup.string()
                .when('primaryMobileRelation', {
                    is: 'Family Member',
                    then: () => Yup.string()
                        .matches(/^\d{10}$/, 'Invalid phone number')
                        .required('Family Mobile Number is required'),
                    otherwise: () => Yup.string().notRequired()
                }),
            secondaryMobile: Yup.string()
                .matches(/^\d{10}$/, 'Invalid phone number')
                .nullable(),
            emergencyContact: Yup.string()
                .matches(/^\d{10}$/, 'Invalid phone number')
                .notOneOf(
                    [Yup.ref('primaryPhoneNumber')],
                    'Emergency contact number cannot be the same as the primary own number'
                )
                .required('Emergency Contact Number is required'),
        }),


    ];

    const stepNames = ['Personal', 'Communication', 'Preview'];

    const renderStepIndicator = () => {

        const handleStepClick = (targetStep) => {
            if (targetStep !== step) {
                setStep(targetStep); // Update the current step in your parent state
            }
        };
        const indicators = [];
        for (let i = 1; i <= totalSteps; i++) {
            indicators.push(
                <TouchableOpacity onPress={() => handleStepClick(i)} // Navigate to the clicked step
                    key={i} style={styles.stepContainer}>
                    <View style={[styles.stepIndicator, i <= step && styles.activeStep]}>
                        <Text style={[styles.stepText, i <= step && styles.activeStepText]}>
                            {i}
                        </Text>
                    </View>
                    <Text style={[styles.stepName, i === step && styles.activeStepName]}>
                        {stepNames[i - 1]}
                    </Text>
                    {i < totalSteps && (
                        <View style={[styles.line, i < step && styles.activeLine]} />
                    )}
                </TouchableOpacity>,
            );
        }
        return <ScrollView horizontal={true} contentContainerStyle={styles.indicatorContainer}>{indicators}</ScrollView>;
    };

    const handleChangeWithTouch =
        (setFieldValue, setFieldTouched) => fieldName => text => {
            setFieldValue(fieldName, text);
            setFieldTouched(fieldName, true); // Mark the field as touched
        };

    const handleDateChange = (event, selectedDate, setFieldValue) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false); // Hide the date picker after selecting a date

        // Convert date to ISO string before setting it
        setFieldValue('dateOfBirth', currentDate.toISOString());
    };

    const onDateChange = (event, date, setFieldValue) => {
        if (event.type === 'dismissed') {
            setDatePickerVisible(null); // Close the date picker if dismissed
            return;
        }
        if (date) {
            const formattedDate = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
            if (selectedFamilyMemberIndex !== null) {
                // Update the specific family member's DOB
                setFieldValue(`otherFamilyMembers[${selectedFamilyMemberIndex}].dob`, formattedDate);
            } else {
                setFieldValue(datePickerVisible, formattedDate); // Update Formik field value
            }
            setDatePickerVisible(null); // Close the date picker
        }
    };

    const initialFormValues = {
        //personal details
        role: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        customGender: '',
        nationality: 'India',
        dateOfBirth: new Date().toISOString(),

        //Communication details
        state: '',
        district: '',
        taluka: '',
        village: '',
        pincode: '',
        houseAddress: '',
        landmark: '',
        gramPanchayat: '',
        email: '',
        primaryMobileRelation: '',
        countryCode: '+91',
        primaryMobileNumber: '',
        familyMobileNumber: '',
        familyRelation: '',
        otherFamilyRelation: '',
        isWhatsappNumber: false,
        whatsappNumber: '',
        secondaryMobile: '',
        emergencyContact: '',
        emergencyRelation: '',
        otherEmergencyRelation: '',



    };

    // Form submission handler
    const handleSubmitform = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();

        const appendFile = (key, fileData) => {
            if (fileData && fileData.uri) {
                formData.append(key, {
                    uri: fileData.uri,
                    type: fileData.type || 'image/jpeg',
                    name: fileData.fileName || `${key}.jpg`,
                });
            } else if (fileData && typeof fileData === 'string') {
                formData.append(key, fileData);
            }
        };

        // Handle vehicles array
        if (values.vehicles?.length > 0) {
            formData.append('vehicles', JSON.stringify(values.vehicles.map(vehicle => {
                const { numberplatephoto, ...vehicleData } = vehicle;
                return vehicleData;
            })));

            values.vehicles.forEach((vehicle, index) => {
                if (vehicle.numberplatephoto) {
                    appendFile(`numberplatephoto_${index}`, vehicle.numberplatephoto);
                }
            });
        }

        // Handle otherFamilyMembers array
        if (values.otherFamilyMembers?.length > 0) {
            formData.append('otherFamilyMembers', JSON.stringify(values.otherFamilyMembers));
        }

        // Handle main files
        appendFile('photo', values.photo);
        appendFile('licenseFile', values.licenseFile);

        // Append other regular fields
        Object.entries(values).forEach(([key, value]) => {
            if (
                key !== 'vehicles' &&
                key !== 'otherFamilyMembers' &&
                key !== 'photo' &&
                key !== 'licenseFile' &&
                value !== undefined
            ) {
                formData.append(key, value === null ? 'null' : value);
            }
        });

        try {
            setSubmitting(true);
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/userKif/post-kif`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            console.log('User Submit successfully:', response.data);
            Alert.alert(
                'Success',
                'Data submitted successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reset form to initial values
                            resetForm({ values: initialFormValues });
                            // Reset progress
                            setProgress(0);
                            // Reset step if you're using multi-step form
                            if (typeof setStep === 'function') {
                                setStep(1);
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            console.error(
                'Error submitting user:',
                error.response ? error.response.data : error.message
            );
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Error submitting data. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };




    const emailDomains = ['@gmail.com', '@yahoo.com', '@outlook.com'];

    const handleEmailChange = (text, setFieldValue) => {
        // Check if text contains '@' and it's not at the end
        const atIndex = text.lastIndexOf('@');
        if (atIndex !== -1 && atIndex !== text.length - 1) {
            const domainPart = text.slice(atIndex).toLowerCase();
            // Filter domains that match what user has typed after @
            const filteredDomains = emailDomains.filter(domain =>
                domain.toLowerCase().startsWith(domainPart)
            );
            setShowDropdown(filteredDomains.length > 0);
        } else if (text.endsWith('@')) {
            // Show all domains when user just typed @
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }

        // Update the field value
        setFieldValue('email', text);
    };

    const handleDomainSelect = (domain, values, setFieldValue) => {
        const userPart = values.email.split('@')[0];
        const newEmail = userPart + domain;
        setFieldValue('email', newEmail);
        setShowDropdown(false);
    };

    const handleCheckboxChange = (checked, setFieldValue, values) => {
        setFieldValue('isWhatsappNumber', checked);
        // If checked, set WhatsApp number to primary mobile number
        if (checked) {
            setFieldValue('whatsappNumber', values.primaryMobileNumber);
        } else {
            setFieldValue('whatsappNumber', ''); // Clear WhatsApp number when unchecked
        }
    };


    return (
        <View style={styles.container}>
            <Text style={{ color: 'black', alignSelf: 'center', padding: '20' }}>Update Profile</Text>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.percentageText}>{progress}% Completed</Text>

            <View>
                {renderStepIndicator()}
                <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={formValues}
                        validationSchema={validationSchema[step - 1]}
                        validateOnChange
                        validateOnBlur
                        onSubmit={handleSubmitform}>
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            setFieldTouched,
                            values,
                            errors,
                            touched,
                            validateForm,

                        }) => {

                            // Recalculate progress when values change
                            useEffect(() => {
                                setProgress(calculateProgress(values));
                            }, [values]);

                            useEffect(() => {
                                const fetchCountries = async () => {
                                    try {
                                        const response = await fetch('https://restcountries.com/v2/all');
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        const data = await response.json();
                                        const countryOptions = data.map(country => ({
                                            label: country.name === 'India' ? 'Bharat' : country.name,
                                            value: country.name === 'India' ? 'Bharat' : country.name,
                                            code: country.callingCodes[0] ? `+${country.callingCodes[0]}` : '',
                                        }));

                                        setCountries(countryOptions);

                                        // Set default to India/Bharat
                                        const indiaCountry = countryOptions.find(
                                            (country) => country.value === 'Bharat'
                                        );
                                        if (indiaCountry) {
                                            setFieldValue('nationality', indiaCountry.value);
                                            setFieldValue('countryCode', indiaCountry.code);
                                        }
                                    } catch (error) {
                                        console.error('Error fetching countries:', error);
                                    }
                                };

                                fetchCountries();
                            }, [setFieldValue]);

                            return (
                                <View>
                                    {step === 1 && ( //personal Details
                                        <View>

                                            <Text style={styles.label}>Role<Text style={{ color: 'red' }}>*</Text></Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={[
                                                    { label: 'Select Role', value: '' },
                                                    { label: 'Anchal', value: 'Anchal' },
                                                    { label: 'Sankul', value: 'Sankul' },
                                                    { label: 'Sanch', value: 'Sanch' },
                                                    { label: 'Upsanch', value: 'Upsanch' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                value={values.role}
                                                onChange={item => setFieldValue('role', item.value)}
                                            />
                                            {touched.role && errors.role && (
                                                <Text style={styles.error}>{errors.role}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                First Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('firstName')}
                                                onBlur={handleBlur('firstName')}
                                                value={values.firstName}
                                            />
                                            {touched.firstName && errors.firstName && (
                                                <Text style={styles.error}>{errors.firstName}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                Middle Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your middle name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('middleName')}
                                                onBlur={handleBlur('middleName')}
                                                value={values.middleName}
                                            />
                                            {touched.middleName && errors.middleName && (
                                                <Text style={styles.error}>{errors.middleName}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                Last Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your last name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('lastName')}
                                                onBlur={handleBlur('lastName')}
                                                value={values.lastName}
                                            />
                                            {touched.lastName && errors.lastName && (
                                                <Text style={styles.error}>{errors.lastName}</Text>
                                            )}


                                            {/* Gender Field */}
                                            <Text style={styles.label}>Gender <Text style={{ color: 'red' }}>*</Text></Text>
                                            <Picker
                                                selectedValue={values.gender}
                                                onValueChange={(itemValue) => setFieldValue('gender', itemValue)} // Use `setFieldValue` to update `gender`
                                                style={styles.input}>
                                                <Picker.Item label="Select Gender" value="" />
                                                <Picker.Item label="Male" value="Male" />
                                                <Picker.Item label="Female" value="Female" />
                                                <Picker.Item label="Other" value="Other" />
                                            </Picker>

                                            {touched.gender && errors.gender && (
                                                <Text style={styles.error}>{errors.gender}</Text>
                                            )}

                                            {/* Conditionally render 'Other Gender' input if 'Other' is selected */}
                                            {values.gender === 'Other' && (
                                                <View>
                                                    <Text style={styles.label}>
                                                        Please specify your gender<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter your gender"
                                                        onChangeText={handleChange('customGender')}
                                                        onBlur={handleBlur('customGender')}
                                                        value={values.customGender}
                                                    />
                                                    {touched.customGender && errors.customGender && (
                                                        <Text style={styles.error}>
                                                            {errors.customGender}
                                                        </Text>
                                                    )}
                                                </View>
                                            )}

                                            {/* Date of Birth */}
                                            <Text style={styles.label}>Date of Birth <Text style={{ color: 'red' }}>*</Text></Text>
                                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                                <TextInput
                                                    style={styles.input}
                                                    editable={false}
                                                    value={
                                                        values.dateOfBirth
                                                            ? new Date(values.dateOfBirth).toLocaleDateString(
                                                                'en-GB',
                                                            ) // Format as DD/MM/YYYY
                                                            : 'DD/MM/YYYY' // Placeholder text
                                                    }
                                                    placeholder='DD/MM/YYYY'
                                                />
                                            </TouchableOpacity>

                                            {/* Show DatePicker when pressed */}
                                            {showDatePickerdate && (
                                                <DateTimePicker
                                                    value={new Date(values.dateOfBirth || Date.now())} // Default to current date
                                                    mode="date"
                                                    display="default"
                                                    onChange={(event, selectedDate) =>
                                                        handleDateChange(event, selectedDate, setFieldValue)
                                                    }
                                                    maximumDate={new Date(2006, 11, 31)} // December 31, 2006

                                                />
                                            )}

                                            {touched.dateOfBirth && errors.dateOfBirth && (
                                                <Text style={styles.error}>{errors.dateOfBirth}</Text>
                                            )}

                                            <Text style={styles.label}>Nationality *</Text>
                                            <Picker
                                                selectedValue={values.nationality}
                                                onValueChange={(itemValue) => {
                                                    setFieldValue('nationality', itemValue);
                                                    // Find and set the corresponding country code
                                                    const selectedCountry = countries.find(country => country.value === itemValue);
                                                    if (selectedCountry) {
                                                        setFieldValue('countryCode', selectedCountry.code);
                                                    }
                                                }}
                                                style={styles.input}
                                            >
                                                {countries.map((country) => (
                                                    <Picker.Item key={country.value} label={country.label} value={country.value} />
                                                ))}
                                            </Picker>
                                            {errors.nationality && touched.nationality && (
                                                <Text style={styles.error}>{errors.nationality}</Text>
                                            )}

                                        </View>
                                    )}


                                    {step === 2 && (//Communication Details
                                        <View>
                                            {/* State, District, Taluka, Village */}
                                            <Text style={styles.label}>
                                                State <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={states.map(state => ({ label: state.StateName, value: state.StateName }))}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select State"
                                                value={values.state}
                                                onChange={item => {
                                                    setFieldValue('state', item.value);
                                                    handleStateChange(item.value, setFieldValue); // Call the handler for further logic
                                                }}
                                            />
                                            {touched.state && errors.state && (
                                                <Text style={styles.error}>{errors.state}</Text>
                                            )}

                                            {/* District Dropdown */}
                                            <Text style={styles.label}>
                                                District <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={districts.map(district => ({ label: district.Districtname, value: district.Districtname }))}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select District"
                                                value={values.district}
                                                onChange={item => {
                                                    setFieldValue('district', item.value);
                                                    handleDistrictChange(item.value, setFieldValue); // Call the handler for further logic
                                                }}
                                            />
                                            {touched.district && errors.district && (
                                                <Text style={styles.error}>{errors.district}</Text>
                                            )}
                                            {/* Taluka Dropdown */}
                                            <Text style={styles.label}>
                                                Taluka <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={subdistricts.map(taluka => ({ label: taluka['Sub-distname'], value: taluka['Sub-distname'] }))}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Taluka"
                                                value={values.taluka}
                                                onChange={item => {
                                                    setFieldValue('taluka', item.value);
                                                    handleSubdistrictChange(item.value, setFieldValue); // Call the handler for further logic
                                                }}
                                            />
                                            {touched.taluka && errors.taluka && (
                                                <Text style={styles.error}>{errors.taluka}</Text>
                                            )}
                                            {/* Village Dropdown */}
                                            <Text style={styles.label}>
                                                Village <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={villages.map(village => ({ label: village.VillageName, value: village.VillageName }))}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Village"
                                                value={values.village}
                                                onChange={item => {
                                                    setFieldValue('village', item.value);
                                                    handleVillageChange(item.value, setFieldValue); // Call the handler for further logic
                                                }}
                                            />
                                            {touched.village && errors.village && (
                                                <Text style={styles.error}>{errors.village}</Text>
                                            )}


                                            <Text style={styles.label}>
                                                Pincode <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Pincode"
                                                placeholderTextColor={'#aaa'}
                                                value={values.pincode}
                                                editable={false}
                                            />
                                            {touched.pincode && errors.pincode && (
                                                <Text style={styles.error}>{errors.pincode}</Text>
                                            )}
                                            {/* House Address, Landmark, gramPanchayat */}
                                            <Text style={styles.label}>
                                                House Address <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your house address"
                                                placeholderTextColor={'#aaa'}
                                                onChangeText={handleChange('houseAddress')}
                                                onBlur={handleBlur('houseAddress')}
                                                value={values.houseAddress}
                                            />
                                            {touched.houseAddress && errors.houseAddress && (
                                                <Text style={styles.error}>{errors.houseAddress}</Text>
                                            )}

                                            <Text style={styles.label}>
                                                Landmark<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter landmark"
                                                placeholderTextColor={'#aaa'}
                                                onChangeText={handleChange('landmark')}
                                                onBlur={handleBlur('landmark')}
                                                value={values.landmark}
                                            />
                                            {touched.landmark && errors.landmark && (
                                                <Text style={styles.error}>{errors.landmark}</Text>
                                            )}

                                            <Text style={styles.label}>
                                                Gram Panchayat<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter gramPanchayat"
                                                placeholderTextColor={'#aaa'}
                                                onChangeText={handleChange('gramPanchayat')}
                                                onBlur={handleBlur('gramPanchayat')}
                                                value={values.gramPanchayat}
                                            />
                                            {touched.gramPanchayat && errors.gramPanchayat && (
                                                <Text style={styles.error}>{errors.gramPanchayat}</Text>
                                            )}

                                            <Text style={styles.label}>Email</Text>
                                            <View style={{ position: 'relative' }}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter your email"
                                                    placeholderTextColor={'#aaa'}
                                                    onChangeText={(text) => {
                                                        handleEmailChange(text, setFieldValue);
                                                        handleChange('email')(text);
                                                    }}
                                                    onBlur={handleBlur('email')}
                                                    value={values.email}
                                                    autoCapitalize="none"
                                                    keyboardType="email-address"
                                                />
                                                {showDropdown && (
                                                    <View style={{
                                                        position: 'absolute',
                                                        top: 40,
                                                        left: 0,
                                                        width: '100%',
                                                        backgroundColor: 'white',
                                                        borderWidth: 1,
                                                        borderTopWidth: 0,
                                                        borderColor: '#ccc',
                                                        zIndex: 1000,
                                                        elevation: 5, // for Android
                                                    }}>
                                                        {emailDomains
                                                            .filter(domain => {
                                                                const atIndex = values.email.lastIndexOf('@');
                                                                if (atIndex === -1) return true;
                                                                const domainPart = values.email.slice(atIndex).toLowerCase();
                                                                return domain.toLowerCase().startsWith(domainPart);
                                                            })
                                                            .map((domain, index) => (
                                                                <Pressable
                                                                    key={index}
                                                                    style={({ pressed }) => ({
                                                                        padding: 8,
                                                                        borderBottomWidth: 1,
                                                                        borderColor: '#ccc',
                                                                        backgroundColor: pressed ? '#e9e9e9' : '#f9f9f9',
                                                                    })}
                                                                    onPress={() => handleDomainSelect(domain, values, setFieldValue)}
                                                                >
                                                                    <Text>{domain}</Text>
                                                                </Pressable>
                                                            ))}
                                                    </View>
                                                )}
                                            </View>
                                            {touched.email && errors.email && (
                                                <Text style={{ color: 'red', marginTop: 5 }}>{errors.email}</Text>
                                            )}

                                            {/* Primary Phone Number */}
                                            <Text style={styles.label}>
                                                Primary Phone Number <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Picker
                                                style={styles.input}
                                                selectedValue={values.primaryMobileRelation}
                                                onValueChange={value => setFieldValue('primaryMobileRelation', value)}
                                            >
                                                <Picker.Item label="Select" value="" />
                                                <Picker.Item label="Own" value="Own" />
                                                <Picker.Item label="Family" value="Family Member" />
                                            </Picker>
                                            {touched.primaryMobileRelation && errors.primaryMobileRelation && (
                                                <Text style={styles.error}>{errors.primaryMobileRelation}</Text>
                                            )}

                                            {values.primaryMobileRelation === 'Own' && (
                                                <>
                                                    <Text style={styles.label}>
                                                        Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <TextInput
                                                            style={[styles.input, { flex: 0.6 }]}
                                                            keyboardType="phone-pad"
                                                            onChangeText={handleChange('countryCode')}
                                                            onBlur={handleBlur('countryCode')}
                                                            value={values.countryCode}
                                                            editable={false}
                                                        />

                                                        <TextInput
                                                            style={[styles.input, { flex: 3 }]}
                                                            placeholder="Enter your phone number"
                                                            placeholderTextColor={'#aaa'}
                                                            keyboardType="phone-pad"
                                                            onChangeText={(text) => {
                                                                handleChange('primaryMobileNumber')(text);
                                                                // If checkbox is checked, update WhatsApp number as well
                                                                if (values.isWhatsappNumber) {
                                                                    setFieldValue('whatsappNumber', text);
                                                                }
                                                            }}
                                                            onBlur={handleBlur('primaryMobileNumber')}
                                                            value={values.primaryMobileNumber}
                                                        />
                                                    </View>
                                                    {touched.primaryMobileNumber && errors.primaryMobileNumber && (
                                                        <Text style={styles.error}>{errors.primaryMobileNumber}</Text>
                                                    )}

                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <CheckBox
                                                            value={values.isWhatsappNumber}
                                                            onValueChange={(checked) => handleCheckboxChange(checked, setFieldValue, values)}
                                                            tintColors={{ true: 'black', false: 'black' }}
                                                        />
                                                        <Text style={styles.label}>Use as WhatsApp number</Text>
                                                    </View>
                                                </>
                                            )}

                                            {values.primaryMobileRelation === 'Family Member' && (
                                                <>
                                                    <Text style={styles.label}>
                                                        Family Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                        <TextInput
                                                            style={[styles.input, { flex: 0.6 }]}
                                                            keyboardType="phone-pad"
                                                            onChangeText={handleChange('countryCode')}
                                                            onBlur={handleBlur('countryCode')}
                                                            value={values.countryCode}
                                                            editable={false}

                                                        />
                                                        <TextInput
                                                            style={[styles.input, { flex: 3 }]}
                                                            placeholder="Enter your phone number"
                                                            placeholderTextColor={'#aaa'}
                                                            keyboardType="phone-pad"
                                                            onChangeText={handleChange('familyMobileNumber')}
                                                            onBlur={handleBlur('familyMobileNumber')}
                                                            value={values.familyMobileNumber}
                                                        />

                                                    </View>
                                                    {touched.familyMobileNumber && errors.familyMobileNumber && (
                                                        <Text style={styles.error}>{errors.familyMobileNumber}</Text>
                                                    )}
                                                    <Text style={styles.label}>
                                                        Select Relation<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <Picker
                                                        selectedValue={values.familyRelation}
                                                        onValueChange={value => setFieldValue('familyRelation', value)}
                                                        style={styles.input}
                                                    >
                                                        <Picker.Item label="Parent" value="Parent" />
                                                        <Picker.Item label="Siblings" value="Sibling" />
                                                        <Picker.Item label="Spouse" value="Spouse" />
                                                        <Picker.Item label="Other" value="Other" />
                                                    </Picker>
                                                    {touched.familyRelation && errors.familyRelation && (
                                                        <Text style={styles.error}>{errors.familyRelation}</Text>
                                                    )}
                                                    {values.familyRelation === 'other' && (
                                                        <View>
                                                            <Text style={styles.label}>
                                                                Specify Relation<Text style={{ color: 'red' }}>*</Text>
                                                            </Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder="Specify relation"
                                                                placeholderTextColor={'#aaa'}
                                                                onChangeText={handleChange('otherFamilyRelation')}
                                                                onBlur={handleBlur('otherFamilyRelation')}
                                                                value={values.otherFamilyRelation}
                                                            />

                                                        </View>
                                                    )}
                                                    {touched.otherFamilyRelation && errors.otherFamilyRelation && (
                                                        <Text style={styles.error}>{errors.otherFamilyRelation}</Text>
                                                    )}
                                                </>
                                            )}

                                            <Text style={styles.label}>
                                                WhatsApp Number<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <TextInput
                                                    style={[styles.input, { flex: 0.6 }]}
                                                    keyboardType="phone-pad"
                                                    onChangeText={handleChange('countryCode')}
                                                    onBlur={handleBlur('countryCode')}
                                                    value={values.countryCode}
                                                    editable={false}

                                                />

                                                <TextInput
                                                    style={[styles.input, { flex: 3 }]}
                                                    placeholder="Enter your Whatsapp Number"
                                                    placeholderTextColor={'#aaa'}
                                                    keyboardType="phone-pad"
                                                    onChangeText={handleChange('whatsappNumber')}
                                                    onBlur={handleBlur('whatsappNumber')}
                                                    value={values.whatsappNumber}

                                                />
                                            </View>

                                            {/* Secondary Phone Number */}
                                            <Text style={styles.label}>
                                                Secondary Phone Number<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <View>

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                    <TextInput
                                                        style={[styles.input, { flex: 0.6 }]}
                                                        keyboardType="phone-pad"
                                                        onChangeText={handleChange('countryCode')}
                                                        onBlur={handleBlur('countryCode')}
                                                        value={values.countryCode}
                                                        editable={false}

                                                    />
                                                    <TextInput
                                                        style={[styles.input, { flex: 3 }]}
                                                        placeholder="Enter secondary phone number"
                                                        placeholderTextColor={'#aaa'}
                                                        keyboardType="phone-pad"
                                                        onChangeText={handleChange('secondaryMobile')}
                                                        onBlur={handleBlur('secondaryMobile')}
                                                        value={values.secondaryMobile}
                                                    />
                                                </View>
                                                {touched.secondaryMobile && errors.secondaryMobile && (
                                                    <Text style={styles.error}>{errors.secondaryMobile}</Text>
                                                )}
                                            </View>
                                            {/* Emergency Contact Number */}
                                            <Text style={styles.label}>
                                                Emergency Contact Number<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <View>

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                    <TextInput
                                                        style={[styles.input, { flex: 0.6 }]}
                                                        keyboardType="phone-pad"
                                                        onChangeText={handleChange('countryCode')}
                                                        onBlur={handleBlur('countryCode')}
                                                        value={values.countryCode}
                                                        editable={false}

                                                    />
                                                    <TextInput
                                                        style={[styles.input, { flex: 3 }]}
                                                        placeholder="Enter emergency contact number"
                                                        placeholderTextColor={'#aaa'}
                                                        keyboardType="phone-pad"
                                                        onChangeText={handleChange('emergencyContact')}
                                                        onBlur={handleBlur('emergencyContact')}
                                                        value={values.emergencyContact}
                                                    />
                                                </View>
                                                {touched.emergencyContact && errors.emergencyContact && (
                                                    <Text style={styles.error}>{errors.emergencyContact}</Text>
                                                )}
                                            </View>

                                            <Text style={styles.label}>
                                                Emergency Select relation<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Picker
                                                selectedValue={values.emergencyRelation}
                                                onValueChange={value => setFieldValue('emergencyRelation', value)}
                                                style={styles.input}
                                            >
                                                <Picker.Item label="Parent" value="parent" />
                                                <Picker.Item label="Siblings" value="siblings" />
                                                <Picker.Item label="Other" value="other" />
                                            </Picker>
                                            {touched.emergencyRelation && errors.emergencyRelation && (
                                                <Text style={styles.error}>{errors.emergencyRelation}</Text>
                                            )}

                                            {values.emergencyRelation === 'other' && (
                                                <>
                                                    <Text style={styles.label}>
                                                        Specify the relation<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Specify relation"
                                                        placeholderTextColor={'#aaa'}
                                                        onChangeText={handleChange('otherEmergencyRelation')}
                                                        onBlur={handleBlur('otherEmergencyRelation')}
                                                        value={values.otherEmergencyRelation}
                                                    />
                                                    {touched.otherEmergencyRelation && errors.otherEmergencyRelation && (
                                                        <Text style={styles.error}>{errors.otherEmergencyRelation}</Text>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    )}


                                    {step === 3 && (//Preview
                                        <View style={{ padding: 10 }}>

                                            {/* personal details   */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('personaldetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Personal Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'personaldetails' && (
                                                    <View>
                                                        <Text style={styles.label}>
                                                            First Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.firstName} readOnly />

                                                        <Text style={styles.label}>
                                                            Middle Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.middleName} readOnly />

                                                        <Text style={styles.label}>
                                                            Last Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.lastName} readOnly />

                                                        {/* Gender Field */}
                                                        <Text style={styles.label}>
                                                            Gender <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} readOnly value={values.gender} />
                                                        {values.gender === 'other' && (
                                                            <View>
                                                                <Text style={styles.label}>
                                                                    Please specify your gender <Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} readOnly value={values.customGender} />
                                                            </View>
                                                        )}

                                                        {/* Date of Birth */}
                                                        <Text style={styles.label}>
                                                            Date of Birth <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            editable={false}
                                                            value={
                                                                values.dateOfBirth
                                                                    ? new Date(values.dateOfBirth).toLocaleDateString('en-GB')
                                                                    : 'DD/MM/YYYY'
                                                            }
                                                        />
                                                        {/* Nationality Field */}
                                                        <Text style={styles.label}>Nationality *</Text>
                                                        <TextInput style={styles.input} readOnly value={values.nationality} />

                                                    </View>
                                                )}

                                            </View>



                                            {/* Communication Details */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('Cmmunicationdetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Communication Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'Cmmunicationdetails' && (
                                                    <View>
                                                        {/* State, District, Taluka, Village */}
                                                        <Text style={styles.label}>
                                                            State <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.state} readOnly />


                                                        {/* District Dropdown */}
                                                        <Text style={styles.label}>
                                                            District <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.district} readOnly />

                                                        {/* Taluka Dropdown */}
                                                        <Text style={styles.label}>
                                                            Taluka <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.taluka} readOnly />

                                                        {/* Village Dropdown */}
                                                        <Text style={styles.label}>
                                                            Village <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.village} readOnly />


                                                        <Text style={styles.label}>
                                                            Pincode <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={values.pincode}
                                                            readOnly
                                                        />

                                                        {/* House Address, Landmark, gramPanchayat */}
                                                        <Text style={styles.label}>
                                                            House Address <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.houseAddress}
                                                        />

                                                        <Text style={styles.label}>
                                                            Landmark<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.landmark}
                                                        />

                                                        <Text style={styles.label}>
                                                            gramPanchayat<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.gramPanchayat}
                                                        />
                                                        <Text style={styles.label}>
                                                            Email<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.email}
                                                        />

                                                        {/* Primary Phone Number */}
                                                        <Text style={styles.label}>
                                                            Primary Phone Number <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.primaryMobileRelation} readOnly />


                                                        {values.primaryMobileRelation === 'Own' ? (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.primaryMobileNumber}
                                                                    />
                                                                </View>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Family Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.familyMobileNumber}
                                                                    />
                                                                </View>
                                                                <Text style={styles.label}>
                                                                    Select relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} value={values.familyRelation} readOnly />

                                                                {values.familyRelation === 'Other' && (
                                                                    <View>
                                                                        <Text style={styles.label}>
                                                                            Specify relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.otherFamilyRelation}
                                                                        />
                                                                    </View>
                                                                )}
                                                            </>
                                                        )}


                                                        {/* Secondary Phone Number */}
                                                        <Text style={styles.label}>
                                                            Secondary Phone Number<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                            <TextInput
                                                                style={[styles.input, { flex: 1 }]}
                                                                readOnly
                                                                value={values.countryCode}
                                                            />
                                                            <TextInput
                                                                style={[styles.input, { flex: 3 }]}
                                                                readOnly
                                                                value={values.secondaryMobile}
                                                            />
                                                        </View>
                                                        {/* 
                                                        {values.secondaryPhoneType === 'own' ? (
                                                            <View>
                                                                <Text style={styles.label}>
                                                                    Enter Secondary Phone Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.secondaryMobile}
                                                                    />
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Family Secondary Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.FamilysecondaryMobile}
                                                                    />
                                                                </View>
                                                                <Text style={styles.label}>
                                                                    Select relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} value={values.secondaryPhonerelationToRelativearray} readOnly />

                                                                {values.secondaryPhonerelationToRelativearray === 'other' && (
                                                                    <View>
                                                                        <Text style={styles.label}>
                                                                            Specify relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.secondaryPhonerelationToRelativearrayOther}
                                                                        />
                                                                    </View>
                                                                )}
                                                            </>
                                                        )} */}

                                                        {/* Emergency Contact Number */}
                                                        <Text style={styles.label}>
                                                            Emergency Contact Number<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                            <TextInput
                                                                style={[styles.input, { flex: 1 }]}
                                                                readOnly
                                                                value={values.countryCode}
                                                            />
                                                            <TextInput
                                                                style={[styles.input, { flex: 3 }]}
                                                                readOnly
                                                                value={values.emergencyContact}
                                                            />
                                                        </View>

                                                        {/* {values.emergencyPhoneType === 'own' ? (
                                                            <View>
                                                                <Text style={styles.label}>
                                                                    Emergency Contact Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.emergencyContact}
                                                                    />
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Family Emergency Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.FamilyemergencyContact}
                                                                    />
                                                                </View>
                                                                <Text style={styles.label}>
                                                                    Select relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} value={values.emergencyRelation} readOnly />

                                                                {values.emergencyRelation === 'other' && (
                                                                    <>
                                                                        <Text style={styles.label}>
                                                                            Specify the relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.otherEmergencyRelation}
                                                                        />
                                                                    </>
                                                                )}
                                                            </>
                                                        )} */}
                                                    </View>
                                                )}
                                            </View>


                                        </View>
                                    )}



                                    <View style={styles.buttonContainer}>
                                        {step > 0 && (
                                            <TouchableOpacity
                                                onPress={handlePrevious}
                                                style={[styles.button, styles.backButton]}>
                                                <Text style={styles.backButtonText}>Back</Text>
                                            </TouchableOpacity>
                                        )}
                                        {step < totalSteps ? (
                                            <TouchableOpacity
                                                onPress={() => handleNext(validateForm, setFieldTouched)}
                                                style={[styles.button, styles.nextButton]}>
                                                <Text style={styles.nextButtonText}>Next</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={handleSubmit}
                                                style={[styles.button, styles.nextButton]}>
                                                <Text style={styles.nextButtonText}>Submit</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {/* Date Picker Modal */}
                                    {datePickerVisible && (
                                        <DateTimePicker
                                            value={selectedDate}
                                            mode="date"
                                            display="default"
                                            onChange={(event, date) => onDateChange(event, date, setFieldValue)}
                                        />
                                    )}

                                </View>
                            )
                        }}
                    </Formik>


                </ScrollView>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: '120%',
        backgroundColor: 'white',
    },
    indicatorContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    stepIndicator: {
        width: 35,
        height: 35,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#E7E7E7',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStep: {
        borderColor: 'pink',
        backgroundColor: 'pink',
    },
    stepText: {
        color: '#E7E7E7',
        fontWeight: 'bold',
        fontSize: 16,
    },
    activeStepText: {
        color: 'white',
    },
    line: {
        width: 20,
        height: 2,
        backgroundColor: '#E7E7E7',
        marginHorizontal: 5,
    },
    activeLine: {
        backgroundColor: 'pink',
    },
    stepName: {
        marginTop: 5,
        fontSize: 12,
        color: '#888',
    },
    activeStepName: {
        color: 'orange',
        fontWeight: 'bold',
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
    removeIcon: {

        padding: 5,
        backgroundColor: '#FFCCCC',
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 20,
        height: 20,
    },
    iconText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
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

    datePickerText: {
        textAlign: 'center',
        fontSize: hp('2%'),
        color: 'black',
    },

    imagePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: hp('1.5%'),
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    image: {
        width: wp('20%'),
        height: wp('20%'),
        alignSelf: 'center',
        marginBottom: hp('2%'),
    },
    photoPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderColor: '#ccc',
        alignSelf: 'center',
        borderWidth: 1,
    },
    error: {
        color: 'red',
        fontSize: hp('1.5%'),
        marginBottom: hp('2%'),
    },
    imageOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    optionButton: {
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    buttonAdd: {
        borderColor: 'orange',
        borderWidth: 1,
        padding: 12,
        marginVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'orange',
        fontSize: 16,
    },
    cancelIcon: {
        backgroundColor: '#ff4d4d',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ownershipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    skillHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 5,
    },
    skillHeader: {
        flex: 1,
        fontWeight: 'bold',
        color: 'black',
        fontSize: 10
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    languageColumn: {
        flex: 2,
        color: 'black',
        fontSize: 16,
    },
    checkbox: {
        flex: 1,
        alignSelf: 'center',
        borderColor: 'black'
    },
    otherLanguageInputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-between'
    },
    fileInfo: {
        marginTop: 10,
        color: 'gray',
    },
    uploadButton: {
        backgroundColor: '#D9D9D9',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
    },
    uploadButtonText: {
        color: 'gray',
        fontWeight: 'bold',
    },
    fileName: {
        marginTop: 10,
        fontSize: 14,
        color: '#333',
    },

});

export default PartialKIF